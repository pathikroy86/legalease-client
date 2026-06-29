"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { CircleArrowRight, ScalesBalanced } from "@gravity-ui/icons";
import toast from "react-hot-toast";

const ErrorPage = ({ error, reset }) => {
    useEffect(() => {
        toast.error(error?.message || "Something went wrong.");
    }, [error]);

    return (
        <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[62vh] max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] bg-[#1E3A5F] p-8 text-white shadow-2xl shadow-slate-950/10 lg:p-10">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">
                        Error
                    </p>
                    <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                        Something went wrong
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">
                        LegalEase could not complete this request. Try again or return to the lawyer directory.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="button"
                            onPress={reset}
                            radius="lg"
                            className="h-12 rounded-lg bg-[#C9A646] px-6 font-bold text-white hover:bg-[#b89535]"
                        >
                            Try Again
                        </Button>

                        <Link
                            href="/lawyers"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 font-bold text-white hover:bg-white/10"
                        >
                            Browse Lawyers
                            <CircleArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF4F8] text-[#1E3A5F]">
                        <ScalesBalanced className="h-10 w-10" />
                    </div>
                    <h2 className="mt-8 text-2xl font-bold text-slate-950">
                        Request failed
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        If this happened while loading data, the API may be unreachable or returned an unexpected response.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ErrorPage;
