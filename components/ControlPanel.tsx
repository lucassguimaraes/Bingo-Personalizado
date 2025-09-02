import React from 'react';
import type { BingoSettings, GridSize } from '../types';

interface ControlPanelProps {
  settings: BingoSettings;
  setSettings: React.Dispatch<React.SetStateAction<BingoSettings>>;
  onGenerate: () => void;
  onClearBoard: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, setSettings, onGenerate, onClearBoard }) => {
  const handleSettingChange = <K extends keyof BingoSettings>(key: K, value: BingoSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const apectRatio = 1/1;

  const InputField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="w-full lg:w-96 bg-white p-6 rounded-lg shadow-lg flex-shrink-0">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Configurações do Bingo</h2>
      
      <div className="space-y-6">
        <InputField label="Título do Bingo">
          <input
            type="text"
            value={settings.title}
            onChange={(e) => handleSettingChange('title', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </InputField>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Tamanho da Grade">
            <select
              value={settings.gridSize}
              onChange={(e) => handleSettingChange('gridSize', parseInt(e.target.value) as GridSize)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="3">3x3</option>
              <option value="4">4x4</option>
              <option value="5">5x5</option>
            </select>
          </InputField>
          <InputField label="Número de Cartelas">
            <input
              type="number"
              min="1"
              value={settings.numCards}
              onChange={(e) => handleSettingChange('numCards', parseInt(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </InputField>
        </div>

        {settings.gridSize % 2 !== 0 && (
          <div className="flex items-center justify-between pt-2">
            <label htmlFor="free-center-cell" className="text-sm font-medium text-slate-600 select-none cursor-pointer">
              Fixar célula do meio?
            </label>
            <input
              id="free-center-cell"
              type="checkbox"
              checked={settings.isCenterCellFree}
              onChange={(e) => handleSettingChange('isCenterCellFree', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        )}

        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Cores e Estilo</label>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                    <input type="color" value={settings.bgColor} onChange={(e) => handleSettingChange('bgColor', e.target.value)} className="w-8 h-8 rounded border-slate-300" />
                    <span className="text-sm text-slate-500">Fundo</span>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="color" value={settings.textColor} onChange={(e) => handleSettingChange('textColor', e.target.value)} className="w-8 h-8 rounded border-slate-300" />
                    <span className="text-sm text-slate-500">Texto</span>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="color" value={settings.lineColor} onChange={(e) => handleSettingChange('lineColor', e.target.value)} className="w-8 h-8 rounded border-slate-300" />
                    <span className="text-sm text-slate-500">Linhas</span>
                </div>
                 <InputField label="Espessura da Linha">
                    <select
                    value={settings.lineThickness}
                    onChange={(e) => handleSettingChange('lineThickness', e.target.value as BingoSettings['lineThickness'])}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                    <option value="thin">Fina</option>
                    <option value="medium">Média</option>
                    <option value="thick">Grossa</option>
                    </select>
                </InputField>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-200 space-y-3">
             <button
                onClick={onGenerate}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
            >
                Gerar e Imprimir
            </button>
             <button
                onClick={onClearBoard}
                className="w-full py-2 px-4 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-150"
            >
                Limpar Grade Principal
            </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;