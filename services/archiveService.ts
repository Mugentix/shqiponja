
import { ArchivedChat, Message, Persona, PersonaDisplayNames, SenderType } from '../types';

const ARCHIVE_STORAGE_KEY = 'shqiponjaAiChatArchive';

// Helper to ensure all returned chats have Date objects for timestamps
const rehydrateChats = (chats: ArchivedChat[]): ArchivedChat[] => {
  return chats.map(chat => ({
    ...chat,
    messages: chat.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp), // Rehydrate string to Date
    })),
  })).sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent first
};

export const getArchivedChats = (): ArchivedChat[] => {
  try {
    const storedChats = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (storedChats) {
      const parsedChats = JSON.parse(storedChats) as ArchivedChat[]; 
      return rehydrateChats(parsedChats);
    }
  } catch (error) {
    console.error("Error loading archived chats from localStorage:", error);
  }
  return [];
};

const saveAllArchivedChatsToLocalStorage = (chats: ArchivedChat[]): void => {
  try {
    // Ensure timestamps in messages are strings before saving
    const chatsWithStringTimestamps = chats.map(chat => ({
        ...chat,
        messages: chat.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
        })),
    }));
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(chatsWithStringTimestamps));
  } catch (error) {
    console.error("Error saving archived chats to localStorage:", error);
  }
};

export const generateChatTitle = (messages: Message[], persona: Persona): string => {
  const personaName = PersonaDisplayNames[persona] || "Bisedë";
  const firstUserMessage = messages.find(
    (msg) => msg.sender === SenderType.USER && msg.text.trim() !== ''
  );

  if (firstUserMessage && firstUserMessage.text) {
    const titlePrefix = `${personaName}: `;
    let shortText = firstUserMessage.text.substring(0, 45 - titlePrefix.length); 
    if (firstUserMessage.text.length > 45 - titlePrefix.length) {
      shortText += "...";
    }
    return `${titlePrefix}${shortText}`;
  }
  return `${personaName}: Bisedë pa titull`;
};


export const archiveChat = ( 
  messages: Message[],
  persona: Persona
): ArchivedChat | null => {
  if (!messages || messages.length === 0 || !persona) {
    console.warn("archiveChat (new) called with invalid parameters, skipping.");
    return null;
  }

  const newArchivedChat: ArchivedChat = {
    id: `archive-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    persona,
    title: generateChatTitle(messages, persona),
    messages: messages.map(msg => ({ ...msg, timestamp: msg.timestamp })), 
    timestamp: Date.now(), 
    messageCount: messages.length,
  };

  const currentChats = getArchivedChats();
  const updatedChats = [newArchivedChat, ...currentChats.filter(c => c.id !== newArchivedChat.id)];
  saveAllArchivedChatsToLocalStorage(updatedChats);
  return newArchivedChat; 
};

export const updateArchivedChatDetails = (
  chatIdToUpdate: string,
  newMessages: Message[],
  persona: Persona 
): ArchivedChat[] => {
  const currentChats = getArchivedChats();
  const chatIndex = currentChats.findIndex(chat => chat.id === chatIdToUpdate);

  if (chatIndex !== -1) {
    console.log(`[archiveService.ts] updateArchivedChatDetails: Found chat ID ${chatIdToUpdate} for update.`);
    const updatedChat: ArchivedChat = {
      ...currentChats[chatIndex],
      messages: newMessages.map(msg => ({ ...msg, timestamp: msg.timestamp })), 
      persona: persona, 
      title: generateChatTitle(newMessages, persona),
      timestamp: Date.now(), 
      messageCount: newMessages.length,
    };
    currentChats[chatIndex] = updatedChat;
    saveAllArchivedChatsToLocalStorage(currentChats);
    return rehydrateChats(currentChats); 
  } else {
    // If chat to update is not found, DO NOT create a new one to prevent duplicates.
    console.error(`[archiveService.ts] updateArchivedChatDetails: Chat with ID ${chatIdToUpdate} NOT FOUND. Update failed. No new chat created.`);
    return currentChats; // Return original list, effectively a no-op for the update.
  }
};


export const deleteArchivedChat = (chatId: string): ArchivedChat[] => {
  console.log('[archiveService.ts] deleteArchivedChat called with ID:', chatId);
  
  try {
    let currentChats = getArchivedChats(); // Read the latest from localStorage
    const originalCount = currentChats.length;
    console.log('[archiveService.ts] All chat IDs BEFORE filter:', currentChats.map(c => c.id).join(', '));
    
    const chatExists = currentChats.some(chat => chat.id === chatId);
    console.log(`[archiveService.ts] Chat with ID ${chatId} exists in currentChats:`, chatExists);
    
    if (!chatExists) {
      console.warn(`[archiveService.ts] Chat with ID ${chatId} not found for deletion. Returning current chats.`);
      return rehydrateChats(currentChats); // Return the rehydrated current list if chat doesn't exist
    }

    const filteredChats = currentChats.filter(chat => chat.id !== chatId);
    console.log('[archiveService.ts] All chat IDs AFTER filter:', filteredChats.map(c => c.id).join(', ') || 'EMPTY_LIST');

    if (filteredChats.length >= originalCount && chatExists) {
      // This case should ideally not be hit if chatExists was true and filter works.
      console.error('[archiveService.ts] FILTERING FAILED! Chat existed but was not removed according to length.');
      // To be safe, return the rehydrated version of the original list if filter seems to have failed
      return rehydrateChats(currentChats); 
    } else if (originalCount !== filteredChats.length) {
      console.log('[archiveService.ts] Filtering successful. Chat removed from list.');
    }


    // Save the filtered list to localStorage
    saveAllArchivedChatsToLocalStorage(filteredChats);
    console.log('[archiveService.ts] Saved filtered chats to localStorage. New count:', filteredChats.length);
    
    // Optionally, re-read from localStorage to absolutely confirm, though this should ideally not be needed
    // const verifiedChats = getArchivedChats();
    // if (verifiedChats.some(chat => chat.id === chatId)) {
    //   console.error('[archiveService.ts] VERIFICATION FAILED: Chat still exists in localStorage after attempted delete.');
    //   return rehydrateChats(currentChats); // Problem with save or re-read logic
    // }
    // console.log('[archiveService.ts] VERIFICATION SUCCESS: Chat confirmed deleted from localStorage.');

    return rehydrateChats(filteredChats); // Return the rehydrated filtered list
  } catch (error) {
    console.error('[archiveService.ts] Error in deleteArchivedChat:', error);
    return getArchivedChats(); // On any unexpected error, return the current (rehydrated) state from localStorage
  }
};
