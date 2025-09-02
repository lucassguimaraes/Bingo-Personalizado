
import React, { useState, useCallback } from 'react';
import { TrashIcon, UploadIcon, PlusIcon, StarIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const lineThicknessClasses = {
  thin: 'border',
  medium: 'border-2',
  thick: 'border-4',
};

const gridLayoutClasses = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

const BingoGrid = ({ isEditable, className = '', content: contentProp = null, settings: settingsProp = null }) => {
  const { settings: contextSettings, mainGridContent: contextGridContent, setMainGridContent } = useAppContext();
  const settings = settingsProp || contextSettings;
  const mainGridContent = contentProp || contextGridContent;
  
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleContentChange = (index, newContent) => {
    if (contentProp) {
      return;
    }
    const newGridContent = [...mainGridContent];
    newGridContent[index] = newContent;
    setMainGridContent(newGridContent);
  };

  const handleDrop = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverIndex(null);
    if (!isEditable) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          handleContentChange(index, { id: crypto.randomUUID(), type: 'image', content: reader.result });
        };
        reader.readAsDataURL(file);
      }
      e.dataTransfer.clearData();
    }
  }, [isEditable, mainGridContent]);

  const handleTextChange = (e, index) => {
    if (!isEditable) return;
    const newText = e.target.value;
    if (newText) {
        handleContentChange(index, { id: crypto.randomUUID(), type: 'text', content: newText });
    } else {
        handleContentChange(index, null);
    }
  };
  
  const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.blur();
      }
  };

  const isFreeSpaceCenter = settings.isCenterCellFree;
  const centerIndex = isFreeSpaceCenter && settings.gridSize % 2 !== 0 ? Math.floor((settings.gridSize * settings.gridSize) / 2) : -1;
  const lineClass = lineThicknessClasses[settings.lineThickness];

  return (
    <div className={`grid ${gridLayoutClasses[settings.gridSize]} w-full aspect-square ${className}`}>
      {mainGridContent.map((cell, index) => {
        const isCenter = index === centerIndex;
        const cellStyle = {
          backgroundColor: settings.bgColor,
          color: settings.textColor,
          borderColor: settings.lineColor,
        };

        return (
          <div
            key={index}
            className={`relative flex items-center justify-center text-center aspect-square ${lineClass} p-1 group`}
            style={cellStyle}
            onDragOver={(e) => { e.preventDefault(); isEditable && setDraggedOverIndex(index); }}
            onDragLeave={() => isEditable && setDraggedOverIndex(null)}
            onDrop={(e) => handleDrop(e, index)}
          >
            {isCenter && isEditable && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                  <StarIcon className="w-1/3 h-1/3 text-yellow-400 opacity-20" />
              </div>
            )}
            {draggedOverIndex === index && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-30 border-2 border-dashed border-blue-700 flex flex-col items-center justify-center pointer-events-none">
                  <UploadIcon className="w-8 h-8 text-blue-700" />
              </div>
            )}
            
            {cell?.type === 'image' ? (
              <>
                <img src={cell.content} alt={`Conteúdo do bingo ${index + 1}`} className="object-contain w-full h-full" />
                {isEditable && (
                  <button onClick={() => handleContentChange(index, null)} className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </>
            ) : (
              isEditable ? (
                <>
                  <textarea
                    value={cell?.content || ''}
                    onChange={(e) => handleTextChange(e, index)}
                    onFocus={() => setEditingIndex(index)}
                    onBlur={() => setEditingIndex(null)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full bg-transparent text-center resize-none p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    style={{ color: settings.textColor }}
                  />
                  {(!cell?.content && editingIndex !== index) && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                       <PlusIcon className="w-8 h-8 text-slate-300" />
                     </div>
                   )}
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full overflow-hidden p-1">
                   <span className="break-words">{cell?.content}</span>
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BingoGrid;