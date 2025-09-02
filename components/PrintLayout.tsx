
import React from 'react';
import type { BingoCardData, BingoSettings } from '../types';
import BingoGrid from './BingoGrid';

interface PrintLayoutProps {
  cards: BingoCardData[];
  settings: BingoSettings;
}

const PrintLayout: React.FC<PrintLayoutProps> = ({ cards, settings }) => {
  if (!cards || cards.length === 0) {
    return null;
  }
  
  const gridSettings = {
      bgColor: settings.bgColor,
      textColor: settings.textColor,
      lineColor: settings.lineColor,
      lineThickness: settings.lineThickness,
  };

  return (
    <div className="hidden print:block">
      {cards.map((cardContent, cardIndex) => (
        <div key={cardIndex} className="p-4 w-full h-screen flex flex-col items-center break-after-page" style={{ pageBreakAfter: 'always' }}>
            <div className="w-full max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-4" style={{color: settings.textColor}}>{settings.title}</h1>
                <BingoGrid
                    gridSize={settings.gridSize}
                    content={cardContent}
                    isEditable={false}
                    settings={gridSettings}
                    isFreeSpaceCenter={true}
                />
            </div>
        </div>
      ))}
    </div>
  );
};

export default PrintLayout;
