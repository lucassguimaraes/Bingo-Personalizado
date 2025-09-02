
import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    title: 'Bingo Personalizado',
    gridSize: 5,
    numCards: 1,
    bgColor: '#FFFFFF',
    textColor: '#000000',
    lineColor: '#000000',
    lineThickness: 'medium',
    isCenterCellFree: true,
  });

  const [mainGridContent, setMainGridContent] = useState(Array(25).fill(null));
  const [extraItems, setExtraItems] = useState([]);

  useEffect(() => {
    const newSize = settings.gridSize * settings.gridSize;
    setMainGridContent(Array(newSize).fill(null));
    
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};