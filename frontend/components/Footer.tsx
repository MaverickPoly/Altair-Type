"use client";

import Link from "next/link";
import { Github, Twitter, Mail, Heart } from "lucide-react";

const Footer = () => {
    const navLinks = [
        { url: "/test/word", text: "Word Mode" },
        { url: "/test/time", text: "Time Mode" },
        { url: "/test/custom", text: "Custom Mode" },
        { url: "/leaderboard", text: "Leaderboard" },
    ];

    const socialLinks = [
        { url: "https://github.com/MaverickPoly/Altair-Type", text: "GitHub", icon: Github },
        // { url: "https://twitter.com/altairtype", text: "Twitter", icon: Twitter },
        // { url: "mailto:contact@altairtype.com", text: "Email", icon: Mail },
    ];

    return (
        <footer className="w-full border-t border-neutral-800 bg-neutral-950 py-8 z-10"  style={{ userSelect: 'auto', pointerEvents: 'auto' }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-center">
                    {/* Project Info */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-xl font-bold text-white">
                            Altair Type
                        </Link>
                        <p className="text-sm text-neutral-400 max-w-xs">
                            A fun and engaging typing test platform to improve your typing speed and accuracy. Practice in Word, Time, or Custom modes and climb the leaderboard!
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-200 mb-4">Explore</h3>
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.text}
                                    href={link.url}
                                    className="text-sm text-neutral-300 hover:text-indigo-400 transition-colors"
                                    aria-label={link.text}
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-200 mb-4">Connect</h3>
                        <div className="flex flex-col gap-2">
                            {socialLinks.map((link) => (
                                <Link
                                    key={link.text}
                                    target="_blank"
                                    href={link.url}
                                    className="flex items-center gap-2 text-sm text-neutral-300 hover:text-indigo-400 transition-colors"
                                    aria-label={`Visit our ${link.text}`}
                                >
                                    <link.icon className="h-6 w-6" />
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright Notice */}
                <div className="mt-8 flex flex-col items-center gap-2 border-t border-neutral-800 pt-6 text-sm text-neutral-400">
                    <div className="flex items-center gap-1">
                        <span>© {new Date().getFullYear()} Altair Type</span>
                        <Heart className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                        <span>Made with love</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;