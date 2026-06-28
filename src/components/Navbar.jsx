"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import {
    Bars,
    Xmark,
    Magnifier,
    ScalesBalanced,
    ChevronDown,
} from "@gravity-ui/icons";

const navLinks = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Browse Lawyers",
        href: "/lawyers",
    },
    {
        label: "Categories",
        href: "/categories",
    },
    {
        label: "Pricing",
        href: "/pricing",
    },
];

const Navbar = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActiveRoute = (href) => {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1E3A5F] shadow-lg shadow-slate-900/10">
                        <ScalesBalanced className="h-6 w-6 text-[#C9A646]" />
                    </div>

                    <div className="leading-none">
                        <h1 className="text-xl font-bold tracking-tight text-slate-950">
                            LegalEase
                        </h1>
                        <p className="mt-1 hidden text-xs font-medium text-slate-500 sm:block">
                            Hire legal experts online
                        </p>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-4 xl:flex">
                    <ul className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-2">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`block whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition 2xl:px-4 ${isActiveRoute(link.href)
                                            ? "bg-white text-[#1E3A5F] shadow-sm"
                                            : "text-slate-600 hover:bg-white hover:text-slate-950"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}

                        <li>
                            <Link
                                href="/dashboard"
                                className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition 2xl:px-4 ${isActiveRoute("/dashboard")
                                        ? "bg-white text-[#1E3A5F] shadow-sm"
                                        : "text-slate-600 hover:bg-white hover:text-slate-950"
                                    }`}
                            >
                                Dashboard
                                <ChevronDown className="h-3.5 w-3.5" />
                            </Link>
                        </li>
                    </ul>

                    <div className="relative w-56 2xl:w-72">
                        <Magnifier className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Search lawyers..."
                            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1E3A5F] focus:bg-white"
                        />
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <Button
                            as={Link}
                            href="/auth/signin"
                            variant="ghost"
                            radius="lg"
                            className="h-11 whitespace-nowrap px-4 font-semibold text-[#1E3A5F] 2xl:px-5"
                        >
                            Login
                        </Button>

                        <Button
                            as={Link}
                            href="/auth/signup"
                            radius="lg"
                            className="h-11 whitespace-nowrap bg-[#1E3A5F] px-5 font-semibold text-white shadow-lg shadow-[#1E3A5F]/15 hover:bg-[#162c49] 2xl:px-6"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen((current) => !current)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 xl:hidden"
                    aria-label="Toggle navigation menu"
                >
                    {isMenuOpen ? (
                        <Xmark className="h-5 w-5" />
                    ) : (
                        <Bars className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="border-t border-slate-200 bg-white xl:hidden">
                    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
                        <div className="relative">
                            <Magnifier className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search lawyers..."
                                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#1E3A5F] focus:bg-white"
                            />
                        </div>

                        <ul className="space-y-2">
                            {[...navLinks, { label: "Dashboard", href: "/dashboard" }].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActiveRoute(link.href)
                                                ? "bg-[#EEF4F8] text-[#1E3A5F]"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-5">
                            <Button
                                as={Link}
                                href="/auth/signin"
                                variant="bordered"
                                radius="lg"
                                className="h-11 w-full border-slate-200 font-semibold text-[#1E3A5F]"
                            >
                                Login
                            </Button>

                            <Button
                                as={Link}
                                href="/auth/signup"
                                radius="lg"
                                className="h-11 w-full bg-[#1E3A5F] font-semibold text-white"
                            >
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
