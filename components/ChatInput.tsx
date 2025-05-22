
import React, { useState, useRef } from 'react';
import SendIcon from './icons/SendIcon';
import LoadingSpinner from './common/LoadingSpinner';
import PaperclipIcon from './icons/PaperclipIcon';
import XCircleIcon from './icons/XCircleIcon';
import StopIcon from './icons/StopIcon'; // New: Import StopIcon
import { Persona, ChatInputProps } from '../types'; 

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, currentPersona, onStopGeneration }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isArtistiPersona = currentPersona === Persona.ARTISTI;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isArtistiPersona) return; 

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert('Formati i skedarit nuk suportohet. Ju lutem zgjidhni një imazh (jpg, png, gif, webp).');
        setSelectedFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = ""; 
        }
      }
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading && onStopGeneration) { // If loading, this button becomes a stop button
      onStopGeneration();
    } else if ((inputValue.trim() || (selectedFile && !isArtistiPersona)) && !isLoading) {
      onSendMessage(inputValue.trim(), isArtistiPersona ? undefined : selectedFile || undefined);
      setInputValue('');
      if (!isArtistiPersona) {
        clearSelectedFile();
      }
    }
  };

  const triggerFileInput = () => {
    if (isArtistiPersona) return;
    fileInputRef.current?.click();
  };
  
  const placeholderText = isArtistiPersona 
    ? "Përshkruaj imazhin që dëshiron të pikturoj..." 
    : "Shkruaj mesazhin tënd...";
  
  const canSubmitMessage = (inputValue.trim() || (selectedFile && !isArtistiPersona));

  return (
    <div className="bg-zinc-800 p-3 sm:p-4 border-t border-zinc-700/70 sticky bottom-0 shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.1),_0_-2px_8px_-2px_rgba(0,0,0,0.06)]">
      <form onSubmit={handleSubmit} className="space-y-2">
        {selectedFile && !isArtistiPersona && (
          <div className="flex items-center justify-between bg-zinc-700 p-2 rounded-md text-sm text-stone-300 shadow-sm">
            <span className="truncate">Skedari: {selectedFile.name}</span>
            <button
              type="button"
              onClick={clearSelectedFile}
              className="text-stone-400 hover:text-red-500"
              aria-label="Hiqe skedarin e zgjedhur"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {!isArtistiPersona && (
            <>
              <button
                type="button"
                onClick={triggerFileInput}
                className="p-3 text-stone-400 hover:text-red-500 focus:outline-none transition-colors rounded-full hover:bg-zinc-700 hover:shadow-md"
                aria-label="Bashkëngjit skedar"
                disabled={isLoading}
              >
                <PaperclipIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif, image/webp"
                aria-hidden="true"
              />
            </>
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholderText}
            className="flex-grow p-3 border border-zinc-600 rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-shadow bg-zinc-700 text-stone-100 placeholder-stone-400 shadow-inner"
            disabled={isLoading && !!onStopGeneration} // Disable text input if it's a stop button context, but allow submit
            aria-label="Fusha për të shkruar mesazhin"
          />
          <button
            type="submit"
            className={`bg-red-700 text-white p-3 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all duration-150 shadow-md hover:shadow-lg 
                        ${isLoading && onStopGeneration ? 'bg-yellow-600 hover:bg-yellow-500' : ''}
                        ${(!isLoading && !canSubmitMessage) ? 'opacity-60 cursor-not-allowed' : ''}
                      `}
            disabled={!isLoading && !canSubmitMessage} // Disable send if not loading and no content
            aria-label={isLoading && onStopGeneration ? "Ndalo gjenerimin" : "Dërgo mesazhin"}
          >
            {isLoading && onStopGeneration ? <StopIcon className="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
