"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";
const getHireId = (hire) => hire?._id?.$oid || hire?._id;

export default function LawyerHiringHistoryPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [hires, setHires] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const loadHires = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${apiUrl}/api/hires?lawyerEmail=${user.email}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Hiring requests could not be loaded.");
                setHires(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                toast.error(err.message || "Hiring requests could not be loaded.");
            } finally {
                setIsLoading(false);
            }
        };

        loadHires();
    }, [user?.email]);

    const handleStatusUpdate = async (hire, status) => {
        const id = getHireId(hire);
        const res = await fetch(`${apiUrl}/api/hires/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        const result = await res.json();

        if (!res.ok || !result.modifiedCount) {
            toast.error(result.message || "Hiring request could not be updated.");
            return;
        }

        setHires((current) => current.map((item) => getHireId(item) === id ? { ...item, status } : item));
        toast.success(`Hiring request ${status}.`);
    };

    return (
        <section className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-6xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">Lawyer Dashboard</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Hiring Requests</h1>

                <div className="mt-8 overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Client Name</th>
                                    <th className="px-5 py-4">Request Date</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && <tr><td colSpan="4" className="px-5 py-6 font-semibold text-slate-500">Loading...</td></tr>}
                                {!isLoading && hires.length === 0 && <tr><td colSpan="4" className="px-5 py-6 font-semibold text-slate-500">No hiring requests found.</td></tr>}
                                {hires.map((hire) => (
                                    <tr key={getHireId(hire)} className="text-slate-700">
                                        <td className="px-5 py-4 font-bold text-slate-950">{hire.clientName || hire.clientEmail}</td>
                                        <td className="px-5 py-4">{hire.hiredDate}</td>
                                        <td className="px-5 py-4"><span className="rounded-full bg-[#EEF4F8] px-3 py-1 text-xs font-bold capitalize text-[#1E3A5F]">{hire.status || "pending"}</span></td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <Button onPress={() => handleStatusUpdate(hire, "accepted")} className="h-9 bg-emerald-600 px-4 text-xs font-bold text-white">Accept</Button>
                                                <Button onPress={() => handleStatusUpdate(hire, "rejected")} className="h-9 bg-rose-600 px-4 text-xs font-bold text-white">Reject</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
