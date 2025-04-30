"use client";

import React from "react";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Type, Languages, AlertCircle } from "lucide-react";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";
import Loading from "@/components/Loading";

const ResultsPage = () => {
  const {user, loading} = useProtectedRoute();

  if (loading) {
    return <Loading />;
  }

  const router = useRouter();
  const searchParams = useSearchParams();

  const wpm = searchParams.get("wpm");
  const accuracy = searchParams.get("accuracy");
  const errors = searchParams.get("errors");
  const type = searchParams.get("type");
  const language = searchParams.get("language");

  if (!wpm || !accuracy || !errors) {
    router.replace("/");
    return null;
  }

  const handleRetry = () => {
    let redirectPath: string;
    if (type === "time") {
      redirectPath = "/test/time";
    } else if (type === "word") {
      redirectPath = "/test/word";
    } else if (type === "custom") {
      redirectPath = "/test/custom";
    } else {
      redirectPath = "/";
    }
    router.push(redirectPath);
  };

  return (
      <>
        <Head>
          <title>Test Results - Typing Test</title>
          <meta name="description" content="Typing test results" />
          <link rel="icon" href="/frontend/app/favicon1.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-4">
          <h1 className="mb-8 text-3xl font-bold text-white">Test Results</h1>
          <Card className="w-full max-w-md border-zinc-700 bg-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Trophy className="h-5 w-5 text-zinc-400" />
                Your Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 text-lg text-zinc-200">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-zinc-400" />
                  <span className="font-semibold">
                  WPM: <span className="text-indigo-400">{wpm}</span>
                </span>
                </div>
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-zinc-400" />
                  <span className="font-semibold">
                  Accuracy: <span className="text-indigo-400">{accuracy}%</span>
                </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-zinc-400" />
                  <span className="font-semibold">
                  Errors: <span className="text-red-400">{errors}</span>
                </span>
                </div>
                {type && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-zinc-400" />
                      <span className="font-semibold">
                    Test Type: <span className="text-indigo-400">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </span>
                    </div>
                )}
                {language && (
                    <div className="flex items-center gap-2">
                      <Languages className="h-5 w-5 text-zinc-400" />
                      <span className="font-semibold">
                    Language: <span className="text-indigo-400">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
                  </span>
                    </div>
                )}
              </div>
              <div className="mt-6 flex gap-4">
                <Button
                    asChild
                    className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Link href={`/user/${user?._id}`}>Back to Profile</Link>
                </Button>
                <Button
                    onClick={handleRetry}
                    className="flex-1 bg-zinc-600 text-white hover:bg-zinc-500"
                >
                  Retry Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </>
  );
};

export default ResultsPage;