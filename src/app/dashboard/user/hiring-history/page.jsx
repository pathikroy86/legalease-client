"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

export default function HiringHistoryPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [hires, setHires] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.email) return;

        const loadHires = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/hires?clientEmail=${user.email}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Hiring history could not be loaded.");
                setHires(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError(err.message || "Hiring history could not be loaded.");
            } finally {
                setIsLoading(false);
            }
        };

        loadHires();
    }, [user?.email]);

    return (
        <section className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-6xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">User Dashboard</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Hiring History</h1>

                <div className="mt-8 overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Lawyer</th>
                                    <th className="px-5 py-4">Specialisation</th>
                                    <th className="px-5 py-4">Fee</th>
                                    <th className="px-5 py-4">Hiring Date</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && <tr><td colSpan="6" className="px-5 py-6 font-semibold text-slate-500">Loading...</td></tr>}
                                {!isLoading && error && <tr><td colSpan="6" className="px-5 py-6 font-semibold text-rose-600">{error}</td></tr>}
                                {!isLoading && !error && hires.length === 0 && <tr><td colSpan="6" className="px-5 py-6 font-semibold text-slate-500">No hiring history found.</td></tr>}
                                {hires.map((hire) => (
                                    <tr key={hire._id?.$oid || hire._id} className="text-slate-700">
                                        <td className="px-5 py-4 font-bold text-slate-950">{hire.lawyerName}</td>
                                        <td className="px-5 py-4">{hire.lawyerSpecialization}</td>
                                        <td className="px-5 py-4">${hire.hourlyRate}</td>
                                        <td className="px-5 py-4">{hire.hiredDate}</td>
                                        <td className="px-5 py-4"><span className="rounded-full bg-[#EEF4F8] px-3 py-1 text-xs font-bold capitalize text-[#1E3A5F]">{hire.status || "pending"}</span></td>
                                        <td className="px-5 py-4">{hire.status === "accepted" ? <button className="font-bold text-[#1E3A5F]">Pay</button> : <span className="text-slate-400">-</span>}</td>
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
