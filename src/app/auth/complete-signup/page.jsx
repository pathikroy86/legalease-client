import { Suspense } from "react";
import CompleteSignup from "./CompleteSignup";

const CompleteSignupPage = () => {
    return (
        <Suspense
            fallback={
                <section className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/5">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#EEF4F8] border-t-[#1E3A5F]" />
                        <h1 className="mt-5 text-xl font-bold text-slate-950">
                            Completing your signup...
                        </h1>
                    </div>
                </section>
            }
        >
            <CompleteSignup />
        </Suspense>
    );
};

export default CompleteSignupPage;
