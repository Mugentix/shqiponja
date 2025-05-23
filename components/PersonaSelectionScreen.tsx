
import React from 'react';
import { Persona, PersonaSelectionScreenProps, PersonaDisplayNames } from '../types';
import PersonaCard from './PersonaCard';
import BacUrtakuIcon from './icons/BacUrtakuIcon';
import DijetariIcon from './icons/DijetariIcon';
import AnalistiIcon from './icons/AnalistiIcon';
import HumoristiIcon from './icons/HumoristiIcon';
import ArtistiIcon from './icons/ArtistiIcon'; 
import MesuesiIcon from './icons/MesuesiIcon';
import SparklesIcon from './icons/SparklesIcon'; 
import BotIcon from './icons/BotIcon'; 
import ArchiveIcon from './icons/ArchiveIcon'; 
import { getDailyChallengeForPersona } from '../services/challengeService'; // Import daily challenge service

const personaDetailsList = [
  { 
    persona: Persona.BAC_URTAKU, 
    name: PersonaDisplayNames[Persona.BAC_URTAKU], 
    tagline: "Urtësia e të parëve, zëri i Kanunit. Këshilla dhe histori plot vlerë.",
    icon: <BacUrtakuIcon /> 
  },
  { 
    persona: Persona.DIJETARI, 
    name: PersonaDisplayNames[Persona.DIJETARI], 
    tagline: "Dituria pa kufi, shkenca në shërbimin tuaj. Përgjigje të sakta e të qarta.",
    icon: <DijetariIcon /> 
  },
  { 
    persona: Persona.ANALISTI, 
    name: PersonaDisplayNames[Persona.ANALISTI], 
    tagline: "Vështrim i thellë mbi ngjarjet, lajmi pas lajmit. Perspektivë kritike.",
    icon: <AnalistiIcon /> 
  },
  { 
    persona: Persona.HUMORISTI, 
    name: PersonaDisplayNames[Persona.HUMORISTI], 
    tagline: "Batuta pa filter, e qeshura pa limit! Humori pikant shqiptar.",
    icon: <HumoristiIcon /> 
  },
  { 
    persona: Persona.ARTISTI, 
    name: PersonaDisplayNames[Persona.ARTISTI], 
    tagline: "Pikturo imagjinatën tënde! Më jep një ide, unë e sjell në jetë me ngjyra.",
    icon: <ArtistiIcon /> 
  },
  { 
    persona: Persona.MESUESI, 
    name: PersonaDisplayNames[Persona.MESUESI], 
    tagline: "Mëso dhe zbulo! Shpjegime të qarta, ndihmë me detyra, dhe dije e re.",
    icon: <MesuesiIcon /> 
  },
];

const PersonaSelectionScreen: React.FC<PersonaSelectionScreenProps> = ({ onSelectPersona, currentPersona, onOpenSalesAssistantModal, onNavigateToArchive }) => {
  
  const personaDetailsWithChallenges = personaDetailsList.map(detail => ({
    ...detail,
    dailyChallengeText: getDailyChallengeForPersona(detail.persona) || undefined, // Get challenge text
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-red-900/30 flex flex-col items-center justify-center p-4 md:p-8 text-stone-100 selection:bg-red-500 selection:text-white">
      <div className="text-center mb-10 md:mb-12 mt-8">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-stone-200 drop-shadow-md">
            Shqiponja AI
          </h1>
        </div>
        <p className="text-lg md:text-xl text-stone-300 font-light max-w-2xl mx-auto">
          Zgjidhni bashkëbiseduesin tuaj. Secili me personalitetin dhe dijen e vet, gati t'ju shoqërojë në një bisedë unike. Shikoni për "Sfidat e Ditës"!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mb-10 md:mb-12">
        {personaDetailsWithChallenges.map((detail) => (
          <PersonaCard
            key={detail.persona}
            persona={detail.persona}
            name={detail.name}
            tagline={detail.tagline}
            icon={detail.icon}
            onSelect={() => onSelectPersona(detail.persona)}
            isSelected={currentPersona === detail.persona}
            dailyChallengeText={detail.dailyChallengeText} // Pass challenge text
          />
        ))}
      </div>
      
      <div className="mb-10 md:mb-12 w-full max-w-xs text-center">
        <button
            onClick={onNavigateToArchive}
            className="w-full flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-stone-200 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 text-base"
            aria-label="Shiko arkivën e bisedave"
          >
            <ArchiveIcon className="w-5 h-5 mr-2.5" />
            Arkiva e Bisedave
        </button>
      </div>


      <footer className="w-full max-w-3xl text-center text-stone-500 pb-8">
        <div className="mt-8 mb-10 p-6 bg-zinc-800/60 backdrop-blur-sm rounded-xl shadow-xl w-full text-center border border-zinc-700/70">
          <div className="flex items-center justify-center mb-3">
            <SparklesIcon className="w-7 h-7 text-red-400 mr-2.5" />
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-100">
              Gati për Rritje te Biznesit tuaj?
            </h2>
            <SparklesIcon className="w-7 h-7 text-red-400 ml-2.5" />
          </div>
          <p className="text-stone-300/90 mb-6 text-sm sm:text-base max-w-lg mx-auto">
            Shqiponja AI fuqizon biznesin tuaj! Diskutoni me asistentin tonë virtual për të zbuluar zgjidhje AI për reklamim të suksesshëm dhe rritje të shitjeve.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <button
              onClick={() => onOpenSalesAssistantModal('business_inquiry')}
              className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-75 text-base"
              aria-label="Diskuto mundësitë e biznesit me AI"
            >
              <BotIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2.5" />
              Transformo Biznesin me AI
            </button>
          </div>
        </div>
        <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} Shqiponja AI. Të gjitha të drejtat e rezervuara (ose jo, qysh t'dush).</p>
      </footer>
    </div>
  );
};

export default PersonaSelectionScreen;
