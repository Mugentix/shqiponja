import React from 'react';
import XMarkIcon from './icons/XMarkIcon';

interface DailyChallengeModalProps {
  isOpen: boolean;
  challengeText: string;
  onClose: () => void;
}

const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({ isOpen, challengeText, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-800 w-full max-w-md p-6 rounded-xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors p-1 rounded-full"
          aria-label="Mbyll sfidën"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center">⚡ Sfidë e Ditës</h2>
        <p className="text-stone-100 whitespace-pre-wrap">{challengeText}</p>
      </div>
    </div>
  );
};

export default DailyChallengeModal;
