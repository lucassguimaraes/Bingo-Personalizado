import React, { useState, useEffect, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import BingoGrid from './components/BingoGrid';
import ExtraItems from './components/ExtraItems';
import PasteWordsModal from './components/PasteWordsModal';
import PrintLayout from './components/PrintLayout';
import type { BingoSettings, CellContent, BingoCardData, GridSize } from './types';

const App: React.FC = () => {
    const [settings, setSettings] = useState<BingoSettings>({
        title: 'Bingo Personalizado',
        gridSize: 5,
        numCards: 1,
        bgColor: '#FFFFFF',
        textColor: '#000000',
        lineColor: '#000000',
        lineThickness: 'medium',
        isCenterCellFree: true,
    });

    const [mainGridContent, setMainGridContent] = useState<Array<CellContent | null>>([]);
    const [extraItems, setExtraItems] = useState<Array<CellContent | null>>([]);
    const [generatedCards, setGeneratedCards] = useState<BingoCardData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const newSize = settings.gridSize * settings.gridSize;
        setMainGridContent(Array(newSize).fill(null));
         // Automatically disable fixed center cell for even-sized grids
        if (settings.gridSize % 2 === 0 && settings.isCenterCellFree) {
            setSettings(s => ({...s, isCenterCellFree: false}));
        }
    }, [settings.gridSize]);

    const handleMainGridContentChange = (index: number, newContent: CellContent | null) => {
        const newGridContent = [...mainGridContent];
        newGridContent[index] = newContent;
        setMainGridContent(newGridContent);
    };

    const handleClearBoard = () => {
        if (window.confirm('Você tem certeza de que deseja limpar toda a grade principal?')) {
            const newSize = settings.gridSize * settings.gridSize;
            setMainGridContent(Array(newSize).fill(null));
        }
    };
    
    const handlePasteWords = (words: string[]) => {
        const newItems: CellContent[] = words.map(word => ({
            id: crypto.randomUUID(),
            type: 'text',
            content: word
        }));
        setExtraItems(prev => [...prev, ...newItems]);
    };

    const handleGenerate = useCallback(() => {
        const mainItems = mainGridContent.filter((item): item is CellContent => item !== null);
        const extra = extraItems.filter((item): item is CellContent => item !== null);

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

        const cards: BingoCardData[] = [];
        for (let i = 0; i < settings.numCards; i++) {
            const cardData: BingoCardData = Array(gridSize * gridSize).fill(null);
            
            // Shuffle pool for each card
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

        // Allow state to update before printing
        setTimeout(() => {
            window.print();
        }, 100);

    }, [mainGridContent, extraItems, settings]);

    const gridSettings = {
        bgColor: settings.bgColor,
        textColor: settings.textColor,
        lineColor: settings.lineColor,
        lineThickness: settings.lineThickness,
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
                        settings={settings} 
                        setSettings={setSettings} 
                        onGenerate={handleGenerate}
                        onClearBoard={handleClearBoard}
                    />

                    <div className="flex-grow">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                             <h3 className="text-lg font-semibold text-slate-700 mb-2">Modelo da Grade de Bingo</h3>
                             <p className="text-sm text-slate-500 mb-4">Clique para editar o texto ou arraste e solte uma imagem. Para grades 3x3 e 5x5, você pode fixar o conteúdo da célula central nas configurações.</p>
                            <BingoGrid
                                gridSize={settings.gridSize}
                                content={mainGridContent}
                                onContentChange={handleMainGridContentChange}
                                isEditable={true}
                                settings={gridSettings}
                                isFreeSpaceCenter={settings.isCenterCellFree}
                                className="max-w-xl mx-auto"
                            />
                        </div>
                        <ExtraItems items={extraItems} setItems={setExtraItems} onPasteWords={() => setIsModalOpen(true)}/>
                    </div>
                </div>
            </main>
            
            <PasteWordsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handlePasteWords}
            />

            <PrintLayout cards={generatedCards} settings={settings} />
        </>
    );
};

export default App;