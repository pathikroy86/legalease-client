import React from "react";
import Link from "next/link";
import {
    Books,
    Briefcase,
    CardHeart,
    CircleArrowRight,
    FileDollar,
    House,
    Shield,
} from "@gravity-ui/icons";

const categories = [
    {
        title: "Business Law",
        description: "Company formation, contracts, compliance, and startup legal support.",
        lawyers: "46 lawyers",
        href: "/categories/business-law",
        icon: Briefcase,
    },
    {
        title: "Family Law",
        description: "Divorce, child custody, marriage documents, and family dispute advice.",
        lawyers: "32 lawyers",
        href: "/categories/family-law",
        icon: CardHeart,
    },
    {
        title: "Property Law",
        description: "Land disputes, rental agreements, deeds, and ownership verification.",
        lawyers: "28 lawyers",
        href: "/categories/property-law",
        icon: House,
    },
    {
        title: "Criminal Law",
        description: "Bail, defense consultation, legal notices, and case preparation.",
        lawyers: "25 lawyers",
        href: "/categories/criminal-law",
        icon: Shield,
    },
    {
        title: "Tax & Finance",
        description: "Tax filing, financial disputes, business payments, and audit guidance.",
        lawyers: "19 lawyers",
        href: "/categories/tax-finance",
        icon: FileDollar,
    },
    {
        title: "Civil Litigation",
        description: "Civil suits, documentation, dispute resolution, and court procedures.",
        lawyers: "37 lawyers",
        href: "/categories/civil-litigation",
        icon: Books,
    },
];

const LegalCategories = () => {
    return (
        <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646] sm:text-sm">
                            Legal Categories
                        </p>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Choose the right legal expert for your case
                        </h2>
                        <p className="mt-4 text-base leading-7 text-slate-600">
                            Explore popular practice areas and connect with verified advocates who match your legal need.
                        </p>
                    </div>

                    <Link
                        href="/categories"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-[#1E3A5F] shadow-sm transition hover:border-[#C9A646] hover:bg-[#EEF4F8]"
                    >
                        View All Categories
                        <CircleArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.title}
                                href={category.href}
                                className="group rounded-[16px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 transition hover:-translate-y-1 hover:border-[#C9A646] hover:shadow-xl hover:shadow-slate-950/10"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4F8] text-[#1E3A5F] transition group-hover:bg-[#1E3A5F] group-hover:text-[#C9A646]">
                                        <Icon className="h-7 w-7" />
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                                        {category.lawyers}
                                    </span>
                                </div>

                                <h3 className="mt-6 text-xl font-bold text-slate-950">
                                    {category.title}
                                </h3>
                                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
                                    {category.description}
                                </p>

                                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#1E3A5F]">
                                    Browse lawyers
                                    <CircleArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default LegalCategories;
