import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { BingoSettings, CellContent } from '../types';

interface AppContextType {
  settings: BingoSettings;
  setSettings: React.Dispatch<React.SetStateAction<BingoSettings>>;
  mainGridContent: Array<CellContent | null>;
  setMainGridContent: React.Dispatch<React.SetStateAction<Array<CellContent | null>>>;
  extraItems: Array<CellContent | null>;
  setExtraItems: React.Dispatch<React.SetStateAction<Array<CellContent | null>>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const [mainGridContent, setMainGridContent] = useState<Array<CellContent | null>>(Array(25).fill(null));
  const [extraItems, setExtraItems] = useState<Array<CellContent | null>>([]);

  useEffect(() => {
    const newSize = settings.gridSize * settings.gridSize;
    // Reset grid content when size changes to avoid layout issues
    setMainGridContent(Array(newSize).fill(null));
    
    // Automatically disable fixed center cell for even-sized grids
    if (settings.gridSize % 2 === 0 && settings.isCenterCellFree) {
        setSettings(s => ({...s, isCenterCellFree: false}));
    }
  }, [settings.gridSize]);

  const value = {
    settings,
    setSettings,
    mainGridContent,
    setMainGridContent,
    extraItems,
    setExtraItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
