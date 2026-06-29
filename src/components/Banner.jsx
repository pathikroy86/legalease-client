"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Magnifier } from "@gravity-ui/icons";
import { AnimatePresence, motion } from "framer-motion";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

const getInitials = (name = "") => {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return initials || "LE";
};

const getLawyerId = (lawyer) => lawyer?._id?.$oid || lawyer?._id || lawyer?.email || "profile";

const Banner = () => {
    const [lawyers, setLawyers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadLawyers = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/lawyers/featured`, {
                    cache: "no-store",
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Lawyers could not be loaded.");
                }

                if (isMounted) {
                    setLawyers(Array.isArray(data) ? data.slice(0, 3) : []);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError(err.message || "Lawyers could not be loaded.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadLawyers();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (lawyers.length < 2) return;

        const timer = setInterval(() => {
            setActiveIndex((current) => (current + 1) % lawyers.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [lawyers.length]);

    const handlePrevious = () => {
        setActiveIndex((current) => (current === 0 ? lawyers.length - 1 : current - 1));
    };

    const handleNext = () => {
        setActiveIndex((current) => (current + 1) % lawyers.length);
    };

    const activeLawyer = lawyers[activeIndex];
    const activeLawyerId = getLawyerId(activeLawyer);

    return (
        <section className="overflow-hidden bg-[#F8FAFC]">
            <div className="bg-[#1E3A5F]">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:min-h-[430px] lg:grid-cols-[1fr_460px] lg:px-8 lg:py-0">
                    <motion.div
                        className="max-w-2xl"
                        initial="hidden"
                        animate="visible"
                        transition={{ staggerChildren: 0.12 }}
                    >
                        <motion.p
                            variants={fadeUp}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            className="text-xs font-bold uppercase tracking-wide text-[#C9A646] sm:text-sm"
                        >
                            Online lawyer hiring platform
                        </motion.p>

                        <motion.h1
                            variants={fadeUp}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="mt-7 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[56px]"
                        >
                            Find & Hire Expert Legal Counsel
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg"
                        >
                            Browse verified lawyers, send hiring requests, pay after acceptance, and manage your legal journey from one clean dashboard.
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="mt-8 max-w-[610px] rounded-[10px] bg-white p-2 shadow-xl shadow-slate-950/10"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative min-w-0 flex-1">
                                    <Magnifier className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 sm:hidden" />
                                    <input
                                        type="search"
                                        placeholder="Search by name, category, or specialization"
                                        className="h-12 w-full rounded-lg border-none bg-white pl-11 pr-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-500 sm:pl-6"
                                    />
                                </div>

                                <Link
                                    href="/lawyers"
                                    className="flex h-11 shrink-0 items-center justify-center rounded-lg bg-[#C9A646] font-bold text-white hover:bg-[#b89535] sm:w-[156px]"
                                >
                                    Browse Lawyers
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="lg:justify-self-end"
                        initial={{ opacity: 0, x: 36 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="relative mx-auto max-w-[420px]">
                            <div className="absolute -right-10 top-6 hidden h-[320px] w-[320px] rounded-3xl bg-[#C9A646]/15 lg:block" />

                            {isLoading && (
                                <div className="relative h-[388px] animate-pulse rounded-[18px] bg-white p-8 shadow-2xl shadow-slate-950/15">
                                    <div className="flex items-start gap-5">
                                        <div className="h-[72px] w-[72px] rounded-full bg-slate-200" />
                                        <div className="flex-1 pt-2">
                                            <div className="h-6 w-44 rounded bg-slate-200" />
                                            <div className="mt-4 h-4 w-36 rounded bg-slate-200" />
                                            <div className="mt-4 h-7 w-24 rounded-full bg-slate-200" />
                                        </div>
                                    </div>
                                    <div className="mt-8 h-20 rounded bg-slate-200" />
                                    <div className="mt-6 h-8 w-32 rounded bg-slate-200" />
                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <div className="h-11 rounded-lg bg-slate-200" />
                                        <div className="h-11 rounded-lg bg-slate-200" />
                                    </div>
                                </div>
                            )}

                            {!isLoading && error && (
                                <div className="relative rounded-[18px] bg-white p-8 text-sm font-semibold text-rose-600 shadow-2xl shadow-slate-950/15">
                                    {error}
                                </div>
                            )}

                            {!isLoading && !error && lawyers.length === 0 && (
                                <div className="relative rounded-[18px] bg-white p-8 text-sm font-semibold text-slate-600 shadow-2xl shadow-slate-950/15">
                                    No approved lawyers found yet.
                                </div>
                            )}

                            {!isLoading && !error && activeLawyer && (
                                <AnimatePresence mode="wait">
                                    <motion.article
                                        key={activeLawyerId}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="relative rounded-[18px] bg-white p-8 shadow-2xl shadow-slate-950/15"
                                    >
                                        <div className="flex items-start gap-5">
                                            {activeLawyer.photoUrl ? (
                                                <Image
                                                    src={activeLawyer.photoUrl}
                                                    alt={`${activeLawyer.name || "Lawyer"} profile`}
                                                    width={72}
                                                    height={72}
                                                    unoptimized
                                                    className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#1E3A5F] text-sm font-bold text-white">
                                                    {getInitials(activeLawyer.name)}
                                                </div>
                                            )}

                                            <div className="min-w-0 pt-2">
                                                <h2 className="truncate text-2xl font-bold leading-tight text-slate-950">
                                                    {activeLawyer.name || "Legal Expert"}
                                                </h2>
                                                <p className="mt-2 text-base font-medium text-slate-500">
                                                    {activeLawyer.specialization || "Legal Consultant"}
                                                </p>
                                                <span className="mt-3 inline-flex rounded-full bg-[#EEF4F8] px-4 py-1.5 text-xs font-bold text-[#1E3A5F]">
                                                    {activeLawyer.status || "Available"}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="mt-8 line-clamp-3 min-h-[84px] max-w-[320px] text-base leading-7 text-slate-500">
                                            {activeLawyer.bio || "Experienced legal professional ready to help with consultations and legal guidance."}
                                        </p>

                                        <div className="mt-5 flex items-center gap-2">
                                            <p className="text-2xl font-bold text-[#1E3A5F]">
                                                {activeLawyer.consultationFee ? `$${activeLawyer.consultationFee}` : "Fee negotiable"}
                                            </p>
                                            <p className="text-sm font-medium text-slate-500">
                                                consultation fee
                                            </p>
                                        </div>

                                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <Link
                                                href={`/lawyers/${activeLawyerId}`}
                                                className="flex h-11 items-center justify-center rounded-lg bg-[#1E3A5F] font-semibold text-white hover:bg-[#162c49]"
                                            >
                                                View Profile
                                            </Link>

                                            <Link
                                                href="/lawyers"
                                                className="flex h-11 items-center justify-center rounded-lg border border-slate-200 font-semibold text-[#1E3A5F] hover:bg-[#EEF4F8]"
                                            >
                                                View All
                                            </Link>
                                        </div>

                                        {lawyers.length > 1 && (
                                            <div className="mt-6 flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    {lawyers.map((lawyer, index) => (
                                                        <button
                                                            key={getLawyerId(lawyer)}
                                                            type="button"
                                                            onClick={() => setActiveIndex(index)}
                                                            aria-label={`Show lawyer ${index + 1}`}
                                                            className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-[#C9A646]" : "w-2.5 bg-slate-200"}`}
                                                        />
                                                    ))}
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handlePrevious}
                                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-sm font-bold text-[#1E3A5F] hover:bg-[#EEF4F8]"
                                                    >
                                                        {"<"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleNext}
                                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-sm font-bold text-[#1E3A5F] hover:bg-[#EEF4F8]"
                                                    >
                                                        {">"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.article>
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
