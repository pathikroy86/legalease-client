"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import {
    Bars,
    Xmark,
    Magnifier,
    ScalesBalanced,
    ChevronDown,
} from "@gravity-ui/icons";
import { signOut, useSession } from "@/lib/auth-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

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
    const [profile, setProfile] = useState(null);
    const { data: session } = useSession();

    const user = session?.user;
    const displayName = profile?.name || user?.name || "User";
    const profileImage = profile?.image || profile?.profileImage || user?.image;

    useEffect(() => {
        if (!user?.email) return;

        const loadProfile = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/user-profile?email=${user.email}`);
                const data = await res.json();
                setProfile(data?._id ? data : null);
            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();
    }, [user?.email]);

    const handleSignOut = async () => {
        await signOut();
    };

    const getInitials = (name = "") => {
        const initials = name
            .split(" ")
            .filter(Boolean)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        return initials || "U";
    };

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
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-4">
                                    {profileImage ? (
                                        <Image
                                            src={profileImage}
                                            alt={displayName}
                                            width={36}
                                            height={36}
                                            unoptimized
                                            className="h-9 w-9 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A5F] text-sm font-bold text-white">
                                            {getInitials(displayName)}
                                        </div>
                                    )}
                                    <span className="max-w-32 truncate text-sm font-semibold text-slate-700">
                                        {displayName}
                                    </span>
                                </div>

                                <Button
                                    onClick={handleSignOut}
                                    variant="ghost"
                                    radius="lg"
                                    className="h-11 whitespace-nowrap px-5 font-semibold text-[#1E3A5F] bg-slate-100"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="rounded-3xl bg-slate-100 px-8 py-3 text-center font-semibold text-[#1E3A5F]"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/auth/signup"
                                    className="rounded-3xl bg-[#1E3A5F] px-5 py-3 text-center font-semibold text-white shadow-lg shadow-[#1E3A5F]/15 hover:bg-[#162c49] 2xl:px-6"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
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
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                        {profileImage ? (
                                            <Image
                                                src={profileImage}
                                                alt={displayName}
                                                width={40}
                                                height={40}
                                                unoptimized
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A5F] text-sm font-bold text-white">
                                                {getInitials(displayName)}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-slate-900">
                                                {displayName}
                                            </p>
                                            <p className="truncate text-xs font-medium text-slate-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSignOut}
                                        radius="lg"
                                        className="h-11 w-full bg-[#1E3A5F] font-semibold text-white"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/signin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full rounded-4xl bg-slate-200 py-3 text-center font-semibold text-[#1E3A5F]"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/auth/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full rounded-4xl bg-[#1E3A5F] py-3 text-center font-semibold text-white"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

