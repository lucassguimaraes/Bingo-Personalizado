import React from 'react';
import BingoGrid from './BingoGrid';

const PrintLayout = ({ cards, settings }) => {
  if (!cards || cards.length === 0) {
    return null;
  }
  
  return (
    <div className="hidden print:block">
      {cards.map((cardContent, cardIndex) => (
        <div key={cardIndex} className="w-full h-full flex flex-col justify-center items-center p-6 break-after-page" style={{ pageBreakAfter: 'always' }}>
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-5xl font-bold text-center mb-10" style={{color: settings.textColor}}>{settings.title}</h1>
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