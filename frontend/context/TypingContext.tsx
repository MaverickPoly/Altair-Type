'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {TypingContextType} from "@/types/typing.types";


const TypingContext = createContext<TypingContextType | undefined>(undefined);

export const useTypingContext = () => {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error('useTypingContext must be used within a TypingProvider');
  }
  return context;
};

interface TypingProviderProps {
  children: ReactNode;
}

export const TypingProvider: React.FC<TypingProviderProps> = ({ children }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [typedWord, setTypedWord] = useState('');
  const [wordsTyped, setWordsTyped] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [wordCount, setWordCount] = useState(25);
  const [customText, setCustomText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Update timeLeft when timeLimit changes
  useEffect(() => {
    if (!isTestActive) {
      setTimeLeft(timeLimit);
    }
  }, [timeLimit, isTestActive]);

  return (
    <TypingContext.Provider
      value={{
        currentWord,
        setCurrentWord,
        typedWord,
        setTypedWord,
        wordsTyped,
        setWordsTyped,
        errors,
        setErrors,
        isTestActive,
        setIsTestActive,
        timeLeft,
        setTimeLeft,
        timeLimit,
        setTimeLimit,
        wordCount,
        setWordCount,
        customText,
        setCustomText,
        currentWordIndex,
        setCurrentWordIndex,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};