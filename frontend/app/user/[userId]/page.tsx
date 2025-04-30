"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/types/auth.types";
import Head from "next/head";
import { UserStats } from "@/types/user.types";
import { useTest } from "@/context/TestContext";
import { wordLists } from "@/lib/words";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BarChart, Calendar, Clock, LogOut, Activity, Award, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {toast} from "sonner";

const LoadingSkeleton = () => (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-3/4 bg-zinc-800" />
          <Skeleton className="h-6 w-1/2 bg-zinc-800" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-zinc-800" />
            <Skeleton className="h-4 w-5/6 bg-zinc-800" />
          </div>
          <Separator className="bg-zinc-800" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full bg-zinc-800" />
            <Skeleton className="h-24 w-full bg-zinc-800" />
            <Skeleton className="h-24 w-full bg-zinc-800" />
            <Skeleton className="h-24 w-full bg-zinc-800" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full bg-zinc-800" />
        </CardFooter>
      </Card>
    </div>
);

export default function UserProfile({
                                      params,
                                    }: {
  params: Promise<{ userId: string }>;
}) {
  const { user, loading } = useProtectedRoute();
  const { fetchProfile, fetchUserStats } = useUser();
  const { logout } = useAuth();
  const { updateTestLanguage, testLanguage } = useTest();
  const [currentUser, setUser] = useState<User | undefined>(undefined);
  const [testStats, setTestStats] = useState<UserStats | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const userParams = await params;
      setUserId(userParams.userId);
    };
    fetchUserId();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !userId) return; // Wait for user and userId

      // Verify user authorization
      if (user._id !== userId) {
        setError("Unauthorized access");
        router.replace("/login");
        return;
      }

      // Fetch user profile
      const {
        success: profileSuccess,
        message: profileMessage,
        data: profileData,
      } = await fetchProfile(userId);
      if (profileSuccess) {
        setUser(profileData);
      } else {
        setError(profileMessage);
        router.replace("/");
        return;
      }

      // Fetch test stats
      const {
        success: statsSuccess,
        message: statsMessage,
        data: statsData,
      } = await fetchUserStats(userId);
      if (statsSuccess) {
        setTestStats(statsData);
      } else {
        setError(statsMessage);
      }
    };
    fetchData();
  }, [userId, user, fetchProfile, fetchUserStats, router]);

  const handleLogout = () => {
    toast.info("Logged out successfully!");
    logout();
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950">
          <Card className="w-full max-w-md border-red-900 bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-center text-xl text-red-500" role="alert">
                {error}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                  onClick={() => router.push("/")}
              >
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
    );
  }

  if (!currentUser) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950">
          <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-center text-xl text-zinc-400">No user found!</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                  onClick={() => router.push("/")}
              >
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
    );
  }

  return (
      <>
        <Head>
          <title>{currentUser.username}'s Profile - Typing Test</title>
          <meta name="description" content="User profile with typing test stats" />
          <link rel="icon" href="/frontend/app/favicon1.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center bg-zinc-950 p-4 sm:p-6">
          <div className="w-full max-w-4xl">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">User Profile</h1>
              <Badge
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-300 w-fit"
              >
                <Calendar className="mr-1 h-4 w-4" />
                Member since {new Date(currentUser.createdAt).toLocaleDateString()}
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-zinc-800 bg-zinc-900 md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl text-zinc-100">
                    {currentUser.username}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    {currentUser.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-zinc-400">Test Language</h3>
                    <Select defaultValue={testLanguage} onValueChange={updateTestLanguage}>
                      <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-200">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-700 bg-zinc-800 text-zinc-200">
                        {Object.keys(wordLists).map((wordList) => (
                            <SelectItem key={wordList} value={wordList}>
                              {wordList}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Button
                        variant="default"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-zinc-100"
                        asChild
                    >
                      <Link href={`/user/${currentUser._id}/tests`}>
                        <BarChart className="mr-2 h-4 w-4" />
                        View Test History
                      </Link>
                    </Button>

                    <Button
                        variant="destructive"
                        className="w-full bg-red-900 hover:bg-red-800"
                        onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-zinc-900 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-zinc-100">
                    <Activity className="mr-2 h-5 w-5" />
                    Typing Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testStats && testStats.totalTests > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="flex flex-col rounded-lg bg-zinc-800 p-4">
                          <span className="text-sm font-medium text-zinc-400">Average WPM</span>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-5 w-5 text-indigo-500" />
                            <span className="text-2xl sm:text-3xl font-bold text-indigo-400">
                          {testStats.averageWpm}
                        </span>
                          </div>
                        </div>

                        <div className="flex flex-col rounded-lg bg-zinc-800 p-4">
                          <span className="text-sm font-medium text-zinc-400">Accuracy</span>
                          <div className="flex items-center">
                            <Award className="mr-2 h-5 w-5 text-indigo-500" />
                            <span className="text-2xl sm:text-3xl font-bold text-indigo-400">
                          {testStats.averageAccuracy}%
                        </span>
                          </div>
                        </div>

                        <div className="flex flex-col rounded-lg bg-zinc-800 p-4">
                          <span className="text-sm font-medium text-zinc-400">Tests Completed</span>
                          <div className="flex items-center">
                            <Activity className="mr-2 h-5 w-5 text-indigo-500" />
                            <span className="text-2xl sm:text-3xl font-bold text-indigo-400">
                          {testStats.totalTests}
                        </span>
                          </div>
                        </div>

                        <div className="flex flex-col rounded-lg bg-zinc-800 p-4">
                          <span className="text-sm font-medium text-zinc-400">Total Words</span>
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                            <span className="text-2xl sm:text-3xl font-bold text-indigo-400">
                          {testStats.totalWords}
                        </span>
                          </div>
                        </div>
                      </div>
                  ) : (
                      <div className="rounded-lg bg-zinc-800 p-6 text-center">
                        <p className="text-lg text-zinc-400">No typing tests completed yet.</p>
                        <Button
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-zinc-100"
                            asChild
                        >
                          <Link href="/test/word">Take Your First Test</Link>
                        </Button>
                      </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </>
  );
}