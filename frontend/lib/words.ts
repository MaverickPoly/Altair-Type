import {
  arabicWords,
  chineseWords,
  englishWords,
  frenchWords,
  germanWords,
  italianWords, persianWords,
  russianWords,
  spanishWords, uzbekWords
} from '@/constants/words';

export const wordLists: { [key: string]: string[] } = {
  arabic: arabicWords,
  chinese: chineseWords,
  english: englishWords,
  spanish: spanishWords,
  french: frenchWords,
  russian: russianWords,
  german: germanWords,
  italian: italianWords,
  uzbek: uzbekWords,
  persian: persianWords,
};

export const generateWords = (count: number, language: string = 'english'): string[] => {
  const words = wordLists[language.toLowerCase()] || wordLists.english; // Fallback to English
  if (!words.length) {
    return Array(count).fill('word'); // Fallback for empty word lists
  }
  return Array.from(
      { length: count },
      () => words[Math.floor(Math.random() * words.length)],
  );
};