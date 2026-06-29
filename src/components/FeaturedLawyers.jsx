"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Briefcase, CircleArrowRight, Clock, MapPin, Wallet } from "@gravity-ui/icons";
import { motion } from "framer-motion";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
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

const FeaturedLawyers = () => {
    const [lawyers, setLawyers] = useState([]);
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
                    throw new Error(data.message || "Featured lawyers could not be loaded.");
                }

                if (isMounted) {
                    setLawyers(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError(err.message || "Featured lawyers could not be loaded.");
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

    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646] sm:text-sm">
                            Featured Lawyers
                        </p>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Meet legal experts available for consultation
                        </h2>
                        <p className="mt-4 text-base leading-7 text-slate-600">
                            A fresh set of lawyers is selected from the database each time the page reloads.
                        </p>
                    </div>

                    <Link
                        href="/lawyers"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-[#1E3A5F] shadow-sm transition hover:border-[#C9A646] hover:bg-[#EEF4F8]"
                    >
                        View All Lawyers
                        <CircleArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {isLoading && (
                    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="h-[300px] animate-pulse rounded-[16px] border border-slate-200 bg-slate-50"
                            />
                        ))}
                    </div>
                )}

                {!isLoading && error && (
                    <div className="mt-10 rounded-[16px] border border-rose-100 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
                        {error}
                    </div>
                )}

                {!isLoading && !error && lawyers.length === 0 && (
                    <div className="mt-10 rounded-[16px] border border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
                        No featured lawyers found yet.
                    </div>
                )}

                {!isLoading && !error && lawyers.length > 0 && (
                    <motion.div
                        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.18 }}
                    >
                        {lawyers.map((lawyer) => {
                            const lawyerId = getLawyerId(lawyer);

                            return (
                                <motion.article
                                    key={lawyerId}
                                    variants={cardVariants}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="rounded-[16px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 transition hover:border-[#C9A646] hover:shadow-xl hover:shadow-slate-950/10"
                                >
                                    <div className="flex items-start gap-4">
                                        {lawyer.photoUrl ? (
                                            <Image
                                                src={lawyer.photoUrl}
                                                alt={`${lawyer.name || "Lawyer"} profile`}
                                                width={64}
                                                height={64}
                                                unoptimized
                                                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1E3A5F] text-sm font-bold text-white">
                                                {getInitials(lawyer.name)}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <h3 className="truncate text-xl font-bold text-slate-950">
                                                {lawyer.name || "Legal Expert"}
                                            </h3>
                                            <p className="mt-1 text-sm font-semibold text-[#1E3A5F]">
                                                {lawyer.specialization || "Legal Consultant"}
                                            </p>
                                            <span className="mt-3 inline-flex rounded-full bg-[#EEF4F8] px-3 py-1 text-xs font-bold text-[#1E3A5F]">
                                                {lawyer.status || "Available"}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="mt-5 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">
                                        {lawyer.bio || "Experienced legal professional ready to help with consultations and legal guidance."}
                                    </p>

                                    <div className="mt-5 grid grid-cols-1 gap-3 text-sm font-semibold text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-[#C9A646]" />
                                            {lawyer.specialization || "General Practice"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Wallet className="h-4 w-4 text-[#C9A646]" />
                                            {lawyer.consultationFee ? `$${lawyer.consultationFee}` : "Fee negotiable"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {lawyer.city ? <MapPin className="h-4 w-4 text-[#C9A646]" /> : <Clock className="h-4 w-4 text-[#C9A646]" />}
                                            {lawyer.city || "Online consultation"}
                                        </div>
                                    </div>

                                    <Button
                                        as={Link}
                                        href={`/lawyers/${lawyerId}`}
                                        radius="lg"
                                        className="mt-6 h-11 w-full rounded-lg bg-[#1E3A5F] font-semibold text-white hover:bg-[#162c49]"
                                    >
                                        View Profile
                                    </Button>
                                </motion.article>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default FeaturedLawyers;





