
import React, { useState, useEffect, useRef } from 'react';
import SparklesIcon from './icons/SparklesIcon';
import MegaphoneIcon from './icons/MegaphoneIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import XMarkIcon from './icons/XMarkIcon';
import type { FloatingContactProps } from '../types'; // Import props type

const FloatingContact: React.FC<FloatingContactProps> = ({ onOpenSalesAssistant }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsMenuOpen(prev => !prev);
  };

  const handleOptionClick = (type: 'advertising' | 'sales') => {
    onOpenSalesAssistant(type);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div ref={menuRef} className="fixed bottom-28 right-6 z-40"> {/* Adjusted bottom to bottom-28 */}
      {isMenuOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-64 bg-zinc-700 rounded-lg shadow-2xl overflow-hidden transition-all duration-200 ease-out origin-bottom-right transform scale-100 opacity-100">
          <div className="p-2">
             <button
                onClick={() => handleOptionClick('advertising')}
                className="w-full flex items-center px-4 py-3 text-sm text-stone-200 hover:bg-red-700/50 rounded-md transition-colors duration-150"
                role="menuitem"
              >
                <MegaphoneIcon className="w-5 h-5 mr-3 text-red-400" />
                Reklamo Këtu
              </button>
              <button
                onClick={() => handleOptionClick('sales')}
                className="w-full flex items-center px-4 py-3 text-sm text-stone-200 hover:bg-red-700/50 rounded-md transition-colors duration-150"
                role="menuitem"
              >
                <TrendingUpIcon className="w-5 h-5 mr-3 text-red-400" />
                Rrit Shitjet me AI
              </button>
          </div>
           <button 
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false);}} 
            className="absolute top-1 right-1 p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
            aria-label="Mbyll menunë"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      <button
        onClick={toggleMenu}
        className={`p-4 rounded-full text-white shadow-xl transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${isMenuOpen ? 'bg-red-700 hover:bg-red-800 focus:ring-red-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-400'}`}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Mbyll menunë e kontaktit" : "Hap menunë e kontaktit"}
      >
        {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <SparklesIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default FloatingContact;