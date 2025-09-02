
import React, { useState, useCallback } from 'react';
import type { GridSize, CellContent, BingoSettings } from '../types';
import { TrashIcon, UploadIcon, PlusIcon } from './Icons';

interface BingoGridProps {
  gridSize: GridSize;
  content: Array<CellContent | null>;
  onContentChange?: (index: number, newContent: CellContent | null) => void;
  isEditable: boolean;
  settings: Pick<BingoSettings, 'bgColor' | 'textColor' | 'lineColor' | 'lineThickness'>;
  isFreeSpaceCenter?: boolean;
  className?: string;
}

const lineThicknessClasses: { [key in BingoSettings['lineThickness']]: string } = {
  thin: 'border',
  medium: 'border-2',
  thick: 'border-4',
};

const gridLayoutClasses: { [key in GridSize]: string } = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

const BingoGrid: React.FC<BingoGridProps> = ({ gridSize, content, onContentChange, isEditable, settings, isFreeSpaceCenter = false, className = '' }) => {
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverIndex(null);
    if (!isEditable || !onContentChange) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          onContentChange(index, { id: crypto.randomUUID(), type: 'image', content: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
      e.dataTransfer.clearData();
    }
  }, [isEditable, onContentChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    if (!isEditable || !onContentChange) return;
    const newText = e.target.value;
    if (newText) {
        onContentChange(index, { id: crypto.randomUUID(), type: 'text', content: newText });
    } else {
        onContentChange(index, null);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.blur();
      }
  };

  const centerIndex = isFreeSpaceCenter && gridSize % 2 !== 0 ? Math.floor((gridSize * gridSize) / 2) : -1;
  const lineClass = lineThicknessClasses[settings.lineThickness];

  return (
    <div className={`grid ${gridLayoutClasses[gridSize]} w-full aspect-square ${className}`}>
      {content.map((cell, index) => {
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
            {draggedOverIndex === index && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-30 border-2 border-dashed border-blue-700 flex flex-col items-center justify-center pointer-events-none">
                  <UploadIcon className="w-8 h-8 text-blue-700" />
              </div>
            )}
            
            {cell?.type === 'image' ? (
              <>
                <img src={cell.content} alt={`Conteúdo do bingo ${index + 1}`} className="object-contain w-full h-full" />
                {isEditable && onContentChange && (
                  <button onClick={() => onContentChange(index, null)} className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
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
                    className="w-full h-full bg-transparent text-center resize-none p-1 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
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
