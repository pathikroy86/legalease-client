"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const allowedRoles = ["user", "lawyer"];

const CompleteSignup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [message, setMessage] = useState("Completing your signup...");

    useEffect(() => {
        const completeSignup = async () => {
            const roleFromUrl = searchParams.get("role");
            const roleFromStorage = sessionStorage.getItem("legalease_signup_role");
            const nextRole = allowedRoles.includes(roleFromUrl)
                ? roleFromUrl
                : allowedRoles.includes(roleFromStorage)
                    ? roleFromStorage
                    : "user";

            try {
                await fetch("/api/auth/update-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        role: nextRole,
                    }),
                });

                sessionStorage.removeItem("legalease_signup_role");
                setMessage("Signup completed. Redirecting...");
            } catch (error) {
                console.error(error);
                setMessage("Signup completed, but role sync needs a retry from profile settings.");
            } finally {
                router.push("/");
                router.refresh();
            }
        };

        completeSignup();
    }, [router, searchParams]);

    return (
        <section className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/5">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#EEF4F8] border-t-[#1E3A5F]" />
                <h1 className="mt-5 text-xl font-bold text-slate-950">
                    {message}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Please wait while LegalEase prepares your account.
                </p>
            </div>
        </section>
    );
};

export default CompleteSignup;
