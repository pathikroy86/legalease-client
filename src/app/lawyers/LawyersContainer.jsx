"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Clock, MapPin, Magnifier, Wallet } from "@gravity-ui/icons";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const specializations = [
    "Business Law",
    "Family Law",
    "Property Law",
    "Criminal Law",
    "Tax & Finance",
    "Civil Litigation",
];

const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "feeLow", label: "Fee: Low to High" },
    { value: "feeHigh", label: "Fee: High to Low" },
    { value: "name", label: "Name A-Z" },
];

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

const LawyerSkeleton = () => (
    <div className="h-[260px] animate-pulse rounded-[16px] border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-slate-100" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
        </div>
        <div className="mt-6 space-y-3">
            <div className="h-3 rounded bg-slate-100" />
            <div className="h-3 rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
        </div>
    </div>
);

const LawyersContainer = () => {
    const [lawyers, setLawyers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const queryString = useMemo(() => {
        const params = new URLSearchParams();

        if (searchQuery.trim()) {
            params.set("search", searchQuery.trim());
        }

        if (selectedSpecialization !== "all") {
            params.set("specialization", selectedSpecialization);
        }

        if (selectedStatus !== "all") {
            params.set("status", selectedStatus);
        }

        if (sortBy) {
            params.set("sort", sortBy);
        }

        return params.toString();
    }, [searchQuery, selectedSpecialization, selectedStatus, sortBy]);

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        const loadLawyers = async () => {
            try {
                setIsLoading(true);
                setError("");

                const path = queryString ? `/api/lawyers?${queryString}` : "/api/lawyers";
                const res = await fetch(`${apiUrl}${path}`, {
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
    }, [queryString]);

    return (
        <section className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646] sm:text-sm">
                            Public Lawyer Directory
                        </p>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Explore all available lawyers
                        </h1>
                        <p className="mt-4 text-base leading-7 text-slate-600">
                            Search, filter, and sort lawyers without logging in. Hiring and comments are available after authentication.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-[#1E3A5F] shadow-sm transition hover:border-[#C9A646] hover:bg-[#EEF4F8]"
                    >
                        Back Home
                    </Link>
                </div>

                <div className="mt-8 rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                        <div className="md:col-span-5">
                            <label className="mb-2 block text-sm font-bold text-slate-700">Search Lawyers</label>
                            <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                <Magnifier className="h-4 w-4 text-slate-400" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Name, city, or specialization"
                                    className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <label className="mb-2 block text-sm font-bold text-slate-700">Specialization</label>
                            <select
                                value={selectedSpecialization}
                                onChange={(e) => setSelectedSpecialization(e.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#1E3A5F] focus:bg-white"
                            >
                                <option value="all">All Specializations</option>
                                {specializations.map((specialization) => (
                                    <option key={specialization} value={specialization}>{specialization}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#1E3A5F] focus:bg-white"
                            >
                                <option value="all">All</option>
                                <option value="Available">Available</option>
                                <option value="Busy">Busy</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-bold text-slate-700">Sort</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#1E3A5F] focus:bg-white"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-sm font-semibold text-slate-500">
                    {isLoading ? "Loading lawyers..." : `Showing ${lawyers.length} lawyer${lawyers.length === 1 ? "" : "s"}`}
                </div>

                {isLoading && (
                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(8)].map((_, index) => (
                            <LawyerSkeleton key={index} />
                        ))}
                    </div>
                )}

                {!isLoading && error && (
                    <div className="mt-6 rounded-[16px] border border-rose-100 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
                        {error}
                    </div>
                )}

                {!isLoading && !error && lawyers.length === 0 && (
                    <div className="mt-6 rounded-[16px] border border-slate-200 bg-white p-8 text-center">
                        <h2 className="text-xl font-bold text-slate-950">No lawyers match your filters.</h2>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Try a different search term, specialization, status, or sort option.
                        </p>
                    </div>
                )}

                {!isLoading && !error && lawyers.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {lawyers.map((lawyer) => {
                            const lawyerId = getLawyerId(lawyer);
                            const isBusy = lawyer.status === "Busy";

                            return (
                                <Link
                                    key={lawyerId}
                                    href={`/lawyers/${lawyerId}`}
                                    className="group rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 transition hover:-translate-y-1 hover:border-[#C9A646] hover:shadow-xl hover:shadow-slate-950/10"
                                >
                                    <div className="relative">
                                        {lawyer.photoUrl ? (
                                            <Image
                                                src={lawyer.photoUrl}
                                                alt={`${lawyer.name || "Lawyer"} profile`}
                                                width={320}
                                                height={240}
                                                unoptimized
                                                className="aspect-[4/3] w-full rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-[#1E3A5F] text-2xl font-bold text-white">
                                                {getInitials(lawyer.name)}
                                            </div>
                                        )}

                                        {isBusy && (
                                            <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-rose-950/20">
                                                Busy
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="mt-4 truncate text-base font-bold text-slate-950 sm:text-lg">
                                        {lawyer.name || "Legal Expert"}
                                    </h2>
                                    <p className="mt-1 min-h-10 text-sm font-semibold leading-5 text-[#1E3A5F]">
                                        {lawyer.specialization || "Legal Consultant"}
                                    </p>

                                    <div className="mt-4 space-y-2 text-xs font-semibold text-slate-600 sm:text-sm">
                                        <div className="flex items-center gap-2">
                                            <Wallet className="h-4 w-4 shrink-0 text-[#C9A646]" />
                                            {lawyer.consultationFee ? `$${lawyer.consultationFee} / hour` : "Rate negotiable"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {lawyer.city ? <MapPin className="h-4 w-4 shrink-0 text-[#C9A646]" /> : <Clock className="h-4 w-4 shrink-0 text-[#C9A646]" />}
                                            <span className="truncate">{lawyer.city || "Online"}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LawyersContainer;
