import React, { useState } from 'react';
import { Message, SenderType, MessageItemProps, Persona } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import LinkIcon from './icons/LinkIcon';
import DownloadIcon from './icons/DownloadIcon';
import EyeIcon from './icons/EyeIcon';
import RefreshIcon from './icons/RefreshIcon'; 
import CopyIcon from './icons/CopyIcon';     
import MarkdownRenderer from './MarkdownRenderer'; 

const MessageItem: React.FC<MessageItemProps> = ({ message, onRegenerateImage, onCopyText }) => {
  const isUser = message.sender === SenderType.USER;
  const hasSources = message.groundingSources && message.groundingSources.length > 0;
  const isAiImage = message.sender === SenderType.AI && message.imageUrl;
  const [copiedState, setCopiedState] = useState<{ id: string; type: 'text' | 'prompt' } | null>(null);

  const handleCopy = (text: string, type: 'text' | 'prompt') => {
    if (onCopyText) {
      onCopyText(text);
      setCopiedState({ id: message.id, type });
      setTimeout(() => setCopiedState(null), 2000);
    }
  };
  
  const getDownloadFileName = () => {
    if (message.originalPromptForImage) {
      return `${message.originalPromptForImage.substring(0, 30).replace(/\s+/g, '_')}_shqiponja_ai.jpeg`;
    }
    if (message.text && message.text.includes('bazuar në përshkrimin: "')) {
      try {
        const description = message.text.split('bazuar në përshkrimin: "')[1].split('"')[0];
        return `${description.substring(0, 30).replace(/\s+/g, '_')}_shqiponja_ai.jpeg`;
      } catch (e) { /* fallback */ }
    }
    return 'shqiponja_ai_pikture.jpeg';
  };

  const extractPromptFromAiMessage = (aiText: string): string | null => {
    const match = aiText.match(/bazuar në përshkrimin: "(.*?)"/);
    return match && match[1] ? match[1] : null;
  };
  
  const originalPromptForThisImage = message.originalPromptForImage || (isAiImage ? extractPromptFromAiMessage(message.text) : null);

  return (
    <div 
      className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} 
        animate-message-appear opacity-0 translate-y-4 animate-[message-appear_0.3s_ease-out_forwards]`}
    >
      <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`p-1.5 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 
          ${isUser ? 'ml-2 bg-gradient-to-br from-slate-400 to-slate-600' : 'mr-2 bg-gradient-to-br from-red-500 to-red-700'}`}>
          {isUser ? 
            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-100" /> : 
            <BotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-100" />
          }
        </div>
        <div
          className={`relative px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-[1.02]
            ${isUser 
              ? 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 text-stone-100 rounded-br-none' 
              : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-stone-100 rounded-bl-none'
            }`}
        >
          {isAiImage && (
            <div className="mb-2 transform transition-transform duration-300 hover:scale-[1.02]">
              <img 
                src={message.imageUrl} 
                alt={originalPromptForThisImage || "Imazh i gjeneruar nga AI"}
                className="rounded-lg shadow-lg max-w-full h-auto"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
          )}

          {message.text && (
            isUser || !message.imageUrl || (message.imageUrl && message.text !== 'Po pikturoj idenë tënde...' && !message.text.startsWith("Ja çfarë krijova")) || (message.text.startsWith("Ja çfarë krijova")) ? (
              <div className="prose prose-invert max-w-none">
                {message.sender === SenderType.AI ? 
                  <MarkdownRenderer content={message.text} /> : 
                  <p className="text-sm sm:text-base whitespace-pre-wrap">{message.text}</p>
                }
              </div>
            ) : null
          )}
           {message.text.startsWith("Ja çfarë krijova") && isAiImage && (
             <p className="text-sm sm:text-base whitespace-pre-wrap mt-1">{message.text}</p>
           )}
          
          {isAiImage && onRegenerateImage && originalPromptForThisImage && (
            <div className="mt-2 pt-2 border-t border-red-400/30 flex items-center justify-end space-x-1 sm:space-x-2">
              <button
                onClick={() => onRegenerateImage(originalPromptForThisImage, message.id)}
                className="p-1.5 sm:p-2 text-red-200 hover:text-white hover:bg-red-500/50 rounded-full transition-colors duration-150"
                aria-label="Rigjenero imazhin"
                title="Rigjenero imazhin"
              >
                <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => handleCopy(originalPromptForThisImage, 'prompt')}
                className="p-1.5 sm:p-2 text-red-200 hover:text-white hover:bg-red-500/50 rounded-full transition-colors duration-150"
                aria-label="Kopjo përshkrimin e imazhit"
                title="Kopjo përshkrimin"
              >
                {copiedState?.type === 'prompt' && copiedState.id === message.id ? <span className="text-xs">U kopjua!</span> : <CopyIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <a
                href={message.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 text-red-200 hover:text-white hover:bg-red-500/50 rounded-full transition-colors duration-150"
                aria-label="Shiko imazhin në madhësi të plotë (hapet në dritare të re)"
                title="Shiko imazhin"
              >
                <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href={message.imageUrl}
                download={getDownloadFileName()}
                className="p-1.5 sm:p-2 text-red-200 hover:text-white hover:bg-red-500/50 rounded-full transition-colors duration-150"
                aria-label="Shkarko imazhin"
                title="Shkarko imazhin"
              >
                <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          )}

          {!isUser && hasSources && !isAiImage && ( 
            <div className="mt-2 pt-2 border-t border-red-400/30">
              <h4 className="text-xs font-semibold text-red-200/90 mb-1">Burimet e informacionit:</h4>
              <ul className="list-none pl-0 space-y-0.5">
                {message.groundingSources?.map((source, index) => (
                  <li key={`${source.uri}-${index}`} className="text-xs">
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sky-300 hover:text-sky-200 hover:underline inline-flex items-center group"
                      aria-label={`Burimi: ${source.title || 'Lidhje e jashtme'} (hapet në dritare të re)`}
                    >
                      <LinkIcon className="w-3 h-3 mr-1.5 flex-shrink-0 text-sky-400 group-hover:text-sky-300" />
                      <span className="truncate" style={{maxWidth: '200px'}} title={source.title}>
                        {source.title || source.uri}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timestamp and General Text Copy Button Area */}
          <div className="mt-2 flex items-end justify-between">
            <p className={`text-xs ${isUser ? 'text-slate-400' : 'text-red-200/90'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            {message.text && !isAiImage && ( // Show copy text if text exists and it's not an AI image's meta-text (which has its own copy prompt)
              <button
                onClick={() => handleCopy(message.text, 'text')}
                className="p-1.5 text-stone-400 hover:text-red-400 rounded-full transition-all duration-200 hover:bg-white/10"
                aria-label="Kopjo tekstin"
                title="Kopjo tekstin"
              >
                {copiedState?.type === 'text' && copiedState.id === message.id ? (
                  <span className="text-xs px-1 animate-fade-in">U kopjua!</span>
                ) : (
                  <CopyIcon className="w-4 h-4" /> 
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
