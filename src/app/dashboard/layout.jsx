import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] lg:flex">
            <DashboardSidebar></DashboardSidebar>
            <main className="flex-1">{children}</main>
        </div>
    );
}
