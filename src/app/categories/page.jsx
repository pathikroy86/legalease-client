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
        href: "/lawyers?specialization=Business+Law",
        icon: Briefcase,
    },
    {
        title: "Family Law",
        description: "Divorce, child custody, marriage documents, and family dispute advice.",
        lawyers: "32 lawyers",
        href: "/lawyers?specialization=Family+Law",
        icon: CardHeart,
    },
    {
        title: "Property Law",
        description: "Land disputes, rental agreements, deeds, and ownership verification.",
        lawyers: "28 lawyers",
        href: "/lawyers?specialization=Property+Law",
        icon: House,
    },
    {
        title: "Criminal Law",
        description: "Bail, defense consultation, legal notices, and case preparation.",
        lawyers: "25 lawyers",
        href: "/lawyers?specialization=Criminal+Law",
        icon: Shield,
    },
    {
        title: "Tax & Finance",
        description: "Tax filing, financial disputes, business payments, and audit guidance.",
        lawyers: "19 lawyers",
        href: "/lawyers?specialization=Tax+%26+Finance",
        icon: FileDollar,
    },
    {
        title: "Civil Litigation",
        description: "Civil suits, documentation, dispute resolution, and court procedures.",
        lawyers: "37 lawyers",
        href: "/lawyers?specialization=Civil+Litigation",
        icon: Books,
    },
];

export default function CategoriesPage() {
    return (
        <section className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646] sm:text-sm">
                            Legal Categories
                        </p>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Explore all legal categories
                        </h1>
                        <p className="mt-4 text-base leading-7 text-slate-600">
                            Choose a practice area and browse approved lawyers who can help with that type of legal work.
                        </p>
                    </div>

                    <Link
                        href="/lawyers"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-[#1E3A5F] shadow-sm transition hover:border-[#C9A646] hover:bg-[#EEF4F8]"
                    >
                        Browse All Lawyers
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

                                <h2 className="mt-6 text-xl font-bold text-slate-950">
                                    {category.title}
                                </h2>
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
}
