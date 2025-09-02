
import React from 'react';

const GenerationProgressModal = ({ isOpen, current, total }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Gerando Imagens</h2>
        <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600">Por favor, aguarde...</p>
        </div>
        {total > 0 && (
          <p className="text-sm text-slate-500">
            Processando cartela: <span className="font-semibold">{current}</span> de <span className="font-semibold">{total}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default GenerationProgressModal;
