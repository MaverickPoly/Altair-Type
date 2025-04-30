"use client";

import { useEffect, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useTest } from "@/context/TestContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import { Test } from "@/types/test.types";

// Import shadcn components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Calendar, Target, Languages, BookOpen, XCircle, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LoadingSkeleton = () => (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-5xl border-zinc-800 bg-zinc-900">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-1/3 bg-zinc-800" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-32 bg-zinc-800" />
              <Skeleton className="h-10 w-32 bg-zinc-800" />
            </div>
            <Skeleton className="h-64 w-full bg-zinc-800" />
          </div>
        </CardContent>
      </Card>
    </div>
);

export default function UserTests({
                                    params,
                                  }: {
  params: Promise<{ userId: string }>;
}) {
  const { user, loading } = useProtectedRoute();
  const { getUserTests, deleteTest, clearTests } = useTest();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userTests, setUserTests] = useState<Test[]>([]);
  const [sortBy, setSortBy] = useState<keyof Test | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get User ID from Parameters
  useEffect(() => {
    const fetchUserId = async () => {
      const userParams = await params;
      setUserId(userParams.userId);
    };
    fetchUserId();
  }, [params]);

  // Get Tests of the user
  useEffect(() => {
    const fetchTests = async () => {
      if (userId) {
        const { success, message, data } = await getUserTests(userId);
        if (success && data) {
          setUserTests(data);
        } else {
          setError(message);
        }
      }
    };
    fetchTests();
  }, [userId, getUserTests]);

  // Handle test deletion
  const handleDeleteTest = async (testId: string) => {
    if (user?._id !== userId) {
      setError("You can only delete your own tests!");
      return;
    }
    const { success, message } = await deleteTest(testId);
    if (success) {
      setUserTests(userTests.filter((test) => test._id !== testId));
    } else {
      setError(message);
    }
  };

  // Handle clear all tests
  const handleClearTests = async () => {
    if (user?._id !== userId) {
      setError("You can only clear your own tests!");
      return;
    }
    const { success, message } = await clearTests();
    if (success) {
      setUserTests([]);
    } else {
      setError(message);
    }
  };

  // Sorting logic
  const sortedTests = [...userTests]
      .filter((test) => filterType === "all" || test.type === filterType)
      .sort((a, b) => {
        const aValue = a[sortBy] || a.createdAt;
        const bValue = b[sortBy] || b.createdAt;
        if (sortBy === "createdAt") {
          return sortOrder === "asc"
              ? new Date(aValue).getTime() - new Date(bValue).getTime()
              : new Date(bValue).getTime() - new Date(aValue).getTime();
        }
        return sortOrder === "asc"
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
      });

  // Handle sort change
  const handleSort = (key: keyof Test | "createdAt") => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  // Sort indicator component
  const SortIndicator = ({ currentSortBy }: { currentSortBy: string }) => {
    if (sortBy !== currentSortBy) return null;
    return (
        <span className="ml-1 text-indigo-400">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  if (loading || !user) {
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

  return (
      <>
        <Head>
          <title>Test History - Typing Test</title>
          <meta name="description" content="User typing test history" />
          <link rel="icon" href="/frontend/app/favicon1.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center bg-zinc-950 p-4 text-zinc-100">
          <div className="w-full max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-4xl font-bold text-zinc-100">Test History</h1>
              <Badge variant="outline" className="border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
                <Calendar className="mr-1 h-4 w-4" />
                {userTests.length} Tests
              </Badge>
            </div>

            <Card className="border-zinc-800 bg-zinc-900 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <Button
                      variant="outline"
                      className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                      asChild
                  >
                    <Link href={`/user/${userId}`}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Profile
                    </Link>
                  </Button>

                  {userTests.length > 0 && user._id === userId && (
                      <Button
                          variant="destructive"
                          className="bg-red-900 hover:bg-red-800"
                          onClick={handleClearTests}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Clear All Tests
                      </Button>
                  )}
                </div>

                <div className="mb-6">
                  <Select
                      value={filterType}
                      onValueChange={setFilterType}
                  >
                    <SelectTrigger className="w-[180px] border-zinc-700 bg-zinc-800 text-zinc-200">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-800 text-zinc-200">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="time">Time</SelectItem>
                      <SelectItem value="word">Word</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {userTests.length === 0 ? (
                    <div className="rounded-lg bg-zinc-800 p-8 text-center">
                      <p className="text-xl text-zinc-400 mb-4">No tests found.</p>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-zinc-100" asChild>
                        <Link href="/test/word">Take Your First Test</Link>
                      </Button>
                    </div>
                ) : (
                    <div className="rounded-lg border border-zinc-800 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-zinc-800">
                          <TableRow className="hover:bg-zinc-800 border-b-zinc-700">
                            <TableHead
                                className="text-zinc-300 cursor-pointer hover:text-indigo-400 py-4"
                                onClick={() => handleSort("wpm")}
                            >
                              <div className="flex items-center">
                                <Target className="mr-2 h-4 w-4 text-indigo-400" />
                                WPM
                                <SortIndicator currentSortBy="wpm" />
                              </div>
                            </TableHead>
                            <TableHead
                                className="text-zinc-300 cursor-pointer hover:text-indigo-400 py-4"
                                onClick={() => handleSort("accuracy")}
                            >
                              <div className="flex items-center">
                                <Target className="mr-2 h-4 w-4 text-indigo-400" />
                                Accuracy
                                <SortIndicator currentSortBy="accuracy" />
                              </div>
                            </TableHead>
                            <TableHead className="text-zinc-300 py-4">
                              <div className="flex items-center">
                                Type
                              </div>
                            </TableHead>
                            <TableHead className="text-zinc-300 py-4">
                              <div className="flex items-center">
                                <Languages className="mr-2 h-4 w-4 text-indigo-400" />
                                Language
                              </div>
                            </TableHead>
                            <TableHead
                                className="text-zinc-300 cursor-pointer hover:text-indigo-400 py-4"
                                onClick={() => handleSort("wordCount")}
                            >
                              <div className="flex items-center">
                                <BookOpen className="mr-2 h-4 w-4 text-indigo-400" />
                                Words
                                <SortIndicator currentSortBy="wordCount" />
                              </div>
                            </TableHead>
                            <TableHead className="text-zinc-300 py-4">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-indigo-400" />
                                Duration
                              </div>
                            </TableHead>
                            <TableHead
                                className="text-zinc-300 cursor-pointer hover:text-indigo-400 py-4"
                                onClick={() => handleSort("createdAt")}
                            >
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-indigo-400" />
                                Date
                                <SortIndicator currentSortBy="createdAt" />
                              </div>
                            </TableHead>
                            {user._id === userId && (
                                <TableHead className="text-zinc-300 py-4">
                                  Actions
                                </TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedTests.map((test) => (
                              <TableRow key={test._id} className="border-b-zinc-800 hover:bg-zinc-800/50">
                                <TableCell className="text-xl font-medium text-indigo-400">
                                  {test.wpm}
                                </TableCell>
                                <TableCell className="text-xl font-medium text-indigo-400">
                                  {test.accuracy}%
                                </TableCell>
                                <TableCell className="text-zinc-300">
                                  {test.type.charAt(0).toUpperCase() + test.type.slice(1)}
                                </TableCell>
                                <TableCell className="text-zinc-300">
                                  {test.language}
                                </TableCell>
                                <TableCell className="text-xl font-medium text-indigo-400">
                                  {test.wordCount}
                                </TableCell>
                                <TableCell className="text-zinc-300">
                                  {test.time}s
                                </TableCell>
                                <TableCell className="text-zinc-300">
                                  {new Date(test.createdAt).toLocaleDateString()}
                                </TableCell>
                                {user._id === userId && (
                                    <TableCell>
                                      <Button
                                          variant="destructive"
                                          size="sm"
                                          className="bg-red-900 hover:bg-red-800 px-3"
                                          onClick={() => handleDeleteTest(test._id)}
                                      >
                                        Delete
                                      </Button>
                                    </TableCell>
                                )}
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </>
  );
}