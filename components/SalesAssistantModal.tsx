
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, SenderType, SalesAssistantModalProps, GeminiContentRequest, SalesTopic } from '../types';
import { createSalesChatSession, streamMessage } from '../services/geminiService';
import type { Chat } from '@google/genai';
import XMarkIcon from './icons/XMarkIcon';
import SendIcon from './icons/SendIcon';
import LoadingSpinner from './common/LoadingSpinner';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';

const SalesAssistantModal: React.FC<SalesAssistantModalProps> = ({ isOpen, salesTopic, onClose }) => {
  const [salesMessages, setSalesMessages] = useState<Message[]>([]);
  const [salesChatSession, setSalesChatSession] = useState<Chat | null>(null);
  const [isSalesAiLoading, setIsSalesAiLoading] = useState<boolean>(false);
  const [salesAiError, setSalesAiError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Keep track of the topic this modal instance was initialized with
  const initializedTopicRef = useRef<SalesTopic | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [salesMessages, scrollToBottom]);
  
  const handleCloseModal = () => {
    onClose(salesMessages); // Pass transcript back
    setSalesChatSession(null); // Explicitly clear session state
    setSalesMessages([]); // Clear messages
    initializedTopicRef.current = null; // Reset initialized topic
  };

  useEffect(() => {
    if (isOpen && salesTopic && (salesChatSession === null || initializedTopicRef.current !== salesTopic) ) {
      setIsSalesAiLoading(true);
      setSalesAiError(null);
      setSalesMessages([]); 
      initializedTopicRef.current = salesTopic; // Mark this topic as initialized

      try {
        const session = createSalesChatSession(salesTopic);
        if (session) {
          setSalesChatSession(session);
          const initialAiMessageId = `sales-ai-opener-${Date.now()}`;
           setSalesMessages([{
            id: initialAiMessageId,
            text: '', 
            sender: SenderType.AI,
            timestamp: new Date(),
            isSalesAssistantMessage: true,
          }]);

          (async () => {
            let fullResponse = "";
            try {
              const initialContent: GeminiContentRequest = { parts: [{ text: "START_CONVERSATION" }] }; 
              for await (const chunk of streamMessage(session, initialContent)) {
                const chunkText = chunk.text;
                if (chunkText) {
                  fullResponse += chunkText;
                  setSalesMessages(prev => prev.map(m => m.id === initialAiMessageId ? {...m, text: fullResponse} : m));
                }
              }
            } catch (e) {
              console.error("Error in initial sales AI message:", e);
              const errMsg = e instanceof Error ? e.message : "Gabim fillestar";
              setSalesMessages(prev => prev.map(m => m.id === initialAiMessageId ? {...m, text: `Ndjesë, një problem teknik ndodhi: ${errMsg}`} : m));
              setSalesAiError(`Problem në fillimin e bisedës me asistentin: ${errMsg}`);
            } finally {
               setIsSalesAiLoading(false);
               if (inputRef.current) {
                inputRef.current.focus();
              }
            }
          })();

        } else {
          setSalesAiError("Problem në inicializimin e asistentit të shitjeve.");
          setIsSalesAiLoading(false);
        }
      } catch (e) {
        console.error("Error creating sales chat session:", e);
        setSalesAiError("Problem kritik gjatë inicializimit të asistentit.");
        setIsSalesAiLoading(false);
      }
    } else if (!isOpen && salesChatSession !== null) { 
      // If modal is closed, ensure session is cleared (handleCloseModal might not always be called if isOpen changes externally)
      setSalesChatSession(null);
      setSalesMessages([]);
      initializedTopicRef.current = null;
    }
  }, [isOpen, salesTopic, salesChatSession]);


  const handleSendSalesMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = userInput.trim();
    if (!text || !salesChatSession || isSalesAiLoading) return;

    const userMessage: Message = {
      id: 'sales-user-' + Date.now(),
      text,
      sender: SenderType.USER,
      timestamp: new Date(),
      isSalesAssistantMessage: true,
    };
    setSalesMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsSalesAiLoading(true);
    setSalesAiError(null);

    const aiMessageId = 'sales-ai-' + Date.now();
    setSalesMessages(prev => [
      ...prev,
      { id: aiMessageId, text: '', sender: SenderType.AI, timestamp: new Date(), isSalesAssistantMessage: true },
    ]);

    try {
      const geminiRequestContent: GeminiContentRequest = { parts: [{ text }] };
      let fullAiResponse = '';
      for await (const chunk of streamMessage(salesChatSession, geminiRequestContent)) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullAiResponse += chunkText;
          setSalesMessages(prev =>
            prev.map(msg => (msg.id === aiMessageId ? { ...msg, text: fullAiResponse } : msg))
          );
        }
      }
      if (!fullAiResponse && !salesAiError) {
         setSalesMessages(prev =>
            prev.map(msg => (msg.id === aiMessageId ? { ...msg, text: "Ju lutem më jepni një moment..." } : msg))
          );
      }
    } catch (error) {
      console.error('Error sending sales message:', error);
      const errorMessage = error instanceof Error ? error.message : "Ndodhi një gabim i panjohur.";
      setSalesAiError(`Gabim në komunikim: ${errorMessage}`);
      setSalesMessages(prev =>
        prev.map(msg => (msg.id === aiMessageId ? { ...msg, text: `Gabim: ${errorMessage}` } : msg))
      );
    } finally {
      setIsSalesAiLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  if (!isOpen) return null;

  let title = 'Asistent Virtual Shqiponja AI';
  if (salesTopic === 'advertising') {
    title = 'Asistent Reklamimi Shqiponja AI';
  } else if (salesTopic === 'sales') {
    title = 'Asistent Shitjesh Shqiponja AI';
  } else if (salesTopic === 'business_inquiry') {
    title = 'Asistent Biznesi Shqiponja AI';
  }


  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sales-assistant-title"
    >
      <div className="bg-zinc-800 shadow-2xl w-full h-full sm:max-w-2xl sm:max-h-[90vh] sm:rounded-xl flex flex-col relative overflow-hidden">
        <header className="bg-zinc-900 p-4 flex items-center justify-between border-b border-zinc-700/70">
          <h2 id="sales-assistant-title" className="text-lg font-semibold text-red-500">{title}</h2>
          <button
            onClick={handleCloseModal} // Use the new handler
            className="text-zinc-400 hover:text-red-500 transition-colors p-1 rounded-full"
            aria-label="Mbyll asistentin"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-grow p-4 space-y-3 overflow-y-auto">
          {salesMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex mb-3 animate-message-appear ${msg.sender === SenderType.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end max-w-xs sm:max-w-md md:max-w-lg ${msg.sender === SenderType.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-1.5 rounded-full flex items-center justify-center shadow ${msg.sender === SenderType.USER ? 'ml-2 bg-slate-500' : 'mr-2 bg-red-600'}`}>
                  {msg.sender === SenderType.USER ? 
                    <UserIcon className="w-4 h-4 text-stone-100" /> : 
                    <BotIcon className="w-4 h-4 text-stone-100" />
                  }
                </div>
                <div
                  className={`px-3 py-2 rounded-xl shadow-md ${
                    msg.sender === SenderType.USER 
                      ? 'bg-slate-600 text-stone-100 rounded-br-none' 
                      : 'bg-red-700/80 text-stone-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text || (isSalesAiLoading && msg.sender === SenderType.AI && msg.id === salesMessages[salesMessages.length-1]?.id ? 'Po mendoj...' : '')}</p>
                   {/* Timestamp can be added if needed */}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {salesAiError && <p className="p-3 text-center text-red-400 text-sm bg-red-900/30">{salesAiError}</p>}

        <form onSubmit={handleSendSalesMessage} className="bg-zinc-800 p-3 border-t border-zinc-700/70">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Shkruani mesazhin tuaj..."
              className="flex-grow p-3 border border-zinc-600 rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-shadow bg-zinc-700 text-stone-100 placeholder-stone-400 shadow-inner"
              disabled={isSalesAiLoading || !salesChatSession}
              aria-label="Fusha për të shkruar mesazhin për asistentin"
            />
            <button
              type="submit"
              className="bg-red-600 text-white p-3 rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSalesAiLoading || !salesChatSession || !userInput.trim()}
              aria-label="Dërgo mesazhin"
            >
              {isSalesAiLoading && salesMessages.length > 0 && salesMessages[salesMessages.length-1].sender === SenderType.USER ? <LoadingSpinner size="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesAssistantModal;