import React from 'react';
import BingoGrid from './BingoGrid';

const PrintLayout = ({ cards, settings }) => {
  if (!cards || cards.length === 0) {
    return null;
  }
  
  return (
    <div className="hidden print:block">
      {cards.map((cardContent, cardIndex) => (
        <div key={cardIndex} className="w-full py-8 break-after-page" style={{ pageBreakAfter: 'always' }}>
            <div className="w-full max-w-xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl font-bold text-center mb-8" style={{color: settings.textColor}}>{settings.title}</h1>
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