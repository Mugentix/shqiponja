import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  onRegenerateImage?: (prompt: string, messageId: string) => void;
  onCopyText?: (text: string) => void;
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onRegenerateImage, 
  onCopyText,
  isLoading = false 
}) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-grow p-4 md:p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="max-w-4xl mx-auto w-full space-y-4">
        {messages.map((msg) => (
          <MessageItem 
            key={msg.id} 
            message={msg} 
            onRegenerateImage={onRegenerateImage}
            onCopyText={onCopyText}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
