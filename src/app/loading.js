import { ScalesBalanced } from "@gravity-ui/icons";

const LoadingPage = () => {
    return (
        <section className="min-h-[70vh] bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-[#1E3A5F]">
                        <ScalesBalanced className="h-8 w-8 text-[#C9A646]" />
                    </div>
                    <p className="mt-5 text-sm font-bold uppercase tracking-wide text-[#C9A646]">
                        Loading
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                        Preparing LegalEase
                    </h1>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="h-[220px] animate-pulse rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-slate-200" />
                            <div className="mt-6 h-4 w-3/4 rounded-full bg-slate-200" />
                            <div className="mt-3 h-4 w-1/2 rounded-full bg-slate-200" />
                            <div className="mt-8 h-10 rounded-lg bg-slate-200" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LoadingPage;
