"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import Head from "next/head";
import { LeaderboardEntry } from "@/types/user.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Trophy,
  User,
  ArrowUpDown,
  Clock,
  Target,
  CheckCircle,
  BookOpen
} from "lucide-react";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";
import Loading from "@/components/Loading";

export default function LeaderBoardPage() {
  const {user, loading: authLoading} = useProtectedRoute();
  const { fetchLeaderboard } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<"averageWpm" | "totalTests">("averageWpm");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { success, message, data } = await fetchLeaderboard();

      if (success && data !== undefined) {
        setLeaderboard(data);
      } else {
        setError(message);
      }
      setLoading(false);
    };

    fetchData();
  }, [fetchLeaderboard]);

  if (authLoading) {
    return <Loading />;
  }

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    return b[sortBy] - a[sortBy];
  });

  const handleSortChange = (newSortBy: "averageWpm" | "totalTests") => {
    setSortBy(newSortBy);
  };

  return (
      <>
        <Head>
          <title>Leaderboard - Typing Test</title>
          <meta name="description" content="Typing test leaderboard" />
          <link rel="icon" href="/frontend/app/favicon1.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center bg-zinc-950 text-zinc-100 p-6">
          <div className="w-full max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-4xl font-bold text-zinc-100 flex items-center">
                <Trophy className="mr-3 h-8 w-8 text-indigo-400" />
                Leaderboard
              </h1>
              <Badge variant="outline" className="border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
                <User className="mr-1 h-4 w-4" />
                {leaderboard.length} Users
              </Badge>
            </div>

            <Card className="border-zinc-800 bg-zinc-900 shadow-xl">
              <CardHeader className="border-b border-zinc-800">
                <CardTitle className="text-2xl font-bold text-indigo-400">
                  Top Typists
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6 flex gap-4">
                  <Button
                      onClick={() => handleSortChange("averageWpm")}
                      variant={sortBy === "averageWpm" ? "default" : "outline"}
                      className={`${
                          sortBy === "averageWpm"
                              ? "bg-indigo-600 hover:bg-indigo-700 text-zinc-100"
                              : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                      }`}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Sort by Average WPM
                  </Button>
                  <Button
                      onClick={() => handleSortChange("totalTests")}
                      variant={sortBy === "totalTests" ? "default" : "outline"}
                      className={`${
                          sortBy === "totalTests"
                              ? "bg-indigo-600 hover:bg-indigo-700 text-zinc-100"
                              : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                      }`}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Sort by Tests Completed
                  </Button>
                </div>

                {loading && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                      <p className="ml-2 text-xl text-zinc-400">Loading leaderboard...</p>
                    </div>
                )}

                {error && (
                    <p className="text-xl text-red-500 py-8 text-center" role="alert">
                      {error}
                    </p>
                )}

                {!loading && !error && leaderboard.length === 0 && (
                    <div className="rounded-lg bg-zinc-800 p-8 text-center">
                      <p className="text-xl text-zinc-400 py-8 text-center">
                        No users found.
                      </p>
                    </div>
                )}

                {!loading && !error && leaderboard.length > 0 && (
                    <div className="rounded-lg border border-zinc-800 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-zinc-800">
                          <TableRow className="hover:bg-zinc-800 border-b-zinc-700">
                            <TableHead className="text-zinc-300 py-4">
                              <div className="flex items-center">
                                <Trophy className="mr-2 h-4 w-4 text-indigo-400" />
                                Rank
                              </div>
                            </TableHead>
                            <TableHead className="text-zinc-300 py-4">
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-indigo-400" />
                                Username
                              </div>
                            </TableHead>
                            <TableHead className="text-zinc-300 py-4">
                              <div className="flex items-center">
                                <Target className="mr-2 h-4 w-4 text-indigo-400" />
                                Average WPM
                                {sortBy === "averageWpm" && (
                                    <ArrowUpDown className="ml-1 h-4 w-4 text-indigo-400" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead className="text-zinc-300 py-4">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-indigo-400" />
                                Tests Completed
                                {sortBy === "totalTests" && (
                                    <ArrowUpDown className="ml-1 h-4 w-4 text-indigo-400" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead className="text-zinc-300 py-4">
                              <div className="flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4 text-indigo-400" />
                                Average Accuracy
                              </div>
                            </TableHead>
                            <TableHead className="text-zinc-300 py-4">
                              <div className="flex items-center">
                                <BookOpen className="mr-2 h-4 w-4 text-indigo-400" />
                                Total Words
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedLeaderboard.map((entry, index) => (
                              <TableRow
                                  key={entry.username}
                                  className="border-b-zinc-800 hover:bg-zinc-800/50"
                              >
                                <TableCell className="text-lg font-medium text-zinc-400">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="text-lg text-zinc-300">
                                  {entry.username}
                                </TableCell>
                                <TableCell className="text-xl font-medium text-indigo-400">
                                  {entry.averageWpm}
                                </TableCell>
                                <TableCell className="text-xl font-medium text-indigo-400">
                                  {entry.totalTests}
                                </TableCell>
                                <TableCell className="text-xl font-medium text-indigo-400">
                                  {entry.averageAccuracy}%
                                </TableCell>
                                <TableCell className="text-xl font-medium text-indigo-400">
                                  {entry.totalWords}
                                </TableCell>
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