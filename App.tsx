
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Message, SenderType, AttachmentInfo, InlineDataPart, TextPart, ContentPart, GeminiContentRequest, Persona, SalesTopic, ArchivedChat, PersonaDisplayNames, GeminiChatHistoryEntry, GroundingSource } from './types';
import { createPersonaChatSession, streamMessage, generateImage } from './services/geminiService';
import { getArchivedChats, archiveChat as saveNewChatToArchive, deleteArchivedChat as removeArchivedChatFromStorage, updateArchivedChatDetails } from './services/archiveService';
import { getDailyChallengeForPersona } from './services/challengeService'; // Import daily challenge service
import type { Chat } from '@google/genai';
import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import PersonaSelectionScreen from './components/PersonaSelectionScreen';
import FloatingContact from './components/FloatingContact';
import SalesAssistantModal from './components/SalesAssistantModal';
import ArchiveListScreen from './components/ArchiveListScreen';

// Utility function to convert file to base64
const convertFileToInlineData = (file: File): Promise<InlineDataPart> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1]; 
        resolve({
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        });
      } else {
        reject(new Error("Failed to read file as base64 string."));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

const getStandardInitialGreetingForPersona = (persona: Persona): string => {
  let text = "";
  const personaDisplayName = PersonaDisplayNames[persona] || persona;
  switch (persona) {
    case Persona.BAC_URTAKU:
      text = `Mirë se erdhe, o biri/bijë e Shqipes! Unë jam ${personaDisplayName} i Shqiponja AI. Fol me mua si me gjyshin tand, për halle e për këshilla, për histori e tradita. Urdhno, çka t'ka sjellë sot te unë?`;
      break;
    case Persona.DIJETARI:
      text = `Përshëndetje! Unë jam ${personaDisplayName} i Shqiponja AI. Jam këtu për t'iu përgjigjur pyetjeve tuaja rreth shkencës, historisë dhe çdo dije tjetër. Çfarë dëshironi të mësoni sot?`;
      break;
    case Persona.ANALISTI:
      text = `Mirëdita. Unë jam ${personaDisplayName} i Shqiponja AI. Gati për të diskutuar lajmet më të fundit, politikën dhe zhvillimet gjeopolitike, duke përdorur edhe kërkimin në internet për informacion sa më aktual. Cilat janë çështjet që ju interesojnë?`;
      break;
    case Persona.HUMORISTI:
      text = `Hopa! Kush na erdhi? Unë jam ${personaDisplayName} i Shqiponja AI, gati me të ba me qesh me lot, ose të paktën me të ba me ngërdhesh pak! Fol çka t'kesh merak, se bashkë e gjejmë naj batutë a naj tallje! ;)`;
      break;
    case Persona.ARTISTI:
      text = `Përshëndetje! Unë jam ${PersonaDisplayNames[Persona.ARTISTI]} i Shqiponja AI. Më jep një përshkrim dhe unë do ta 'pikturoj' për ty një imazh unik. Çfarë ke në mendje sot?`;
      break;
    case Persona.MESUESI:
      text = `Mirë se erdhët në klasën time virtuale! Unë jam ${PersonaDisplayNames[Persona.MESUESI]} i Shqiponja AI. Jam këtu për t'ju ndihmuar të mësoni dhe të zbuloni gjëra të reja. Çfarë teme dëshironi të eksplorojmë së bashku sot?`;
      break;
    default: 
      text = "Mirë se vjen te Shqiponja AI! Zgjidh një rol për të filluar bisedën.";
  }
  return text;
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'personaSelection' | 'chat' | 'archiveList'>('personaSelection');
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [personaChatSession, setPersonaChatSession] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isSalesAssistantModalOpen, setIsSalesAssistantModalOpen] = useState<boolean>(false);
  const [salesAssistantTopic, setSalesAssistantTopic] = useState<SalesTopic | null>(null);

  const [archivedChats, setArchivedChats] = useState<ArchivedChat[]>([]);
  
  const initialMessageCountForCurrentSessionRef = useRef<number>(0);
  const continuedArchivedChatIdRef = useRef<string | null>(null); 
  const previousArchivedChatsRef = useRef<ArchivedChat[] | undefined>(undefined);
  const currentAbortControllerRef = useRef<AbortController | null>(null);


  useEffect(() => {
    setArchivedChats(getArchivedChats());
  }, []);

 useEffect(() => {
    if (previousArchivedChatsRef.current !== undefined) { 
      // console.log('[App.tsx EFFECT] archivedChats state has changed.');
    } else {
      // console.log('[App.tsx EFFECT] archivedChats initial state set.');
    }
    previousArchivedChatsRef.current = archivedChats.map(chat => ({...chat, messages: [...chat.messages]})); 
  }, [archivedChats]);

  const attemptArchiveCurrentChat = useCallback(() => {
    const personaToArchive = currentPersona; 
    const messagesToArchive = messages;     
    const originalChatIdForUpdate = continuedArchivedChatIdRef.current; 
    
    const cleanupAndReturn = () => {
        continuedArchivedChatIdRef.current = null;
    };

    if (!personaToArchive || messagesToArchive.length === 0) {
      return cleanupAndReturn();
    }
    
    // Avoid archiving if it's an Artisti chat with only initial messages or an error before image generation.
    if (personaToArchive === Persona.ARTISTI && messagesToArchive.length <= 2) { // Max 2: Challenge, Follow-up Greeting (or just Greeting)
        const lastAiMessage = messagesToArchive.find(m => m.sender === SenderType.AI && !m.id.startsWith('initial-ai-greeting-') && !m.id.startsWith('ai-daily-challenge-'));
        if (!lastAiMessage || (lastAiMessage && !lastAiMessage.imageUrl && !lastAiMessage.text.includes('Gabim gjatë gjenerimit'))) {
           return cleanupAndReturn();
        }
    }

    const initialCount = initialMessageCountForCurrentSessionRef.current;
    const currentCount = messagesToArchive.length;

    // Check if it's a new chat with only initial AI messages (challenge + followup, or just standard greeting)
    const isNewChatWithOnlyInitialAIMessages = 
      initialCount > 0 && 
      currentCount === initialCount &&
      messagesToArchive.every(m => m.sender === SenderType.AI && 
        (m.id.startsWith('initial-ai-greeting-') || m.id.startsWith('ai-daily-challenge-'))
      );
    
    if (isNewChatWithOnlyInitialAIMessages) {
      return cleanupAndReturn();
    }

    if (currentCount > initialCount) { 
      if (originalChatIdForUpdate) {
        const updatedChatsList = updateArchivedChatDetails(originalChatIdForUpdate, messagesToArchive, personaToArchive);
        setArchivedChats(updatedChatsList); 
      } else {
        const savedChat = saveNewChatToArchive(messagesToArchive, personaToArchive);
        if (savedChat) {
          setArchivedChats(prev => 
            [savedChat, ...prev.filter(c => c.id !== savedChat.id)] 
            .sort((a, b) => b.timestamp - a.timestamp)
          );
        }
      }
    }
    
    return cleanupAndReturn();

  }, [messages, currentPersona]); 


  const initializeNewChat = useCallback((
    persona: Persona, 
    historyForGemini?: GeminiChatHistoryEntry[], 
    initialMessagesOverride?: Message[],
    isContinuingArchivedChatId?: string | null 
  ) => {
    setError(null);
    setIsLoading(true); 
    
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }
    
    continuedArchivedChatIdRef.current = isContinuingArchivedChatId || null; 

    try {
      const session = createPersonaChatSession(persona, historyForGemini);
      if (session || persona === Persona.ARTISTI) { // Artisti may not need a session for the first image generation
        setPersonaChatSession(session); 
        
        let effectiveInitialMessages: Message[] = [];
        const personaDisplayName = PersonaDisplayNames[persona] || persona;

        if (initialMessagesOverride && initialMessagesOverride.length > 0) {
          // Loading an archived chat, don't prepend daily challenge
          effectiveInitialMessages = initialMessagesOverride.map(m => ({...m, timestamp: new Date(m.timestamp)}));
        } else {
          // New chat
          const dailyChallenge = getDailyChallengeForPersona(persona);
          if (dailyChallenge) {
            effectiveInitialMessages.push({
              id: `ai-daily-challenge-${persona}-${Date.now()}`,
              text: `⚡ **Sfidë e Ditës!** ${dailyChallenge}`,
              sender: SenderType.AI,
              timestamp: new Date(),
            });
            effectiveInitialMessages.push({
              id: `initial-ai-greeting-followup-${persona}-${Date.now()}`,
              text: `Unë jam ${personaDisplayName}. Më lart gjeni sfidën time për ju sot! Mund të zgjidhni t'i përgjigjeni asaj, ose thjesht të më pyesni për çdo gjë tjetër që keni ndërmend. Unë jam gati!`,
              sender: SenderType.AI,
              timestamp: new Date(),
            });
          } else {
            // No daily challenge, use standard greeting
            effectiveInitialMessages.push({
              id: `initial-ai-greeting-${persona}-${Date.now()}`,
              text: getStandardInitialGreetingForPersona(persona),
              sender: SenderType.AI,
              timestamp: new Date(),
            });
          }
        }
        
        setMessages(effectiveInitialMessages);
        initialMessageCountForCurrentSessionRef.current = effectiveInitialMessages.length;
        
        setCurrentPersona(persona);
        setCurrentView('chat');
      } else {
        setError("Problem në inicializimin e shërbimit të AI. Sigurohuni që çelësi API është konfiguruar.");
        setMessages([]); 
        initialMessageCountForCurrentSessionRef.current = 0;
        continuedArchivedChatIdRef.current = null; 
      }
    } catch (e) {
      console.error("Initialization error for persona:", persona, e);
      setError("Problem kritik gjatë inicializimit. Verifikoni konzolën.");
      setMessages([]);
      initialMessageCountForCurrentSessionRef.current = 0;
      continuedArchivedChatIdRef.current = null; 
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleSelectPersona = (selectedPersona: Persona) => {
    attemptArchiveCurrentChat(); 
    initializeNewChat(selectedPersona, undefined, undefined, null); // Pass undefined for initialMessagesOverride
  };
  
  const handleShowPersonaSelection = () => {
    attemptArchiveCurrentChat();
    setCurrentPersona(null);
    setPersonaChatSession(null);
    setMessages([]);
    setCurrentView('personaSelection');
    setError(null); 
    initialMessageCountForCurrentSessionRef.current = 0;
     if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }
  };

  const handleNavigateToArchive = () => {
    attemptArchiveCurrentChat();
    setArchivedChats(getArchivedChats()); 
    setCurrentView('archiveList');
  };

  const handleLoadArchivedChat = (chatId: string) => {
    attemptArchiveCurrentChat(); 

    const chatToLoad = getArchivedChats().find(c => c.id === chatId); 
    if (chatToLoad) {
      const historyForGemini: GeminiChatHistoryEntry[] = chatToLoad.messages
        .filter(msg => {
          // Filter out initial AI greeting/challenge messages if they were part of the start of the chat
          // and there are actual user interactions.
          const isInitialAiMessage = msg.id.startsWith('initial-ai-greeting-') || msg.id.startsWith('ai-daily-challenge-');
          if (isInitialAiMessage && chatToLoad.messages.indexOf(msg) < 2 && chatToLoad.messages.length > initialMessageCountForCurrentSessionRef.current) {
             // This logic might need refinement to be more robust against various initial message structures
          }

          // Specific filtering for Artisti persona history to avoid sending image URLs or "painting" messages back
          if (chatToLoad.persona === Persona.ARTISTI) {
            if (msg.sender === SenderType.AI && msg.imageUrl) return false; // Don't send AI image messages
            if (msg.sender === SenderType.USER) { // If user message led to an image, don't send the user prompt for history
               const nextMsgIndex = chatToLoad.messages.indexOf(msg) + 1;
               if (nextMsgIndex < chatToLoad.messages.length) {
                 const nextMsg = chatToLoad.messages[nextMsgIndex];
                 if (nextMsg && nextMsg.sender === SenderType.AI && nextMsg.imageUrl) return false;
               }
            }
          }
          // Filter out placeholder/thinking messages
          return msg.text && msg.text.trim() !== '' && !msg.text.startsWith('Po pikturoj') && !msg.text.startsWith('Po mendoj...') && !msg.text.startsWith('⚡ **Sfidë e Ditës!**');
        })
        .map(msg => ({
          role: msg.sender === SenderType.USER ? 'user' : 'model',
          parts: [{ text: msg.text }], 
        }));
      
      initializeNewChat(chatToLoad.persona, historyForGemini, chatToLoad.messages, chatId);
    } else {
        console.error(`[App.tsx] handleLoadArchivedChat: Chat with ID ${chatId} not found in archives.`);
        setError("Biseda e arkivuar nuk u gjet. Mund të jetë fshirë.");
        setArchivedChats(getArchivedChats()); 
    }
  };

  const handleDeleteArchivedChat = (chatId: string) => {
    try {
      const listAfterServiceCall = removeArchivedChatFromStorage(chatId);
      if (!listAfterServiceCall) {
        setError("Ndodhi një gabim gjatë fshirjes së bisedës. Ju lutemi provoni përsëri.");
        return;
      }
      setArchivedChats([...listAfterServiceCall]);
    } catch (error) {
      console.error('[App.tsx] handleDeleteArchivedChat: Error during deletion process:', error);
      setError("Ndodhi një gabim i papritur gjatë fshirjes së bisedës. Ju lutemi provoni përsëri.");
    }
  };

  const handleGoBackFromArchiveList = () => {
     handleShowPersonaSelection(); 
  };

  const handleStopGeneration = () => {
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      // The stream processing loop in handleSendMessage will handle adding "(Ndërprerë..."
      setIsLoading(false); // Immediately allow user to type again
    }
  };

  const handleRegenerateImage = async (originalPrompt: string, aiMessageIdToUpdate: string) => {
    if (currentPersona !== Persona.ARTISTI || !originalPrompt || !aiMessageIdToUpdate) return;

    setIsLoading(true);
    setError(null);
    setMessages(prev =>
      prev.map(msg =>
        msg.id === aiMessageIdToUpdate
          ? { ...msg, text: 'Po ripikturoj idenë tënde...', imageUrl: undefined, timestamp: new Date() }
          : msg
      )
    );

    try {
      const imageResult = await generateImage(originalPrompt);
      if ('base64Image' in imageResult) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageIdToUpdate
              ? {
                  ...msg,
                  text: `Ja çfarë krijova sërish për ty bazuar në përshkrimin: "${originalPrompt}"`,
                  imageUrl: imageResult.base64Image,
                  originalPromptForImage: originalPrompt,
                  timestamp: new Date(),
                }
              : msg
          )
        );
      } else {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageIdToUpdate
              ? { ...msg, text: `Më vjen keq, nuk munda ta rikrijoj imazhin. ${imageResult.error}`, imageUrl: undefined, timestamp: new Date() }
              : msg
          )
        );
      }
    } catch (e) {
      console.error('Error regenerating image:', e);
      const errorMessage = e instanceof Error ? e.message : "Ndodhi një gabim i panjohur.";
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageIdToUpdate
            ? { ...msg, text: `Gabim gjatë ripikturimit: ${errorMessage}`, imageUrl: undefined, timestamp: new Date() }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyTextToClipboard = (textToCopy: string) => {
    if (!navigator.clipboard) {
      // Fallback for older browsers or insecure contexts if needed
      console.warn('Clipboard API not available.');
      setError('Funksioni i kopjimit nuk suportohet nga shfletuesi juaj ose konteksti aktual.');
      return;
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Optional: Show a brief success message. This will be handled in MessageItem.
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setError('Problem gjatë kopjimit të tekstit.');
    });
  };


  const handleSendMessage = useCallback(async (text: string, file?: File) => {
    if (currentView !== 'chat' || !currentPersona) {
      setError("Sesioni i chat-it nuk është aktiv ose roli nuk është zgjedhur.");
      return;
    }
    if (!text.trim() && (currentPersona !== Persona.ARTISTI || !file)) { 
         if (!text.trim() && !file) return; 
    }

    if (currentAbortControllerRef.current) { // Abort any previous stream before starting a new one
        currentAbortControllerRef.current.abort();
    }
    currentAbortControllerRef.current = new AbortController(); // Create a new controller for this message
    const signal = currentAbortControllerRef.current.signal;


    let attachmentInfoForMessage: AttachmentInfo | undefined = undefined;
    if (file && currentPersona !== Persona.ARTISTI) { 
      attachmentInfoForMessage = { name: file.name, type: file.type };
    }

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      text, 
      sender: SenderType.USER,
      timestamp: new Date(),
      attachmentInfo: attachmentInfoForMessage,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const aiMessageId = 'ai-' + Date.now();
    const thinkingText = currentPersona === Persona.ARTISTI ? 'Po pikturoj idenë tënde...' : 'Po mendoj...';
    setMessages(prev => [
      ...prev,
      { id: aiMessageId, text: thinkingText, sender: SenderType.AI, timestamp: new Date() },
    ]);

    try {
      if (currentPersona === Persona.ARTISTI) {
        if (!text.trim()) {
           setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: "Ju lutem jepni një përshkrim për imazhin që dëshironi." } : msg));
           setIsLoading(false);
           currentAbortControllerRef.current = null;
           return;
        }
        const imageResult = await generateImage(text);
        if (signal.aborted) {
          console.log("Image generation aborted by user before API response was fully processed.");
          // Message might already be updated by stopGeneration logic if it aborts during API call.
          // Ensure loading is false.
          setIsLoading(false);
          return;
        }

        if ('base64Image' in imageResult) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    text: `Ja çfarë krijova për ty bazuar në përshkrimin: "${text}"`,
                    imageUrl: imageResult.base64Image,
                    originalPromptForImage: text, // Store original prompt
                    timestamp: new Date(),
                  }
                : msg
            )
          );
        } else {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, text: `Më vjen keq, nuk munda ta krijoj imazhin. ${imageResult.error}`, timestamp: new Date() }
                : msg
            )
          );
        }
      } else { // Logic for other personas
        if (!personaChatSession) {
            setError("Sesioni i chat-it për këtë rol nuk është inicializuar si duhet.");
            setIsLoading(false);
            setMessages(prev => prev.filter(m => m.id !== aiMessageId));
            currentAbortControllerRef.current = null;
            return;
        }
        const parts: ContentPart[] = [];
        let promptText = text.trim();
        if (!promptText && file) {
          promptText = "Përshkruaje këtë imazh."; 
        }
        if (promptText) {
           parts.push({ text: promptText });
        }

        if (file) {
          try {
            const imagePart = await convertFileToInlineData(file);
            parts.push(imagePart);
          } catch (fileError) {
            console.error("Error processing file:", fileError);
            const readableError = fileError instanceof Error ? fileError.message : 'Gabim i panjohur gjatë përpunimit.';
            setError(`Gabim gjatë përpunimit të skedarit: ${readableError}`);
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: `Gabim: Nuk munda të përpunoj skedarin. ${readableError}` } : msg
              )
            );
            setIsLoading(false);
            currentAbortControllerRef.current = null;
            return;
          }
        }
        
        if (parts.length === 0) {
          setIsLoading(false);
          setMessages(prev => prev.filter(msg => msg.id !== aiMessageId)); 
          currentAbortControllerRef.current = null;
          return;
        }
        
        const geminiRequestContent: GeminiContentRequest = { parts };

        let fullAiResponse = '';
        let aggregatedRawGroundingChunks: any[] = [];

        for await (const chunk of streamMessage(personaChatSession, geminiRequestContent)) {
          if (signal.aborted) {
             console.log("Stream processing aborted by user.");
             setMessages(prev => prev.map(msg => msg.id === aiMessageId && msg.text && !msg.text.includes("(Ndërprerë nga përdoruesi)") ? {...msg, text: msg.text + "\n(Ndërprerë nga përdoruesi)"} : msg));
             break; 
          }
          const chunkText = chunk.text;
          if (chunkText) {
            fullAiResponse += chunkText;
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: fullAiResponse, timestamp: new Date() } : msg 
              )
            );
          }
          if (currentPersona === Persona.ANALISTI && chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            aggregatedRawGroundingChunks.push(...chunk.candidates[0].groundingMetadata.groundingChunks);
          }
        }

        if (signal.aborted) { // Final check after loop
          setIsLoading(false); // Ensure loading is set to false
          return;
        }

        let processedSources: GroundingSource[] = [];
        if (currentPersona === Persona.ANALISTI && aggregatedRawGroundingChunks.length > 0) {
          const uniqueSourcesMap = new Map<string, GroundingSource>();
          aggregatedRawGroundingChunks.forEach((rawChunk: any) => {
            let sourceToAdd: GroundingSource | null = null;
            if (rawChunk.web && rawChunk.web.uri) {
              sourceToAdd = { uri: rawChunk.web.uri, title: rawChunk.web.title || rawChunk.web.uri, type: 'web' };
            } else if (rawChunk.retrievedContext && rawChunk.retrievedContext.uri) {
               sourceToAdd = { uri: rawChunk.retrievedContext.uri, title: rawChunk.retrievedContext.title || rawChunk.retrievedContext.uri, type: 'retrievedContext' };
            }
        
            if (sourceToAdd && !uniqueSourcesMap.has(sourceToAdd.uri)) {
              uniqueSourcesMap.set(sourceToAdd.uri, sourceToAdd);
            }
          });
          processedSources = Array.from(uniqueSourcesMap.values());
        }

        if (fullAiResponse || processedSources.length > 0) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    text: fullAiResponse, 
                    timestamp: new Date(),
                    groundingSources: processedSources.length > 0 ? processedSources : undefined
                  } 
                : msg
            )
          );
        } else if (!error && isLoading && !signal.aborted) { 
          setMessages(prev =>
              prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: "M'vjen keq, po s'munda me gjeneru përgjigje kësaj here.", timestamp: new Date() } : msg
              )
            );
        }
      } 
    } catch (e) {
      if (signal.aborted) {
        console.log("Operation was aborted during or after an error.");
      } else {
        console.error('Error sending message:', e);
        const errorMessage = e instanceof Error ? e.message : "Ndodhi një gabim i panjohur.";
        setError(`Gabim në komunikim me AI: ${errorMessage}`);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: `Gabim: S'mun me marrë përgjigje. ${errorMessage}`, timestamp: new Date() } : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      // Only clear the abort controller if it hasn't been aborted
      // If it was aborted, it means stop was clicked, and it's fine to be cleared for the next message.
      currentAbortControllerRef.current = null;
    }
  }, [personaChatSession, currentView, currentPersona, error, isLoading]); 

  const handleOpenSalesAssistantModal = (topic: SalesTopic) => {
    setSalesAssistantTopic(topic);
    setIsSalesAssistantModalOpen(true);
  };

  const handleSalesChatConclude = (transcript: Message[]) => {
    // console.log("Sales Assistant Chat Concluded.");
  };

  const handleCloseSalesAssistantModal = (transcript: Message[]) => {
    handleSalesChatConclude(transcript); 
    setIsSalesAssistantModalOpen(false);
    setSalesAssistantTopic(null); 
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'personaSelection':
        return (
          <PersonaSelectionScreen 
            onSelectPersona={handleSelectPersona} 
            currentPersona={currentPersona}
            onOpenSalesAssistantModal={handleOpenSalesAssistantModal} 
            onNavigateToArchive={handleNavigateToArchive}
          />
        );
      case 'chat':
        return (
          <div className="flex flex-col h-screen max-h-screen font-sans antialiased bg-zinc-950 text-stone-200">
            <Header 
              currentPersonaName={currentPersona} 
              onShowPersonaSelection={handleShowPersonaSelection} 
              onNavigateToArchive={handleNavigateToArchive}
              currentView={currentView}
            />
            <MessageList 
              messages={messages} 
              onRegenerateImage={currentPersona === Persona.ARTISTI ? handleRegenerateImage : undefined}
              onCopyText={handleCopyTextToClipboard}
            />
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              currentPersona={currentPersona}
              onStopGeneration={handleStopGeneration}
            />
            <FloatingContact onOpenSalesAssistant={handleOpenSalesAssistantModal} />
          </div>
        );
      case 'archiveList':
        return (
           <div className="flex flex-col h-screen max-h-screen font-sans antialiased bg-zinc-950 text-stone-200">
            <Header 
              currentPersonaName={null} 
              onShowPersonaSelection={handleShowPersonaSelection} 
              currentView={currentView}
              onGoBack={handleGoBackFromArchiveList} 
            />
            <ArchiveListScreen
              archivedChats={archivedChats}
              onLoadArchivedChat={handleLoadArchivedChat} 
              onDeleteChat={handleDeleteArchivedChat}
              onGoBackToPersonaSelection={handleShowPersonaSelection}
            />
          </div>
        );
      default: 
        return <PersonaSelectionScreen onSelectPersona={handleSelectPersona} currentPersona={currentPersona} onOpenSalesAssistantModal={handleOpenSalesAssistantModal} onNavigateToArchive={handleNavigateToArchive} />;
    }
  };

  return (
    <>
      {renderCurrentView()}
      {error && (
        <div 
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-red-900 border border-red-700 text-red-200 p-3 w-auto max-w-md rounded-lg shadow-xl text-sm animate-message-appear" 
            role="alert"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold mr-2">Kujdes!</p>
            <button 
              onClick={() => setError(null)} 
              className="text-red-300 hover:text-white p-0 leading-none text-xl font-bold focus:outline-none"
              aria-label="Mbyll njoftimin"
            >&times;</button>
          </div>
          <p>{error}</p>
        </div>
      )}
       {isSalesAssistantModalOpen && salesAssistantTopic && (
        <SalesAssistantModal
          isOpen={isSalesAssistantModalOpen}
          salesTopic={salesAssistantTopic}
          onClose={handleCloseSalesAssistantModal}
        />
      )}
    </>
  );
};

export default App;
