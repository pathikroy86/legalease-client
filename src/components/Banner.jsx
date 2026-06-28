"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";

const advocate = {
    name: "Sarah Rahman",
    title: "Corporate Law Specialist",
    badge: "Top Rated",
    fee: "$120",
    summary:
        "120+ consultations across startup contracts, compliance, and business disputes.",
};

const Banner = () => {
    return (
        <section className="overflow-hidden bg-[#F8FAFC]">
            <div className="bg-[#1E3A5F]">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:min-h-[430px] lg:grid-cols-[1fr_460px] lg:px-8 lg:py-0">
                    {/* Left Content */}
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646] sm:text-sm">
                            Online lawyer hiring platform
                        </p>

                        <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[56px]">
                        Find & Hire Expert Legal Counsel
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
                            Browse verified lawyers, send hiring requests, pay after acceptance, and manage your legal journey from one clean dashboard.
                        </p>

                        <div className="mt-8 max-w-[610px] rounded-[10px] bg-white p-2 shadow-xl shadow-slate-950/10">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative min-w-0 flex-1">
                                    <Magnifier className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 sm:hidden" />
                                    <input
                                        type="search"
                                        placeholder="Search by name, category, or specialization"
                                        className="h-12 w-full rounded-lg border-none bg-white pl-11 pr-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-500 sm:pl-6"
                                    />
                                </div>

                                <Button
                                    as={Link}
                                    href="/lawyers"
                                    radius="lg"
                                    className="h-11 shrink-0 rounded-lg bg-[#C9A646] px-7 font-bold text-white hover:bg-[#b89535] sm:w-[156px]"
                                >
                                    Browse Lawyers
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Advocate Demo Card */}
                    <div className="lg:justify-self-end">
                        <div className="relative mx-auto max-w-[420px]">
                            <div className="absolute -right-10 top-6 hidden h-[320px] w-[320px] rounded-3xl bg-[#C9A646]/15 lg:block" />

                            <article className="relative rounded-[18px] bg-white p-8 shadow-2xl shadow-slate-950/15">
                                <div className="flex items-start gap-5">
                                    <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#1E3A5F] text-sm font-bold text-white">
                                        SR
                                    </div>

                                    <div className="min-w-0 pt-2">
                                        <h2 className="text-2xl font-bold leading-tight text-slate-950">
                                            {advocate.name}
                                        </h2>
                                        <p className="mt-2 text-base font-medium text-slate-500">
                                            {advocate.title}
                                        </p>
                                        <span className="mt-3 inline-flex rounded-full bg-[#EEF4F8] px-4 py-1.5 text-xs font-bold text-[#1E3A5F]">
                                            {advocate.badge}
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-8 max-w-[320px] text-base leading-7 text-slate-500">
                                    {advocate.summary}
                                </p>

                                <div className="mt-5 flex items-center gap-2">
                                    <p className="text-2xl font-bold text-[#1E3A5F]">
                                        {advocate.fee}
                                    </p>
                                    <p className="text-sm font-medium text-slate-500">
                                        consultation fee
                                    </p>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Button
                                        as={Link}
                                        href="/lawyers/sarah-rahman"
                                        radius="lg"
                                        className="h-11 rounded-lg bg-[#1E3A5F] font-semibold text-white hover:bg-[#162c49]"
                                    >
                                        Hire Now
                                    </Button>

                                    <Button
                                        as={Link}
                                        href="/shortlist"
                                        variant="bordered"
                                        radius="lg"
                                        className="h-11 rounded-lg border-slate-200 font-semibold text-[#1E3A5F]"
                                    >
                                        Shortlist
                                    </Button>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
