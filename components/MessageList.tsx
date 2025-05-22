
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  onRegenerateImage?: (prompt: string, messageId: string) => void;
  onCopyText?: (text: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onRegenerateImage, onCopyText }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-grow p-4 md:p-6 space-y-4 overflow-y-auto">
      {messages.map((msg) => (
        <MessageItem 
          key={msg.id} 
          message={msg} 
          onRegenerateImage={onRegenerateImage}
          onCopyText={onCopyText}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
