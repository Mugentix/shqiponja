
import React from 'react';
import type { HeaderProps } from '../types'; 
import ChangePersonaIcon from './icons/ChangePersonaIcon';
import ArchiveIcon from './icons/ArchiveIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { PersonaDisplayNames, Persona } from '../types'; // Ensure Persona is imported if used for casting

const Header: React.FC<HeaderProps> = ({ 
  currentPersonaName, 
  onShowPersonaSelection, 
  onNavigateToArchive,
  currentView,
  onGoBack
}) => {
  let title = "Shqiponja AI";
  let showPersonaControls = false;
  let showArchiveButton = false;
  let showBackButton = false;

  switch(currentView) {
    case 'chat':
      // Ensure currentPersonaName is a valid Persona key before accessing PersonaDisplayNames
      const personaKey = currentPersonaName as Persona;
      title = currentPersonaName ? `Bisedë me ${PersonaDisplayNames[personaKey] || currentPersonaName}` : "Shqiponja AI Chat";
      showPersonaControls = true;
      showArchiveButton = true;
      break;
    case 'personaSelection':
      title = "Zgjidhni Rolin";
      showArchiveButton = true; 
      break;
    case 'archiveList':
      title = "Arkiva e Bisedave";
      showBackButton = true;
      break;
    // 'viewingArchivedChat' case removed
  }

  return (
    <header className="bg-red-800 text-stone-100 p-3 sm:p-4 shadow-lg sticky top-0 z-30 border-b border-red-900/70">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && onGoBack && (
            <button
              onClick={onGoBack}
              className="mr-2 sm:mr-3 p-2 rounded-full hover:bg-red-700 transition-colors"
              aria-label="Kthehu mbrapa"
            >
              <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {showPersonaControls && currentPersonaName && (
            <button
              onClick={onShowPersonaSelection}
              className="flex items-center space-x-2 bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              aria-label="Ndrysho rolin e AI"
            >
              <ChangePersonaIcon className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Rolet</span>
            </button>
          )}
          {showArchiveButton && onNavigateToArchive && (
             <button
              onClick={onNavigateToArchive}
              className="flex items-center space-x-2 bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              aria-label="Shiko arkivën e bisedave"
            >
              <ArchiveIcon className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Arkiva</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;