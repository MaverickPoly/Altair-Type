"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useTypingContext, TypingProvider } from "@/context/TypingContext";
import TypingArea from "@/components/TypingArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, RotateCcw, Play } from "lucide-react";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";
import Loading from "@/components/Loading";

const CustomSettings: React.FC<{ onStartTest: () => void }> = ({
                                                                 onStartTest,
                                                               }) => {
  const {
    customText,
    setCustomText,
    isTestActive,
    setIsTestActive,
    setWordsTyped,
    setErrors,
    setTypedWord,
    setCurrentWordIndex,
  } = useTypingContext();

  const handleReset = () => {
    setIsTestActive(false);
    setCustomText("");
    setWordsTyped(0);
    setErrors(0);
    setTypedWord("");
    setCurrentWordIndex(0);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomText(e.target.value);
  };

  return (
      <Card className="w-full max-w-md border-zinc-700 bg-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-white">
            <Edit className="h-5 w-5 text-zinc-400" />
            Custom Test Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-1">Custom Text</label>
              <Textarea
                  value={customText}
                  onChange={handleTextChange}
                  className="w-full border-zinc-700 bg-zinc-700/50 text-white placeholder-zinc-400 focus:ring-indigo-500"
                  rows={4}
                  disabled={isTestActive}
                  aria-label="Custom text input"
                  placeholder="Enter your text here..."
              />
            </div>
            <div className="flex gap-4">
              <Button
                  onClick={handleReset}
                  className="flex-1 bg-zinc-600 text-white hover:bg-zinc-500"
                  disabled={isTestActive}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                  onClick={onStartTest}
                  className={`flex-1 ${customText.trim() ? "bg-indigo-600 hover:bg-indigo-700" : "bg-zinc-600 cursor-not-allowed"} text-white`}
                  disabled={!customText.trim()}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

const CustomPage = () => {
  const {user, loading} = useProtectedRoute();

  if (loading) {
    return <Loading />;
  }

  const {
    customText,
    setIsTestActive,
    setWordsTyped,
    setCustomText,
    setErrors,
    setTypedWord,
    setCurrentWordIndex,
  } = useTypingContext();
  const [words, setWords] = useState<string[]>([]);
  const [isTestStarted, setIsTestStarted] = useState(false);

  useEffect(() => {
    if (customText) {
      setWords(customText.split(" ").filter((word) => word));
    } else {
      setWords([]);
    }
  }, [customText]);

  const handleStartTest = () => {
    setIsTestStarted(true);
    setIsTestActive(true);
    setWordsTyped(0);
    setErrors(0);
    setTypedWord("");
    setCurrentWordIndex(0);
  };

  const handleReset = () => {
    setIsTestStarted(false);
    setIsTestActive(false);
    setCustomText("");
    setWordsTyped(0);
    setErrors(0);
    setTypedWord("");
    setCurrentWordIndex(0);
  };

  return (
      <>
        <Head>
          <title>Custom Mode - Typing Test</title>
          <meta name="description" content="Typing test in custom mode" />
          <link rel="icon" href="/frontend/app/favicon1.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-4">
          <h1 className="mb-8 text-3xl font-bold text-white">Custom Mode</h1>
          {!isTestStarted ? (
              <CustomSettings onStartTest={handleStartTest} />
          ) : (
              <TypingArea words={words} mode="custom" />
          )}
        </main>
      </>
  );
};

export default () => (
    <TypingProvider>
      <CustomPage />
    </TypingProvider>
);