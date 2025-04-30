import React from "react";

export interface TypingContextType {
  currentWord: string;
  setCurrentWord: React.Dispatch<React.SetStateAction<string>>;
  typedWord: string;
  setTypedWord: React.Dispatch<React.SetStateAction<string>>;
  wordsTyped: number;
  setWordsTyped: React.Dispatch<React.SetStateAction<number>>;
  errors: number;
  setErrors: React.Dispatch<React.SetStateAction<number>>;
  isTestActive: boolean;
  setIsTestActive: React.Dispatch<React.SetStateAction<boolean>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  timeLimit: number;
  setTimeLimit: React.Dispatch<React.SetStateAction<number>>;
  wordCount: number;
  setWordCount: React.Dispatch<React.SetStateAction<number>>;
  customText: string;
  setCustomText: React.Dispatch<React.SetStateAction<string>>;
  currentWordIndex: number;
  setCurrentWordIndex: React.Dispatch<React.SetStateAction<number>>;
}
