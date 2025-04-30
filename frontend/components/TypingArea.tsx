import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTypingContext } from "@/context/TypingContext";
import { useTest } from "@/context/TestContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { toast } from "sonner";

interface TypingAreaProps {
  words: string[];
  mode: "word" | "time" | "custom";
  wordCount?: number;
  timeLimit?: number;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  mode,
  wordCount,
  timeLimit,
}) => {
  const {
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
    currentWordIndex,
    setCurrentWordIndex,
  } = useTypingContext();

  const { createTest } = useTest();
  let [startTime, setStartTime] = useState<number | null>(null);
  const typingAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Timer for time mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTestActive && mode === "time" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTestActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, mode, timeLeft, setTimeLeft, setIsTestActive]);

  // Set start time when test begins
  useEffect(() => {
    if (isTestActive && wordsTyped === 0 && !startTime) {
      setStartTime(Date.now());
    }
  }, [isTestActive, wordsTyped, startTime]);

  // Finish test and redirect
  const finishTest = async () => {
    const endTime = Date.now();
    let minutes: number;

    if (mode === "time" && timeLimit) {
      minutes = (timeLimit - timeLeft) / 60;
    } else if (startTime) {
      minutes = (endTime - startTime) / 1000 / 60; // Convert milliseconds to minutes
    } else {
      minutes = wordsTyped / 60; // Fallback
    }
    startTime = startTime || 0;

    const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
    const accuracy =
      Math.round((wordsTyped / (wordsTyped + errors)) * 100) || 100;
    const testDuration =
      mode === "time" && timeLimit
        ? Math.round(timeLimit - timeLeft)
        : Math.round((endTime - startTime) / 1000);

    try {
      const { success, message } = await createTest({
        type: mode,
        wordCount: wordsTyped,
        wpm,
        accuracy,
        time: testDuration,
      });
      toast.info("Completed test!");
    } catch (error) {
      toast.warning("Failed to save result!");
    }

    router.push(
      `/result?wpm=${wpm}&accuracy=${accuracy}&errors=${errors}&type=${mode}`
    );
  };

  // Redirect to results page when test ends
  useEffect(() => {
    if (!isTestActive && wordsTyped > 0) {
      finishTest();
    }
  }, [isTestActive, wordsTyped]);

  // Handle key presses
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent typing if test is inactive and words have been typed, or if time is up in time mode
      if (
        (mode === "time" && timeLeft <= 0) ||
        (!isTestActive && wordsTyped > 0)
      ) {
        return;
      }

      // Start the test if it hasn't started yet
      if (!isTestActive && wordsTyped === 0) {
        setIsTestActive(true);
      }

      // Handle character input, backspace, and space
      if (e.key.length === 1 && typedWord.length < currentWord.length) {
        setTypedWord((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        setTypedWord((prev) => prev.slice(0, -1));
      } else if (e.key === " " && typedWord.trim()) {
        const trimmedValue = typedWord.trim();
        if (trimmedValue === currentWord) {
          setWordsTyped((prev) => prev + 1);
        } else {
          setErrors((prev) => prev + 1);
        }
        setTypedWord("");
        setCurrentWordIndex((prev) => prev + 1);
        if (
          (mode === "word" && wordCount && currentWordIndex + 1 >= wordCount) ||
          (mode === "custom" && currentWordIndex + 1 >= words.length)
        ) {
          setIsTestActive(false);
        }
      }

      // Prevent default for space to avoid scrolling
      if (e.key === " ") {
        e.preventDefault();
      }
    },
    [
      isTestActive,
      setIsTestActive,
      typedWord,
      currentWord,
      setTypedWord,
      setWordsTyped,
      setErrors,
      setCurrentWordIndex,
      mode,
      wordCount,
      currentWordIndex,
      wordsTyped,
      timeLeft,
      words.length,
    ]
  );

  // Add keydown event listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => handleKeyDown(e);
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKeyDown]);

  // Update current word
  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length) {
      setCurrentWord(words[currentWordIndex]);
    } else if (currentWordIndex >= words.length && words.length > 0) {
      setIsTestActive(false);
    }
  }, [currentWordIndex, words, setCurrentWord, setIsTestActive]);

  // Focus typing area on mount
  useEffect(() => {
    typingAreaRef.current?.focus();
  }, []);

  // Render individual letters with cursor for the current word
  const renderCurrentWord = (word: string, typed: string) => {
    const letters = word.split("");
    return letters.map((letter, i) => {
      let className = "text-zinc-400";
      let content = letter;
      if (i < typed.length) {
        className = typed[i] === letter ? "text-indigo-400" : "text-red-400";
        content = typed[i]; // Show typed letter
      }
      return (
        <span key={i} className={`relative ${className}`}>
          {content}
          {i === typed.length - 1 && (
            <span className="absolute h-6 bg-indigo-500 w-0.5 animate-pulse -right-0.5 top-0.5" />
          )}
        </span>
      );
    });
  };

  // Render typed words (immutable)
  const renderTypedWord = (
    word: string,
    typed: string,
    wasCorrect: boolean
  ) => {
    const letters = word.split("");
    return letters.map((letter, i) => {
      const className = wasCorrect ? "text-zinc-500" : "text-red-400";
      const content = typed[i] || letter; // Show typed letter or original if incomplete
      return (
        <span key={i} className={className}>
          {content}
        </span>
      );
    });
  };

  // Track typed words and their correctness (placeholder)
  const typedWordsHistory = (() => {
    const history: { word: string; typed: string; wasCorrect: boolean }[] = [];
    for (let i = 0; i < currentWordIndex; i++) {
      history.push({
        word: words[i] || "",
        typed: words[i] || "", // Placeholder; actual typed word would be stored
        wasCorrect: true, // Placeholder; track correctness in a real app
      });
    }
    return history;
  })();

  return (
    <div className="flex w-full flex-col items-center justify-center bg-zinc-900 p-4">
      <Card className="w-full max-w-4xl border-zinc-700 bg-zinc-800">
        <CardHeader>
          {mode === "time" && isTestActive ? (
            <div className="flex items-center gap-2 text-xl text-white">
              <Clock className="h-5 w-5 text-zinc-400" />
              <span>Time Left: {timeLeft}s</span>
            </div>
          ) : mode === "custom" && words.length === 0 && !isTestActive ? (
            <div className="text-xl text-white">Enter text to start typing</div>
          ) : (
            <div className="text-xl text-white">Start Typing</div>
          )}
        </CardHeader>
        <CardContent>
          <div
            ref={typingAreaRef}
            tabIndex={0}
            className="w-full rounded-lg bg-zinc-700/50 p-6 outline-none"
            aria-label="Typing area"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex flex-wrap gap-4 font-mono text-xl leading-relaxed text-white">
              {/* Render typed words */}
              {typedWordsHistory.map((entry, i) => (
                <span
                  key={i}
                  className="px-1 opacity-80 transition-opacity duration-300"
                >
                  {renderTypedWord(entry.word, entry.typed, entry.wasCorrect)}
                </span>
              ))}
              {/* Render current word */}
              {currentWordIndex < words.length && (
                <span className="rounded-md bg-indigo-900/30 px-1 transition-all duration-300">
                  {renderCurrentWord(currentWord, typedWord)}
                </span>
              )}
              {/* Render upcoming words */}
              {words
                .slice(currentWordIndex + 1, currentWordIndex + 20)
                .map((word, i) => (
                  <span
                    key={i}
                    className="px-1 text-zinc-400 opacity-90 transition-opacity duration-300"
                  >
                    {word}
                  </span>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingArea;
