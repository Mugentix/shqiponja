
import React from 'react';
import type { PersonaCardProps } from '../types';

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, name, tagline, icon, onSelect, isSelected }) => {
  return (
    <div 
      className={`
        bg-zinc-800/70 backdrop-blur-md rounded-2xl p-6 md:p-8 
        flex flex-col items-center text-center 
        shadow-2xl hover:shadow-red-800/40 
        transition-all duration-300 ease-in-out 
        transform hover:-translate-y-2 cursor-pointer
        border border-transparent hover:border-red-700/50
        ${isSelected ? 'ring-2 ring-red-500 border-red-600 shadow-red-700/60' : 'border-zinc-700/50'}
      `}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-label={`Zgjidh rolin: ${name}`}
      aria-pressed={isSelected}
    >
      <div className={`w-20 h-20 md:w-24 md:h-24 mb-5 p-3 rounded-full flex items-center justify-center transition-colors duration-300 ${isSelected ? 'bg-red-600/20 text-red-400' : 'bg-zinc-700/50 text-stone-300 group-hover:text-red-500'}`}>
        {/* Fix: Cast icon to React.ReactElement with a props type that includes className */}
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-12 h-12 md:w-14 md:h-14 transition-transform duration-300 group-hover:scale-110" })}
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-stone-100 mb-2 tracking-tight">{name}</h3>
      <p className="text-sm text-stone-400 mb-6 leading-relaxed h-12 md:h-16 line-clamp-3">{tagline}</p>
      <button 
        className={`
          w-full py-3 px-6 rounded-lg font-semibold text-sm md:text-base
          transition-all duration-300 ease-in-out transform 
          focus:outline-none focus:ring-2 focus:ring-opacity-75
          ${isSelected 
            ? 'bg-red-600 text-white shadow-lg hover:bg-red-500 focus:ring-red-400' 
            : 'bg-zinc-700 text-stone-200 hover:bg-red-700 hover:text-white shadow-md hover:shadow-lg focus:ring-red-500'
          }
          hover:scale-105
        `}
        onClick={(e) => { e.stopPropagation(); onSelect(); }} // Prevent card click from firing twice
        aria-label={`Aktivizo rolin ${name}`}
      >
        Zgjidh {name}
      </button>
    </div>
  );
};

export default PersonaCard;