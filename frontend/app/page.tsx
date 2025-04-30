"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {Clock, Type, FileText, ArrowRight, Terminal, Keyboard, Zap, Target, Award} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Animated typing text component
const TypingText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 100); // Adjust speed as needed

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
      <span>
      {displayedText}
        <span className="animate-pulse">|</span>
    </span>
  );
};

// Enhanced TestCard component with animations
const TestCard = ({ url, title, description, icon: Icon, index }: { url: string; title: string; description: string; icon: React.ElementType; index: number }) => {
  return (
      <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          whileHover={{ scale: 1.03, y: -5 }}
      >
        <Card className="w-full w-50 sm:w-64 bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/30">
          <CardHeader className="pb-2">
            <motion.div
                className="w-12 h-12 rounded-full bg-indigo-950 flex items-center justify-center mb-3"
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="h-6 w-6 text-indigo-400" />
            </motion.div>
            <CardTitle className="text-xl text-white">{title}</CardTitle>
            <CardDescription className="text-gray-400">{description}</CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <Link href={url} className="w-full">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 group transition-all duration-300">
                Start Test
                <motion.div
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
  );
};

// Feature component with animation
const Feature = ({ icon: Icon, title, description, index }: { icon: React.ElementType; title: string; description: string; index: number }) => {
  return (
      <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
      >
        <div className="flex items-start space-x-4 p-5 rounded-xl hover:bg-gray-800/30 transition-colors duration-300">
          <motion.div
              className="mt-1 rounded-full bg-indigo-950 p-3 flex-shrink-0"
              whileHover={{ rotate: 20, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="h-5 w-5 text-indigo-400" />
          </motion.div>
          <div>
            <h3 className="font-medium text-white text-lg">{title}</h3>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </motion.div>
  );
};

// Stats counter that animates from 0
const AnimatedCounter = ({ to, suffix = "", duration = 2 }: { to: string; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(to);
    const incrementTime = (duration / end) * 1000;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => {
      clearInterval(timer);
    };
  }, [to, duration]);

  return <span>{count}{suffix}</span>;
};

const TestOptions = [
  {
    url: "/test/time",
    title: "Time Test",
    description: "Challenge yourself to complete typing tests within specified time limits.",
    icon: Clock,
  },
  {
    url: "/test/word",
    title: "Word Test",
    description: "Practice with word combinations to improve vocabulary and typing speed.",
    icon: Type,
  },
  {
    url: "/test/custom",
    title: "Custom Test",
    description: "Create your own typing tests with custom text and settings.",
    icon: FileText,
  },
];

const features = [
  {
    icon: Zap,
    title: "Improve Speed",
    description: "Build muscle memory and increase your typing speed with targeted exercises.",
  },
  {
    icon: Target,
    title: "Enhance Accuracy",
    description: "Reduce errors and develop precision in your typing technique.",
  },
  {
    icon: Terminal,
    title: "Track Progress",
    description: "Monitor your typing speed, accuracy, and improvements over time.",
  },
  {
    icon: Award,
    title: "Compete Globally",
    description: "Join the leaderboard and compete with typists around the world.",
  },
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
      <>
        <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white pt-6 pb-16">
          {/* Background pattern */}
          <div className="absolute inset-x-0 top-0 h-full z-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(111,76,255,0.15),transparent)]"></div>
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_600px_at_0%_400px,rgba(56,189,248,0.12),transparent)]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Hero Section */}
            <section className="py-12 md:py-20">
              <motion.div
                  className="text-center max-w-3xl mx-auto mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.8 }}
              >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Badge className="mb-4 bg-indigo-900 text-indigo-200 hover:bg-indigo-800 px-4 py-1 text-sm">
                    <motion.span
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                      Welcome
                    </motion.span>
                  </Badge>
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Altair Type
                </motion.h1>

                <motion.p
                    className="text-xl text-gray-300 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <TypingText text="Master your typing skills with precision and speed" />
                </motion.p>
              </motion.div>

              {/* Animated typing test demo */}
              <motion.div
                  className="max-w-3xl mx-auto py-8 px-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 mb-16 shadow-xl shadow-indigo-950/20"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="flex items-center mb-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-gray-500">Word Test</span>
                  </div>
                </div>

                <div className="h-auto w-full bg-gray-800/70 rounded-lg mb-4 relative overflow-hidden px-4 py-3">
                  <div className="relative z-10">
                    <p className="text-gray-300 mb-2 text-sm">
                      <span className="text-white font-semibold">Type this passage:</span>
                    </p>
                    <p className="text-gray-300 text-sm">
                      <span className="text-green-400">The quick brown fox jumps over the lazy dog.</span>
                      <span className="text-gray-400"> A pangram is a sentence that contains every letter of the alphabet. They are often used to test typewriters and keyboards.</span>
                    </p>
                  </div>
                  <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>

                <div className="flex flex-col gap-2 items-center justify-center mb-2">
                  <div className="w-full h-6 bg-gray-800/70 rounded-md px-3 py-1 flex items-center">
                    <motion.span
                        className="text-sm text-indigo-300 font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                      The quick brown fox jumps
                      <motion.span
                          className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    </motion.span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <motion.div
                        className="text-center py-1 px-2 bg-gray-800/70 rounded-md text-xs text-gray-400"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                    >
                      <span className="block text-indigo-300 font-bold">54 WPM</span>
                      Speed
                    </motion.div>
                    <motion.div
                        className="text-center py-1 px-2 bg-gray-800/70 rounded-md text-xs text-gray-400"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                    >
                      <span className="block text-indigo-300 font-bold">98%</span>
                      Accuracy
                    </motion.div>
                    <motion.div
                        className="text-center py-1 px-2 bg-gray-800/70 rounded-md text-xs text-gray-400"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
                    >
                      <span className="block text-indigo-300 font-bold">0:42</span>
                      Time
                    </motion.div>
                  </div>
                </div>

                <motion.div
                    className="flex justify-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                  <motion.div
                      className="flex items-center gap-2 text-xs text-gray-500"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Keyboard className="h-3 w-3" />
                    <span>Continue typing to improve...</span>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Features Section */}
              <motion.div
                  className="grid md:grid-cols-2 gap-6 mb-20 max-w-4xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
              >
                <motion.h2
                    className="text-2xl font-bold mb-6 md:col-span-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                >
                  Why Altair Type?
                </motion.h2>

                {features.map((feature, index) => (
                    <Feature
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        index={index}
                    />
                ))}
              </motion.div>
            </section>

            {/* Practice Cards Section */}
            <motion.section
                className="py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.8 }}
            >
              <div className="text-center mb-12">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-3">Choose Your Test</h2>
                  <p className="text-gray-400 max-w-lg mx-auto">Select a test type to begin your typing journey and track your improvement over time</p>
                </motion.div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {TestOptions.map((test, index) => (
                    <TestCard
                        key={index}
                        url={test.url}
                        title={test.title}
                        description={test.description}
                        icon={test.icon}
                        index={index}
                    />
                ))}
              </div>
            </motion.section>
          </div>
        </main>
      </>
  );
}