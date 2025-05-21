
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

export interface Message {
  id: string;
  text: string;
  sender: SenderType;
  timestamp: Date;
  attachmentInfo?: AttachmentInfo; // Optional: Info about the attachment sent with the message
  isSalesAssistantMessage?: boolean; // Flag for sales assistant messages
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

export enum Persona {
  BAC_URTAKU = 'Bac Urtaku',
  DIJETARI = 'Dijetari',
  ANALISTI = 'Analisti',
  HUMORISTI = 'Humoristi', 
}

export interface HeaderProps {
  currentPersonaName: string | null; 
  onShowPersonaSelection: () => void;
}

export interface PersonaCardProps {
  persona: Persona;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  onSelect: () => void;
  isSelected?: boolean;
}

export type SalesTopic = 'advertising' | 'sales' | 'business_inquiry'; // Added 'business_inquiry'

export interface PersonaSelectionScreenProps {
  onSelectPersona: (persona: Persona) => void;
  currentPersona: Persona | null; 
  onOpenSalesAssistantModal: (topic: SalesTopic) => void; 
}

// Data structure for what might be "extracted" or the goal of sales chat
// For now, the transcript itself is the primary lead data.
export interface SalesLeadData {
  topic: SalesTopic;
  name?: string;
  email?: string;
  company?: string;
  needsSummary?: string; // AI could potentially summarize this
  fullTranscript: Message[];
}

// Props for the new SalesAssistantModal
export interface SalesAssistantModalProps {
  isOpen: boolean;
  salesTopic: SalesTopic;
  onClose: (transcript: Message[]) => void; // Updated to pass transcript back on close
  // onSubmit prop is removed as it's a conversation now
}

// Props for FloatingContact
export interface FloatingContactProps {
  onOpenSalesAssistant: (topic: 'advertising' | 'sales') => void; 
}