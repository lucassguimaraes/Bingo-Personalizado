
import React from 'react';
import BingoGrid from './BingoGrid';

const CardRenderer = ({ content, settings }) => {
  if (!content || !settings) {
    return null;
  }
  
  return (
    <div className="p-6" style={{ width: '800px', backgroundColor: settings.bgColor }}>
        <div className="w-full mx-auto flex flex-col items-center">
            <h1 className="text-5xl font-bold text-center mb-8" style={{color: settings.textColor}}>{settings.title}</h1>
            <BingoGrid
                content={content}
                isEditable={false}
                settings={settings}
            />
        </div>
    </div>
  );
};

export default CardRenderer;
