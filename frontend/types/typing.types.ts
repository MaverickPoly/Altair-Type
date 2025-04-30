export interface TypingContextType {
  currentWord: string;
  setCurrentWord: (word: string) => void;
  typedWord: string;
  setTypedWord: (word: string) => void;
  wordsTyped: number;
  setWordsTyped: (count: number) => void;
  errors: number;
  setErrors: (count: number) => void;
  isTestActive: boolean;
  setIsTestActive: (active: boolean) => void;
  timeLeft: number;
  setTimeLeft: (seconds: number) => void;
  timeLimit: number;
  setTimeLimit: (seconds: number) => void;
  wordCount: number;
  setWordCount: (count: number) => void;
  customText: string;
  setCustomText: (text: string) => void;
  currentWordIndex: number;
  setCurrentWordIndex: (index: number) => void;
}
