
import React from 'react';
import BingoGrid from './BingoGrid';

const PrintLayout = ({ cards, settings }) => {
  if (!cards || cards.length === 0) {
    return null;
  }
  
  return (
    <div className="hidden print:block">
      {cards.map((cardContent, cardIndex) => (
        <div key={cardIndex} className="p-4 w-full h-screen flex flex-col items-center break-after-page" style={{ pageBreakAfter: 'always' }}>
            <div className="w-full max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-4" style={{color: settings.textColor}}>{settings.title}</h1>
                <BingoGrid
                    content={cardContent}
                    isEditable={false}
                    settings={settings}
                />
            </div>
        </div>
      ))}
    </div>
  );
};

export default PrintLayout;