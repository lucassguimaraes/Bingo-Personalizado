import React from 'react';
import BingoGrid from './BingoGrid';

const PrintLayout = ({ cards, settings, onBack }) => {
    return (
        <>
            <header className="p-4 bg-slate-200 print:hidden flex justify-center sticky top-0 z-10 shadow-md">
                <button 
                    onClick={onBack}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                    Voltar para o Editor
                </button>
            </header>
            <main className="bg-white">
                {cards.map((cardContent, index) => (
                    <div 
                        key={index} 
                        className="w-full h-screen p-8 flex flex-col items-center justify-center print:p-0 print:h-auto print:break-after-page"
                    >
                        <div className="w-full max-w-2xl">
                            <h1 className="text-4xl font-bold text-center mb-8" style={{ color: settings.textColor }}>
                                {settings.title}
                            </h1>
                            <BingoGrid
                                content={cardContent}
                                isEditable={false}
                                settings={settings}
                            />
                        </div>
                    </div>
                ))}
            </main>
        </>
    );
};

export default PrintLayout;
