
import React from 'react';
import { ArchivedChat, ArchiveListScreenProps, PersonaDisplayNames, Persona } from '../types';
import BotIcon from './icons/BotIcon'; // Generic bot icon, or specific persona icons
import BacUrtakuIcon from './icons/BacUrtakuIcon';
import DijetariIcon from './icons/DijetariIcon';
import AnalistiIcon from './icons/AnalistiIcon';
import HumoristiIcon from './icons/HumoristiIcon';
import ArtistiIcon from './icons/ArtistiIcon'; 
import MesuesiIcon from './icons/MesuesiIcon'; // Import MesuesiIcon
import TrashIcon from './icons/TrashIcon';
import EyeIcon from './icons/EyeIcon';
import ArchiveIcon from './icons/ArchiveIcon'; // For empty state

const PersonaIcons: Record<Persona, React.FC<{ className?: string }>> = {
  [Persona.BAC_URTAKU]: BacUrtakuIcon,
  [Persona.DIJETARI]: DijetariIcon,
  [Persona.ANALISTI]: AnalistiIcon,
  [Persona.HUMORISTI]: HumoristiIcon,
  [Persona.ARTISTI]: ArtistiIcon,
  [Persona.MESUESI]: MesuesiIcon, // Add MesuesiIcon
};


const ArchiveListScreen: React.FC<ArchiveListScreenProps> = ({
  archivedChats,
  onLoadArchivedChat, // Changed from onViewChat
  onDeleteChat,
  onGoBackToPersonaSelection,
}) => {
  return (
    <div className="flex-grow flex flex-col bg-zinc-900 p-4 md:p-6">
      {archivedChats.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-stone-400">
          <ArchiveIcon className="w-24 h-24 text-zinc-700 mb-6" />
          <h2 className="text-2xl font-semibold text-stone-300 mb-2">Arkiva është bosh</h2>
          <p className="max-w-sm mb-6">Nuk ka ende biseda të arkivuara. Pasi të përfundoni një bisedë, ajo do të shfaqet këtu.</p>
          <button
            onClick={onGoBackToPersonaSelection}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-colors duration-150"
          >
            Fillo një Bisedë të Re
          </button>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto">
          {archivedChats.map((chat) => {
            const PersonaIcon = PersonaIcons[chat.persona] || BotIcon;
            return (
              <div
                key={chat.id}
                className="bg-zinc-800 p-4 rounded-lg shadow-lg border border-zinc-700/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-red-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  <div className="flex-shrink-0 bg-zinc-700 p-2 rounded-full">
                    <PersonaIcon className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-stone-100 truncate" title={chat.title}>
                      {chat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400">
                      {PersonaDisplayNames[chat.persona] || chat.persona} &bull;{' '}
                      {new Date(chat.timestamp).toLocaleDateString('sq-AL', { year: 'numeric', month: 'long', day: 'numeric' })}{' '}
                      {new Date(chat.timestamp).toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })} &bull;{' '}
                      {chat.messageCount} mesazhe
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onLoadArchivedChat(chat.id)} // Changed from onViewChat
                    className="flex items-center gap-1.5 p-2 text-stone-200 bg-red-700 hover:bg-red-600 rounded-md transition-colors text-sm font-medium px-3"
                    aria-label={`Hap bisedën: ${chat.title}`}
                  >
                    <EyeIcon className="w-4 h-4" />
                    Hap
                  </button>
                  <button
                    onClick={() => {
                      try {
                        if (window.confirm(`Jeni të sigurt që doni të fshini bisedën "${chat.title}"? Ky veprim nuk mund të kthehet.`)) {
                          console.log(`[ArchiveListScreen] User confirmed delete for ID: ${chat.id}, Title: "${chat.title}"`);
                          onDeleteChat(chat.id);
                        }
                      } catch (error) {
                        console.error('[ArchiveListScreen] Error during delete confirmation or callback:', error);
                        // Optionally, inform the user of an error here, though App.tsx should also handle it.
                      }
                    }}
                    className="p-2 text-stone-300 hover:text-red-500 bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors"
                    aria-label={`Fshij bisedën: ${chat.title}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ArchiveListScreen;
