'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useTypingContext, TypingProvider } from '@/context/TypingContext';
import TypingArea from '@/components/TypingArea';
import { generateWords } from '@/lib/words';
import { useTest } from "@/context/TestContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from 'lucide-react';
import {useProtectedRoute} from "@/hooks/useProtectedRoute";
import Loading from "@/components/Loading";

const TimeSettings: React.FC = () => {
    const { timeLimit, setTimeLimit } = useTypingContext();

    return (
        <Card className="w-full max-w-md border-zinc-700 bg-zinc-800 mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                    <Clock className="h-5 w-5 text-zinc-400" />
                    Test Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-200">Time Limit</label>
                    <Select
                        value={timeLimit.toString()}
                        onValueChange={(value) => setTimeLimit(Number(value))}
                        aria-label="Select time limit"
                    >
                        <SelectTrigger className="w-full border-zinc-700 bg-zinc-700/50 text-white focus:ring-indigo-500">
                            <SelectValue placeholder="Select time limit" />
                        </SelectTrigger>
                        <SelectContent className="border-zinc-700 bg-zinc-800 text-white">
                            <SelectItem value="15">15 seconds</SelectItem>
                            <SelectItem value="30">30 seconds</SelectItem>
                            <SelectItem value="60">60 seconds</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};

const TimePage = () => {
    const {user, loading} = useProtectedRoute();
    const { testLanguage } = useTest();
    const { timeLimit } = useTypingContext();
    const [words, setWords] = useState<string[]>([]);

    useEffect(() => {
        setWords(generateWords(50, testLanguage)); // Generate initial words
    }, [timeLimit, testLanguage]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Head>
                <title>Time Mode - Typing Test</title>
                <meta name="description" content="Typing test in time mode" />
                <link rel="icon" href="/frontend/app/favicon1.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-start bg-zinc-900 p-4 pt-10">
                <h1 className="mb-8 text-3xl font-bold text-white">Time Mode</h1>
                <TimeSettings />
                <TypingArea words={words} mode="time" timeLimit={timeLimit} />
            </main>
        </>
    );
};

export default () => (
    <TypingProvider>
        <TimePage />
    </TypingProvider>
);