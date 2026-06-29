"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const getInitials = (name = "") => {
    const initials = name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    return initials || "U";
};

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const [profile, setProfile] = useState(null);

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

    if (isPending) {
        return <div className="p-6 text-sm font-semibold text-slate-500">Loading dashboard...</div>;
    }

    if (!user) {
        return <div className="p-6 text-sm font-semibold text-slate-500">Redirecting to login...</div>;
    }

    const displayName = profile?.name || user.name || "LegalEase User";
    const profileImage = profile?.image || user.image;

    return (
        <section className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-5xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">Dashboard</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">My Profile</h1>

                <div className="mt-8 rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        {profileImage ? (
                            <Image src={profileImage} alt={displayName} width={96} height={96} unoptimized className="h-24 w-24 rounded-2xl object-cover" />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#1E3A5F] text-2xl font-bold text-white">
                                {getInitials(displayName)}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold text-slate-950">{displayName}</h2>
                            <p className="mt-1 text-sm font-semibold text-slate-500">{user.email}</p>
                            <span className="mt-3 inline-flex rounded-full bg-[#EEF4F8] px-3 py-1 text-xs font-bold capitalize text-[#1E3A5F]">
                                {user.role || "user"}
                            </span>
                        </div>
                        <Link href="/dashboard/user/update-profile" className="bg-[#1E3A5F] font-bold text-white py-3 px-5 rounded-full">
                            Update Profile
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
