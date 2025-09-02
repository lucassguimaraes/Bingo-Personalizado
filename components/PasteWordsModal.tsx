
import React, { useState } from 'react';

interface PasteWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (words: string[]) => void;
}

const PasteWordsModal: React.FC<PasteWordsModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const words = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
    onConfirm(words);
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Cole uma Lista de Palavras</h2>
        <p className="text-slate-600 mb-4">Insira uma palavra ou frase por linha. Elas serão adicionadas aos seus "Itens Extras".</p>
        <textarea
          className="w-full h-48 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Palavra 1
Palavra 2
Palavra 3..."
        ></textarea>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Adicionar Palavras
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasteWordsModal;
