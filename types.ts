
export enum SenderType {
  USER = 'user',
  AI = 'ai',
}

export interface AttachmentInfo {
  name: string;
  type: string; // MIME type
  // data for display in chat, not for sending to API again
  // previewUrl?: string; 
}

export interface GroundingSource {
  uri: string;
  title: string; 
  type: 'web' | 'retrievedContext' | string; // type of source, string for future-proofing
}

export interface Message {
  id: string;
  text: string;
  sender: SenderType;
  timestamp: Date;
  attachmentInfo?: AttachmentInfo; // Optional: Info about the attachment sent with the message
  isSalesAssistantMessage?: boolean; // Flag for sales assistant messages
  groundingSources?: GroundingSource[]; // For displaying sources from Google Search
  imageUrl?: string; // For displaying AI-generated images
  originalPromptForImage?: string; // Store the original prompt for AI-generated images for regeneration
}

// This type will be used for sending data to Gemini API
export interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string; // base64 encoded
  };
}

export interface TextPart {
  text: string;
}

export type ContentPart = InlineDataPart | TextPart;

export interface GeminiContentRequest {
  parts: ContentPart[];
}

// For initializing a chat session with history
export interface GeminiChatHistoryEntry {
  role: 'user' | 'model';
  parts: Array<{text: string}>; // Simplified to text parts for history
}


export enum Persona {
  BAC_URTAKU = 'Bac Urtaku',
  DIJETARI = 'Dijetari',
  ANALISTI = 'Analisti',
  HUMORISTI = 'Humoristi', 
  ARTISTI = 'Artisti',
  MESUESI = 'Mësuesi', // New Persona
}

export const PersonaDisplayNames: Record<Persona, string> = {
  [Persona.BAC_URTAKU]: "Plaku i Urte",
  [Persona.DIJETARI]: "Dijetari",
  [Persona.ANALISTI]: "Analisti",
  [Persona.HUMORISTI]: "Humoristi",
  [Persona.ARTISTI]: "Artisti Piktori",
  [Persona.MESUESI]: "Mësuesi", // Display name for Mësuesi
};

export interface HeaderProps {
  currentPersonaName: string | null; 
  onShowPersonaSelection: () => void;
  onNavigateToArchive?: () => void; 
  currentView: 'personaSelection' | 'chat' | 'archiveList'; // 'viewingArchivedChat' removed
  onGoBack?: () => void; 
}

export interface PersonaCardProps {
  persona: Persona;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  onSelect: () => void;
  isSelected?: boolean;
  dailyChallengeText?: string; // New: For displaying a daily challenge badge/text
}

export type SalesTopic = 'advertising' | 'sales' | 'business_inquiry';

export interface PersonaSelectionScreenProps {
  onSelectPersona: (persona: Persona) => void;
  currentPersona: Persona | null; 
  onOpenSalesAssistantModal: (topic: SalesTopic) => void; 
  onNavigateToArchive: () => void; 
}

export interface SalesLeadData {
  topic: SalesTopic;
  name?: string;
  email?: string;
  company?: string;
  needsSummary?: string; 
  fullTranscript: Message[];
}

export interface SalesAssistantModalProps {
  isOpen: boolean;
  salesTopic: SalesTopic;
  onClose: (transcript: Message[]) => void; 
}

export interface FloatingContactProps {
  onOpenSalesAssistant: (topic: 'advertising' | 'sales') => void; 
}

export interface ArchivedChat {
  id: string;
  persona: Persona;
  title: string;
  messages: Message[]; // Timestamps within messages are Date objects
  timestamp: number;   // Main archive entry timestamp (Date.now())
  messageCount: number;
}

// Props for ArchiveListScreen
export interface ArchiveListScreenProps {
  archivedChats: ArchivedChat[];
  onLoadArchivedChat: (chatId: string) => void; // Renamed from onViewChat
  onDeleteChat: (chatId: string) => void;
  onGoBackToPersonaSelection: () => void;
}

// Props for ChatInput
export interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
  currentPersona: Persona | null;
  onStopGeneration?: () => void; // New: Callback to stop AI generation
}

// Props for MessageItem
export interface MessageItemProps {
  message: Message;
  onRegenerateImage?: (prompt: string, messageId: string) => void;
  onCopyText?: (text: string) => void;
}
