"use client";

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import api from "@/lib/axios";
import {CreateTestPayload, TestProviderPayload} from "@/types/test.types";
import {wordLists} from "@/lib/words";

const TestContext = createContext<TestProviderPayload | undefined>(undefined);

export const TestProvider = ({children}: { children: ReactNode }) => {
    const [testLanguage, setTestLanguage] = useState<string>("english");

    useEffect(() => {
        const lang = localStorage.getItem("language") || "english";
        setTestLanguage(lang);
    }, []);

    const updateTestLanguage = (language: string) => {
        if (!Object.keys(wordLists).includes(language)) {
            language = "english";
            localStorage.setItem("langauge", "english");
        }
        localStorage.setItem("language", language);
        setTestLanguage(language);
    }

    // Create Test
    const createTest = async (test: CreateTestPayload) => {
        try {
            const language = test.type == "custom" ? "Custom" : testLanguage;
            await api.post("/tests/create", {
                wpm: test.wpm,
                accuracy: test.accuracy,
                time: test.time,
                type: test.type,
                wordCount: test.wordCount,
                language: language,
            });
            return {success: true, message: "Created test successfully!"};
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to create test!",
            };
        }
    };
    // Tests of specific user
    const getUserTests = async (userId: string) => {
        try {
            const res = await api.get(`/tests/${userId}/all`);
            return {
                success: true,
                message: "Fetched user tests successfully!",
                data: res.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error?.response?.data?.message || "Failed to fetch user tests!",
            };
        }
    };
    // Clear Tests
    const clearTests = async () => {
        try {
            await api.get("/tests/clear");
            return {success: true, message: "Cleared tests successfully!"};
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to clear all tests!",
            };
        }
    };
    // Get Specific Test
    const getTest = async (testId: string) => {
        try {
            const res = await api.get(`/tests/${testId}`);
            return {
                success: true,
                message: "Fetched test successfully!",
                data: res.data.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to get test!",
            };
        }
    };

    // Delete Specific Test
    const deleteTest = async (testId: string) => {
        try {
            await api.delete(`/tests/test/${testId}`);
            return {success: true, message: "Deleted test successfully!"};
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to delete test!",
            };
        }
    };

    return (
        <TestContext.Provider
            value={{testLanguage, updateTestLanguage, createTest, getUserTests, clearTests, getTest, deleteTest}}
        >
            {children}
        </TestContext.Provider>
    );
};

export const useTest = () => {
    const context = useContext(TestContext);
    if (!context) throw new Error("useTest with be within TestProvider!");
    return context;
};
