import Link from "next/link";
import { CircleArrowRight, House, ScalesBalanced } from "@gravity-ui/icons";

const NotFoundPage = () => {
    return (
        <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[62vh] max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] bg-[#1E3A5F] p-8 text-white shadow-2xl shadow-slate-950/10 lg:p-10">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">
                        Error 404
                    </p>
                    <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                        This legal path does not exist
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">
                        The page you are looking for may have been moved, renamed, or removed from LegalEase.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#C9A646] px-6 font-bold text-white hover:bg-[#b89535]"
                        >
                            <House className="h-5 w-5" />
                            Back to Home
                        </Link>

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

                    <div className="mt-8">
                        <p className="text-[96px] font-black leading-none tracking-tight text-slate-950 sm:text-[132px]">
                            404
                        </p>
                        <h2 className="mt-4 text-2xl font-bold text-slate-950">
                            Page not found
                        </h2>
                        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
                            Try checking the URL, returning to the homepage, or browsing verified lawyers from the main directory.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFoundPage;
