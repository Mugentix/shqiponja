
import React from 'react';
import { Message, SenderType } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender === SenderType.USER;

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-message-appear`}>
      <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`p-1.5 rounded-full flex items-center justify-center shadow ${isUser ? 'ml-2 bg-slate-500' : 'mr-2 bg-red-600'}`}>
          {isUser ? 
            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-100" /> : 
            <BotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-100" />
          }
        </div>
        <div
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-2xl ${
            isUser 
              ? 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 text-stone-100 rounded-br-none' 
              : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-stone-100 rounded-bl-none'
          }`}
        >
          <p className="text-sm sm:text-base whitespace-pre-wrap">{message.text}</p>
          <p className={`text-xs mt-1 ${isUser ? 'text-slate-400 text-right' : 'text-red-200 text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;