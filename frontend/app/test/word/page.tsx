'use client';

import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import {useTypingContext, TypingProvider} from '@/context/TypingContext';
import TypingArea from '@/components/TypingArea';
import {generateWords} from '@/lib/words';
import {useTest} from "@/context/TestContext";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Type} from 'lucide-react';
import {useProtectedRoute} from "@/hooks/useProtectedRoute";
import Loading from "@/components/Loading";

const WordSettings: React.FC = () => {
    const {wordCount, setWordCount} = useTypingContext();

    return (
        <Card className="w-full max-w-md border-zinc-700 bg-zinc-800 mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                    <Type className="h-5 w-5 text-zinc-400"/>
                    Test Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-200">Word Count</label>
                    <Select
                        value={wordCount.toString()}
                        onValueChange={(value) => setWordCount(Number(value))}
                        aria-label="Select word count"
                    >
                        <SelectTrigger
                            className="w-full border-zinc-700 bg-zinc-700/50 text-white focus:ring-indigo-500">
                            <SelectValue placeholder="Select word count"/>
                        </SelectTrigger>
                        <SelectContent className="border-zinc-700 bg-zinc-800 text-white">
                            <SelectItem value="10">10 words</SelectItem>
                            <SelectItem value="25">25 words</SelectItem>
                            <SelectItem value="50">50 words</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};

const WordPage = () => {
    const {user, loading} = useProtectedRoute();
    const {testLanguage} = useTest();
    const {wordCount} = useTypingContext();
    const [words, setWords] = useState<string[]>([]);

    useEffect(() => {
        setWords(generateWords(wordCount, testLanguage));
    }, [wordCount, testLanguage]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Head>
                <title>Word Mode - Typing Test</title>
                <meta name="description" content="Typing test in word mode"/>
                <link rel="icon" href="/frontend/app/favicon1.ico"/>
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-start bg-zinc-900 p-4 pt-10">
                <h1 className="mb-8 text-3xl font-bold text-white">Word Mode</h1>
                <WordSettings/>
                <TypingArea words={words} mode="word" wordCount={wordCount}/>
            </main>
        </>
    );
};

export default () => (
    <TypingProvider>
        <WordPage/>
    </TypingProvider>
);