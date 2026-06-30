import Link from "next/link";
import { Check, CircleArrowRight, Shield, Wallet } from "@gravity-ui/icons";

const plans = [
    {
        name: "Starter",
        price: "$19",
        note: "For quick legal questions",
        description: "Book one consultation and get matched with an available legal expert.",
        features: [
            "1 lawyer consultation",
            "Basic hiring request",
            "Dashboard hiring history",
            "Comment after hiring",
        ],
        href: "/lawyers",
    },
    {
        name: "Professional",
        price: "$49",
        note: "Most popular",
        description: "Best for active clients who need repeated legal help across categories.",
        features: [
            "3 lawyer consultations",
            "Priority hiring requests",
            "Case notes in dashboard",
            "Email support",
        ],
        href: "/lawyers",
        highlighted: true,
    },
    {
        name: "Business",
        price: "$99",
        note: "For teams and founders",
        description: "Get ongoing legal support for contracts, compliance, and disputes.",
        features: [
            "6 lawyer consultations",
            "Business law matching",
            "Priority response",
            "Monthly legal review",
        ],
        href: "/lawyers?specialization=Business+Law",
    },
];

export default function PricingPage() {
    return (
        <section className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[1fr_360px] lg:items-end">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646] sm:text-sm">
                            Pricing
                        </p>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Choose a simple legal consultation plan
                        </h1>
                        <p className="mt-4 text-base leading-7 text-slate-600">
                            Select a plan, browse approved lawyers, and send your hiring request from the lawyer profile page.
                        </p>
                    </div>

                    <div className="rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF4F8] text-[#1E3A5F]">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-950">Secure checkout flow</h2>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    Pay after a lawyer accepts your request.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-[16px] border bg-white p-6 shadow-sm shadow-slate-950/5 ${plan.highlighted
                                ? "border-[#C9A646] ring-2 ring-[#C9A646]/20"
                                : "border-slate-200"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-[#C9A646]">{plan.note}</p>
                                    <h2 className="mt-3 text-2xl font-bold text-slate-950">{plan.name}</h2>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4F8] text-[#1E3A5F]">
                                    <Wallet className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="mt-6 flex items-end gap-2">
                                <p className="text-4xl font-bold text-slate-950">{plan.price}</p>
                                <p className="pb-1 text-sm font-semibold text-slate-500">/ plan</p>
                            </div>

                            <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-600">
                                {plan.description}
                            </p>

                            <ul className="mt-6 space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF4F8] text-[#1E3A5F]">
                                            <Check className="h-4 w-4" />
                                        </span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold transition ${plan.highlighted
                                    ? "bg-[#1E3A5F] text-white hover:bg-[#162c49]"
                                    : "border border-slate-200 bg-white text-[#1E3A5F] hover:border-[#C9A646] hover:bg-[#EEF4F8]"
                                    }`}
                            >
                                Checkout
                                <CircleArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
