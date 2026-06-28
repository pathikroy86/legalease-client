import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { LogoFacebook, LogoLinkedin, ScalesBalanced } from "@gravity-ui/icons";

const TwitterIcon = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M18.9 3.2h3.4l-7.5 8.6 8.8 11.7h-6.9l-5.4-7.1-6.2 7.1H1.7l8-9.2L1.3 3.2h7.1l4.9 6.5 5.6-6.5Zm-1.2 18.2h1.9L7.4 5.2h-2L17.7 21.4Z"
            fill="currentColor"
        />
    </svg>
);

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Lawyers", href: "/lawyers" },
    { label: "Legal Categories", href: "/categories" },
    { label: "Dashboard", href: "/dashboard" },
];

const legalLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
    { label: "Facebook", icon: LogoFacebook, href: "https://facebook.com" },
    { label: "LinkedIn", icon: LogoLinkedin, href: "https://linkedin.com" },
    { label: "Twitter", icon: TwitterIcon, href: "https://x.com" },
];

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.25fr]">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1E3A5F] shadow-lg shadow-slate-900/10">
                                <ScalesBalanced className="h-6 w-6 text-[#C9A646]" />
                            </div>

                            <div className="leading-none">
                                <h2 className="text-xl font-bold tracking-tight text-slate-950">
                                    LegalEase
                                </h2>
                                <p className="mt-1 text-xs font-medium text-slate-500">
                                    Online Lawyer Hiring Platform
                                </p>
                            </div>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
                            Connect with verified legal professionals, send hiring requests, and manage consultation payments from one clean workspace.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            {socialLinks.map((link) => {
                                const Icon = link.icon;

                                return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    aria-label={link.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-sm font-bold text-[#1E3A5F] transition hover:border-[#C9A646] hover:bg-[#EEF4F8]"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950">
                            Quick Links
                        </h3>
                        <ul className="mt-5 space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-medium text-slate-600 transition hover:text-[#1E3A5F]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950">
                            Company
                        </h3>
                        <ul className="mt-5 space-y-3">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-medium text-slate-600 transition hover:text-[#1E3A5F]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="rounded-2xl bg-[#EEF4F8] p-6">
                        <h3 className="text-lg font-bold text-slate-950">
                            Get legal hiring updates
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Join the newsletter for legal category guides, platform updates, and hiring tips.
                        </p>

                        <form className="mt-5 space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1E3A5F]"
                            />
                            <Button
                                type="submit"
                                radius="lg"
                                className="h-11 w-full rounded-lg bg-[#1E3A5F] font-semibold text-white hover:bg-[#162c49]"
                            >
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        Copyright &copy; 2026 LegalEase. All rights reserved.
                    </p>
                    <p>
                        Built for secure, streamlined legal hiring.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
