"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Briefcase, Clock, MapPin, Wallet } from "@gravity-ui/icons";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

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

const LawyersContainer = () => {
    const [lawyers, setLawyers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        const loadLawyers = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/lawyers`, {
                    cache: "no-store",
                    signal: controller.signal,
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Lawyers could not be loaded.");
                }

                if (isMounted) {
                    setLawyers(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (err.name === "AbortError") return;

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
            controller.abort();
        };
    }, []);

    return (
        <section className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646] sm:text-sm">
                            All Lawyers
                        </p>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Browse verified legal experts
                        </h1>
                        <p className="mt-4 text-base leading-7 text-slate-600">
                            Explore every lawyer registered on LegalEase and choose the right expert for your legal need.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-[#1E3A5F] shadow-sm transition hover:border-[#C9A646] hover:bg-[#EEF4F8]"
                    >
                        Back Home
                    </Link>
                </div>

                {isLoading && (
                    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="h-[300px] animate-pulse rounded-[16px] border border-slate-200 bg-white"
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
                    <div className="mt-10 rounded-[16px] border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">
                        No lawyers found yet.
                    </div>
                )}

                {!isLoading && !error && lawyers.length > 0 && (
                    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {lawyers.map((lawyer) => {
                            const lawyerId = getLawyerId(lawyer);

                            return (
                                <article
                                    key={lawyerId}
                                    className="rounded-[16px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 transition hover:-translate-y-1 hover:border-[#C9A646] hover:shadow-xl hover:shadow-slate-950/10"
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
                                            <h2 className="truncate text-xl font-bold text-slate-950">
                                                {lawyer.name || "Legal Expert"}
                                            </h2>
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
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LawyersContainer;
