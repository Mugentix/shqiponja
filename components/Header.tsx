
import React from 'react';
import type { HeaderProps } from '../types'; 
import ChangePersonaIcon from './icons/ChangePersonaIcon'; // Ikonë e re

const Header: React.FC<HeaderProps> = ({ currentPersonaName, onShowPersonaSelection }) => {
  return (
    <header className="bg-red-800 text-stone-100 p-3 sm:p-4 shadow-lg sticky top-0 z-30 border-b border-red-900/70">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* Eagle logo removed from here */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Shqiponja AI</h1>
        </div>
        {currentPersonaName && ( // Shfaq vetëm nëse ka një personë të zgjedhur (pra jemi në pamjen e chat-it)
          <div className="flex items-center space-x-3">
            <span className="text-sm sm:text-base font-semibold hidden md:inline">
              Roli: <span className="text-red-200">{currentPersonaName}</span>
            </span>
            <button
              onClick={onShowPersonaSelection}
              className="flex items-center space-x-2 bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              aria-label="Ndrysho rolin e AI"
            >
              <ChangePersonaIcon className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Rolet</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;