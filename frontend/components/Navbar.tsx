"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Menu, X, User, History, Trophy, LogIn, UserPlus, Type, Clock, Edit } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {toast} from "sonner";

const NavLink = ({
                     url,
                     text,
                     icon: Icon,
                     onClick = () => {},
                 }: {
    url: string;
    text: string;
    icon: React.ElementType;
    onClick?: () => void;
}) => {
    return (
        <Link
            href={url}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            onClick={onClick}
        >
            <Icon className="h-4 w-4" />
            <span>{text}</span>
        </Link>
    );
};

export default function NavBar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const userLinks = [
        { url: `/user/${user?._id}`, text: "Profile", icon: User },
        { url: `/user/${user?._id}/tests`, text: "History", icon: History },
        { url: `/leaderboard`, text: "Leaderboard", icon: Trophy },
    ];

    const authLinks = [
        { url: `/auth/login`, text: "Login", icon: LogIn },
        { url: `/auth/register`, text: "Register", icon: UserPlus },
    ];

    const testModeLinks = [
        { url: "/test/word", text: "Word", icon: Type },
        { url: "/test/time", text: "Time", icon: Clock },
        { url: "/test/custom", text: "Custom", icon: Edit },
    ];

    const links = user ? userLinks : authLinks;

    const handleLogout = () => {
        toast.info("Logged out successfully!");
        logout();
        setIsOpen(false);
    };

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950 px-4 py-3">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-white">
                    Altair Type
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                >
                                    <Type className="h-4 w-4" />
                                    Test Modes
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="border-neutral-700 bg-neutral-900 text-white">
                                {testModeLinks.map((link) => (
                                    <DropdownMenuItem key={link.text} asChild>
                                        <Link
                                            href={link.url}
                                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-neutral-800"
                                        >
                                            <link.icon className="h-4 w-4" />
                                            {link.text}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {links.map((link) => (
                        <NavLink
                            key={link.text}
                            url={link.url}
                            text={link.text}
                            icon={link.icon}
                        />
                    ))}
                    {user && (
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
                            onClick={handleLogout}
                        >
                            <LogIn className="h-4 w-4" />
                            Logout
                        </Button>
                    )}
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-neutral-300">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 bg-neutral-900 p-0 border-neutral-800">
                            <div className="flex flex-col py-2">
                                <div className="px-4 py-6">
                                    <Link
                                        href="/"
                                        className="text-xl font-bold text-white"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Altair Type
                                    </Link>
                                </div>
                                <div className="flex flex-col px-2 space-y-1">
                                    {user && (
                                        <>
                                            <div className="px-3 py-2 text-sm font-semibold text-neutral-400">
                                                Test Modes
                                            </div>
                                            {testModeLinks.map((link) => (
                                                <NavLink
                                                    key={link.text}
                                                    url={link.url}
                                                    text={link.text}
                                                    icon={link.icon}
                                                    onClick={() => setIsOpen(false)}
                                                />
                                            ))}
                                        </>
                                    )}
                                    {links.map((link) => (
                                        <NavLink
                                            key={link.text}
                                            url={link.url}
                                            text={link.text}
                                            icon={link.icon}
                                            onClick={() => setIsOpen(false)}
                                        />
                                    ))}
                                    {user && (
                                        <button
                                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                                            onClick={handleLogout}
                                        >
                                            <LogIn className="h-4 w-4" />
                                            <span>Logout</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}