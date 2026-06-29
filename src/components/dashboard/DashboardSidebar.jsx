"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { House, FileText, Person, Envelope, Briefcase, ScalesBalanced, ChartColumn } from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";

const userLinks = [
    { href: "/dashboard", label: "Profile", icon: House },
    { href: "/dashboard/user/hiring-history", label: "Hiring History", icon: FileText },
    { href: "/dashboard/user/update-profile", label: "Update Profile", icon: Person },
    { href: "/dashboard/user/comments", label: "Comments", icon: Envelope },
];

const lawyerLinks = [
    { href: "/dashboard", label: "Profile", icon: House },
    { href: "/dashboard/lawyer/hiring-history", label: "Hiring Requests", icon: FileText },
    { href: "/dashboard/lawyer/manage-legal-profile", label: "Legal Profile", icon: Briefcase },
];

const adminLinks = [
    { href: "/dashboard", label: "Profile", icon: House },
    { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: Person },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: ChartColumn },
];

const DashboardSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const navLinks = user?.role === "admin" ? adminLinks : user?.role === "lawyer" ? lawyerLinks : userLinks;

    useEffect(() => {
        if (!isPending && !user) {
            router.push("/auth/signin");
        }
    }, [isPending, router, user]);

    return (
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
            <Link href="/" className="flex items-center gap-3 rounded-2xl bg-[#1E3A5F] p-4 text-white">
                <ScalesBalanced className="h-6 w-6 text-[#C9A646]" />
                <div>
                    <p className="font-bold">LegalEase</p>
                    <p className="text-xs text-slate-200">Dashboard</p>
                </div>
            </Link>

            <nav className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1">
                {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === "/dashboard"
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${isActive
                                ? "bg-[#EEF4F8] text-[#1E3A5F]"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
