
import React, { useState, useEffect, useCallback } from 'react';
import { Message, SenderType, AttachmentInfo, InlineDataPart, TextPart, ContentPart, GeminiContentRequest, Persona, SalesTopic } from './types';
import { createPersonaChatSession, streamMessage } from './services/geminiService';
import type { Chat } from '@google/genai';
import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import PersonaSelectionScreen from './components/PersonaSelectionScreen';
import FloatingContact from './components/FloatingContact';
import SalesAssistantModal from './components/SalesAssistantModal';

// Utility function to convert file to base64
const convertFileToInlineData = (file: File): Promise<InlineDataPart> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1]; // Get base64 part
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

const getInitialMessageForPersona = (persona: Persona): Message => {
  let text = "";
  switch (persona) {
    case Persona.BAC_URTAKU:
      text = "Mirë se erdhe, o biri/bijë e Shqipes! Unë jam Bac Urtaku i Shqiponja AI. Fol me mua si me gjyshin tand, për halle e për këshilla, për histori e tradita. Urdhno, çka t'ka sjellë sot te unë?";
      break;
    case Persona.DIJETARI:
      text = "Përshëndetje! Unë jam Dijetari i Shqiponja AI. Jam këtu për t'iu përgjigjur pyetjeve tuaja rreth shkencës, historisë dhe çdo dije tjetër. Çfarë dëshironi të mësoni sot?";
      break;
    case Persona.ANALISTI:
      text = "Mirëdita. Unë jam Analisti i Shqiponja AI. Gati për të diskutuar lajmet më të fundit, politikën dhe zhvillimet gjeopolitike. Cilat janë çështjet që ju interesojnë aktualisht?";
      break;
    case Persona.HUMORISTI:
      text = "Hopa! Kush na erdhi? Unë jam Humoristi i Shqiponja AI, gati me të ba me qesh me lot, ose të paktën me të ba me ngërdhesh pak! Fol çka t'kesh merak, se bashkë e gjejmë naj batutë a naj tallje! ;)";
      break;
    default: 
      text = "Mirë se vjen te Shqiponja AI! Zgjidh një rol për të filluar bisedën.";
  }
  return {
    id: `initial-ai-greeting-${persona}-${Date.now()}`,
    text,
    sender: SenderType.AI,
    timestamp: new Date(),
  };
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'personaSelection' | 'chat'>('personaSelection');
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [personaChatSession, setPersonaChatSession] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for Sales Assistant Modal
  const [isSalesAssistantModalOpen, setIsSalesAssistantModalOpen] = useState<boolean>(false);
  const [salesAssistantTopic, setSalesAssistantTopic] = useState<SalesTopic | null>(null);

  const initializeChatForSelectedPersona = useCallback((persona: Persona) => {
    setError(null);
    setIsLoading(true); 
    try {
      const session = createPersonaChatSession(persona);
      if (session) {
        setPersonaChatSession(session);
        setMessages([getInitialMessageForPersona(persona)]);
      } else {
        setError("Problem në inicializimin e shërbimit të AI. Sigurohuni që çelësi API është konfiguruar.");
        setMessages([]); 
      }
    } catch (e) {
      console.error("Initialization error for persona:", persona, e);
      setError("Problem kritik gjatë inicializimit. Verifikoni konzolën.");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (currentView === 'chat' && currentPersona && !personaChatSession) {
       initializeChatForSelectedPersona(currentPersona);
    }
    if (currentView !== 'chat' || !currentPersona) {
        setPersonaChatSession(null); 
    }
  }, [currentView, currentPersona, personaChatSession, initializeChatForSelectedPersona]);


  const handleSelectPersona = (selectedPersona: Persona) => {
    if (selectedPersona !== currentPersona || currentView !== 'chat') {
      setCurrentPersona(selectedPersona);
      setPersonaChatSession(null); 
      setMessages([]); 
      setCurrentView('chat');
      setError(null); 
    }
  };
  
  const handleShowPersonaSelection = () => {
    setCurrentView('personaSelection');
    setError(null); 
  };


  const handleSendMessage = useCallback(async (text: string, file?: File) => {
    if (currentView !== 'chat' || !personaChatSession) {
      setError("Sesioni i chat-it nuk është aktiv. Ju lutem zgjidhni një rol.");
      return;
    }
    if (!text.trim() && !file) return;

    let attachmentInfoForMessage: AttachmentInfo | undefined = undefined;
    if (file) {
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
    setMessages(prev => [
      ...prev,
      {
        id: aiMessageId,
        text: '', 
        sender: SenderType.AI,
        timestamp: new Date(),
      },
    ]);

    try {
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
          return;
        }
      }
      
      if (parts.length === 0) {
        console.warn("No content parts to send.");
        setIsLoading(false);
         setMessages(prev => prev.filter(msg => msg.id !== aiMessageId)); 
        return;
      }
      
      const geminiRequestContent: GeminiContentRequest = { parts };

      let fullAiResponse = '';
      for await (const chunk of streamMessage(personaChatSession, geminiRequestContent)) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullAiResponse += chunkText;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId ? { ...msg, text: fullAiResponse } : msg
            )
          );
        }
      }
      if (!fullAiResponse && !error && isLoading) { 
        setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId ? { ...msg, text: "M'vjen keq, po s'munda me gjeneru përgjigje kësaj here." } : msg
            )
          );
      }
    } catch (e) {
      console.error('Error sending message:', e);
      const errorMessage = e instanceof Error ? e.message : "Ndodhi një gabim i panjohur.";
      setError(`Gabim në komunikim me AI: ${errorMessage}`);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: `Gabim: S'mun me marrë përgjigje. ${errorMessage}` } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [personaChatSession, currentView, error, isLoading]); 

  // Handlers for Sales Assistant Modal
  const handleOpenSalesAssistantModal = (topic: SalesTopic) => {
    setSalesAssistantTopic(topic);
    setIsSalesAssistantModalOpen(true);
  };

  const handleSalesChatConclude = (transcript: Message[]) => {
    console.log("Sales Assistant Chat Concluded.");
    console.log("Topic:", salesAssistantTopic);
    console.log("Transcript:", transcript);
    // Simulate sending email
    console.log(`SIMULATING: Sending chat summary for topic "${salesAssistantTopic}" to bbconsulting.mk@gmail.com...`);
    // In a real app, you'd make an API call to your backend here
    // to send the email with the transcript and topic.
    // e.g., sendEmailToBackend(salesAssistantTopic, transcript);
  };

  const handleCloseSalesAssistantModal = (transcript: Message[]) => {
    handleSalesChatConclude(transcript);
    setIsSalesAssistantModalOpen(false);
    setSalesAssistantTopic(null);
  };


  return (
    <>
      {currentView === 'personaSelection' ? (
        <PersonaSelectionScreen 
          onSelectPersona={handleSelectPersona} 
          currentPersona={currentPersona}
          onOpenSalesAssistantModal={handleOpenSalesAssistantModal} 
        />
      ) : (
        <div className="flex flex-col h-screen max-h-screen font-sans antialiased bg-zinc-950 text-stone-200">
          <Header 
            currentPersonaName={currentPersona} 
            onShowPersonaSelection={handleShowPersonaSelection} 
          />
          <MessageList messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <FloatingContact onOpenSalesAssistant={handleOpenSalesAssistantModal} />
        </div>
      )}

      {error && (
        <div 
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-red-900 border border-red-700 text-red-200 p-3 w-auto max-w-md rounded-lg shadow-xl text-sm" 
            role="alert"
        >
          <p className="font-semibold">Kujdes!</p>
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