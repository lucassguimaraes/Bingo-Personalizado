
import React, { useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import BingoGrid from './components/BingoGrid';
import ExtraItems from './components/ExtraItems';
import PasteWordsModal from './components/PasteWordsModal';
import PrintLayout from './components/PrintLayout';
import ConfirmationModal from './components/ConfirmationModal';
import { useAppContext } from './context/AppContext';

const SAVE_KEY = 'bingoGeneratorState';

const App = () => {
    const {
        settings,
        setSettings,
        mainGridContent,
        setMainGridContent,
        extraItems,
        setExtraItems,
    } = useAppContext();

    const [generatedCards, setGeneratedCards] = useState([]);
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
    // FIX: Explicitly type the confirmation state to allow ReactNode in message. This resolves multiple type errors.
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: React.ReactNode;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    const handleClearBoard = () => {
        setConfirmation({
            isOpen: true,
            title: 'Limpar Grade Principal?',
            message: <p>Você tem certeza de que deseja remover todo o conteúdo da grade principal?</p>,
            onConfirm: () => {
                const newSize = settings.gridSize * settings.gridSize;
                setMainGridContent(Array(newSize).fill(null));
                setConfirmation(prev => ({ ...prev, isOpen: false }));
            }
        });
    };
    
    const handleClearExtraItems = () => {
        setConfirmation({
            isOpen: true,
            title: 'Limpar Itens Extras?',
            message: <p>Você tem certeza de que deseja remover todos os itens extras?</p>,
            onConfirm: () => {
                setExtraItems([]);
                setConfirmation(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handlePasteWords = (words) => {
        const newItems = words.map(word => ({
            id: crypto.randomUUID(),
            type: 'text',
            content: word
        }));
        setExtraItems(prev => [...prev.filter(item => item !== null), ...newItems]);
    };

    const handleGenerate = useCallback(() => {
        const mainItems = mainGridContent.filter((item) => item !== null);
        const extra = extraItems.filter((item) => item !== null);

        const allItems = [...mainItems, ...extra];
        const uniqueItems = Array.from(new Map(allItems.map(item => [item.content, item])).values());

        const gridSize = settings.gridSize;
        const isOdd = gridSize % 2 !== 0;
        
        const isCenterFixed = isOdd && settings.isCenterCellFree;
        const centerIndex = isOdd ? Math.floor((gridSize * gridSize) / 2) : -1;
        
        const freeSpaceContent = isCenterFixed ? mainGridContent[centerIndex] : null;
        
        let pool = [...uniqueItems];
        if (isCenterFixed && freeSpaceContent) {
           pool = uniqueItems.filter(item => item.content !== freeSpaceContent.content);
        }
        
        const requiredItems = (gridSize * gridSize) - (isCenterFixed ? 1 : 0);
        if (pool.length < requiredItems) {
            alert(`Você precisa de pelo menos ${requiredItems} itens únicos ${isCenterFixed ? "(excluindo o espaço central)" : ""} para gerar as cartelas. Atualmente, você tem ${pool.length}.`);
            return;
        }

        const cards = [];
        for (let i = 0; i < settings.numCards; i++) {
            const cardData = Array(gridSize * gridSize).fill(null);
            
            const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
            const cardItems = shuffledPool.slice(0, requiredItems);
            
            let itemIndex = 0;
            for (let j = 0; j < cardData.length; j++) {
                if (j === centerIndex && isCenterFixed) {
                    cardData[j] = freeSpaceContent;
                } else {
                    cardData[j] = cardItems[itemIndex++];
                }
            }
            cards.push(cardData);
        }

        setGeneratedCards(cards);

        setTimeout(() => {
            window.print();
        }, 100);

    }, [mainGridContent, extraItems, settings]);
    
    const handleSave = () => {
        try {
            const stateToSave = {
                settings,
                mainGridContent,
                extraItems,
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
            alert('Sua sessão foi salva!');
        } catch (error) {
            console.error("Failed to save state:", error);
            alert('Ocorreu um erro ao salvar a sessão.');
        }
    };

    const handleLoad = () => {
        const savedState = localStorage.getItem(SAVE_KEY);
        if (savedState) {
            setConfirmation({
                isOpen: true,
                title: 'Carregar Sessão Salva?',
                message: <p>Isso substituirá sua configuração atual. Deseja continuar?</p>,
                onConfirm: () => {
                     try {
                        const loadedState = JSON.parse(savedState);
                        setSettings(loadedState.settings);
                        setMainGridContent(loadedState.mainGridContent);
                        setExtraItems(loadedState.extraItems);
                    } catch (error) {
                        console.error("Failed to load state:", error);
                        alert('Ocorreu um erro ao carregar a sessão. Os dados podem estar corrompidos.');
                    } finally {
                        setConfirmation(prev => ({ ...prev, isOpen: false }));
                    }
                }
            });
        } else {
            alert('Nenhuma sessão salva foi encontrada.');
        }
    };

    return (
        <>
            <main className="p-4 lg:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">{settings.title}</h1>
                    <p className="mt-2 text-lg text-slate-600">Crie suas próprias cartelas de bingo para qualquer ocasião!</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    <ControlPanel 
                        onGenerate={handleGenerate}
                        onClearBoard={handleClearBoard}
                        onSave={handleSave}
                        onLoad={handleLoad}
                    />

                    <div className="flex-grow">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                             <h3 className="text-lg font-semibold text-slate-700 mb-2">Modelo da Grade de Bingo</h3>
                             <p className="text-sm text-slate-500 mb-4">Clique para editar o texto ou arraste e solte uma imagem. Para grades 3x3 e 5x5, você pode fixar o conteúdo da célula central nas configurações.</p>
                            <BingoGrid
                                isEditable={true}
                                className="max-w-xl mx-auto"
                            />
                        </div>
                        <ExtraItems 
                            onPasteWords={() => setIsPasteModalOpen(true)}
                            onClearAll={handleClearExtraItems}
                        />
                    </div>
                </div>
            </main>
            
            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({...prev, isOpen: false}))}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
            >
                {confirmation.message}
            </ConfirmationModal>

            <PasteWordsModal
                isOpen={isPasteModalOpen}
                onClose={() => setIsPasteModalOpen(false)}
                onConfirm={handlePasteWords}
            />

            <PrintLayout cards={generatedCards} settings={settings} />
        </>
    );
};

export default App;