"use client";

import { useEffect, useState } from "react";
import { Briefcase, FileText, Person } from "@gravity-ui/icons";
import toast from "react-hot-toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const cards = [
    { key: "totalUsers", label: "Total Users", icon: Person },
    { key: "totalLawyers", label: "Total Lawyers", icon: Briefcase },
    { key: "totalHires", label: "Total Hires", icon: FileText },
];

export default function AdminAnalyticsPage() {
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalLawyers: 0,
        totalHires: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/admin/analytics`, { cache: "no-store" });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Analytics could not be loaded.");
                }

                setAnalytics(data);
            } catch (err) {
                console.error(err);
                toast.error(err.message || "Analytics could not be loaded.");
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            loadAnalytics();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-6xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">Admin Dashboard</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Analytics Overview</h1>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div key={card.key} className="rounded-[16px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4F8] text-[#1E3A5F]">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <p className="mt-6 text-sm font-bold uppercase tracking-wide text-slate-500">{card.label}</p>
                                <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                                    {isLoading ? "..." : analytics[card.key] || 0}
                                </h2>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
