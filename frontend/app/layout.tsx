import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/context/AuthContext";
import {UserProvider} from "@/context/UserContext";
import NavBar from "@/components/Navbar";
import {TestProvider} from "@/context/TestContext";
import Footer from "@/components/Footer";
import {Toaster} from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Altair Type",
    description: "Enhance your typing skills!",
    icons: {
        icon: "/favicon.ico",
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <UserProvider>
            <AuthProvider>
                <TestProvider>
                    <NavBar/>
                        {children}
                    <Footer/>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            classNames: {
                                toast: "bg-zinc-900 border-zinc-800 text-zinc-200 rounded-lg shadow-lg p-4",
                                success: "bg-green-900 border-green-500 text-green-300",
                                error: "bg-red-900 border-red-500 text-red-300",
                                info: "bg-indigo-900 border-indigo-500 text-indigo-300",
                            },
                            style: { width: "320px", maxWidth: "90vw", margin: "16px" },
                        }}
                    />
                </TestProvider>
            </AuthProvider>
        </UserProvider>
        </body>
        </html>
    );
}
