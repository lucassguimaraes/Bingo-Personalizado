
import React, { useState } from 'react';
import { PlusIcon, TrashIcon, UploadIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const ExtraItemCell = ({ item, onChange, onRemove }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        if (newText) {
            onChange({ id: item?.id || crypto.randomUUID(), type: 'text', content: newText });
        } else {
            onChange(null);
        }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.blur();
      }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    onChange({ id: item?.id || crypto.randomUUID(), type: 'image', content: reader.result });
                };
                reader.readAsDataURL(file);
            }
        }
    };

    return (
        <div 
            className="relative group w-28 h-28 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            {isDragging && <div className="absolute inset-0 bg-blue-100 rounded-lg flex items-center justify-center"><UploadIcon className="w-8 h-8 text-blue-500" /></div>}
            
            {item ? (
                <>
                    {item.type === 'image' ? (
                        <img src={item.content} alt="Item extra" className="object-contain w-full h-full rounded-lg" />
                    ) : (
                        <textarea
                            value={item.content}
                            onChange={handleTextChange}
                            onKeyDown={handleKeyDown}
                            className="w-full h-full bg-transparent text-center resize-none p-1 focus:outline-none rounded-md text-slate-800"
                        />
                    )}
                     <button onClick={onRemove} className="absolute -top-2 -right-2 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </>
            ) : (
                 <textarea
                    value=""
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite ou solte a imagem"
                    className="w-full h-full bg-transparent text-center text-xs resize-none p-1 focus:outline-none rounded-md"
                />
            )}
        </div>
    );
};


const ExtraItems = ({ onPasteWords, onClearAll }) => {
    const { extraItems, setExtraItems } = useAppContext();
    
    const handleItemChange = (index, newItem) => {
        const newItems = [...extraItems];
        newItems[index] = newItem;
        setExtraItems(newItems.filter(item => item !== null)); // Clean up empty items
    };

    const handleAddItem = () => {
        setExtraItems([...extraItems, null]);
    };
    
    const handleRemoveItem = (index) => {
        const newItems = extraItems.filter((_, i) => i !== index);
        setExtraItems(newItems);
    }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-semibold text-slate-700 mb-2">Itens Extras</h3>
      <p className="text-sm text-slate-500 mb-4">Adicione mais palavras ou imagens aqui. Estes serão usados aleatoriamente para preencher as cartelas de bingo geradas, garantindo que cada cartela seja única.</p>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {extraItems.map((item, index) => (
          <ExtraItemCell key={item?.id || index} item={item} onChange={(newItem) => handleItemChange(index, newItem)} onRemove={() => handleRemoveItem(index)} />
        ))}
        <button onClick={handleAddItem} className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors">
            <PlusIcon className="w-8 h-8" />
            <span className="text-sm mt-1">Adicionar Item</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
        <button onClick={onPasteWords} className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors">Colar Lista de Palavras</button>
        <button onClick={onClearAll} className="px-4 py-2 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors">Limpar Itens Extras</button>
      </div>
    </div>
  );
};

export default ExtraItems;