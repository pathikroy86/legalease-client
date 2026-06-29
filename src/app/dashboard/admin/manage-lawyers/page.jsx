"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";
const getLawyerId = (lawyer) => lawyer?._id?.$oid || lawyer?._id || lawyer?.email;
const getLawyerImage = (lawyer) => lawyer?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer?.name || "Lawyer")}&background=1E3A5F&color=fff`;

export default function ManageLawyersPage() {
    const [lawyers, setLawyers] = useState([]);
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState("");

    const loadLawyers = useCallback(async () => {
        try {
            setIsLoading(true);
            const query = new URLSearchParams({ approvalStatus });
            const res = await fetch(`${apiUrl}/api/admin/lawyers?${query.toString()}`, { cache: "no-store" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Lawyers could not be loaded.");
            }

            setLawyers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Lawyers could not be loaded.");
        } finally {
            setIsLoading(false);
        }
    }, [approvalStatus]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadLawyers();
        }, 0);

        return () => clearTimeout(timer);
    }, [loadLawyers]);

    const handleApproval = async (lawyer, status) => {
        const id = getLawyerId(lawyer);
        setUpdatingId(id);

        try {
            const res = await fetch(`${apiUrl}/api/admin/lawyers/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ approvalStatus: status }),
            });
            const result = await res.json();

            if (!res.ok || !result.matchedCount) {
                toast.error(result.message || "Lawyer approval could not be updated.");
                return;
            }

            const updatedLawyer = { ...lawyer, approvalStatus: status };
            setLawyers((current) => current.map((item) => getLawyerId(item) === id ? updatedLawyer : item));
            setSelectedLawyer((current) => current && getLawyerId(current) === id ? updatedLawyer : current);
            toast.success(status === "approved" ? "Lawyer approved successfully!" : "Lawyer rejected successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Lawyer approval could not be updated.");
        } finally {
            setUpdatingId("");
        }
    };

    return (
        <section className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">Admin Dashboard</p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Manage Lawyers</h1>
                    </div>

                    <select
                        value={approvalStatus}
                        onChange={(e) => setApprovalStatus(e.target.value)}
                        className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#1E3A5F]"
                    >
                        <option value="all">All Lawyers</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {selectedLawyer && (
                    <div className="mt-8 rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                            <Image
                                src={getLawyerImage(selectedLawyer)}
                                alt={selectedLawyer.name || "Lawyer"}
                                width={128}
                                height={128}
                                unoptimized
                                className="h-32 w-32 rounded-2xl object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-950">{selectedLawyer.name || "Lawyer Profile"}</h2>
                                        <p className="mt-1 font-semibold text-slate-600">{selectedLawyer.email}</p>
                                        <p className="mt-1 text-sm font-bold text-[#1E3A5F]">{selectedLawyer.specialization}</p>
                                    </div>
                                    <span className="w-fit rounded-full bg-[#EEF4F8] px-3 py-1 text-xs font-bold capitalize text-[#1E3A5F]">
                                        {selectedLawyer.approvalStatus || "pending"}
                                    </span>
                                </div>
                                <p className="mt-4 text-sm leading-7 text-slate-600">{selectedLawyer.bio}</p>
                                <div className="mt-4 grid grid-cols-1 gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
                                    <p>Fee: ${selectedLawyer.consultationFee || 0}</p>
                                    <p>City: {selectedLawyer.city || "Online"}</p>
                                    <p>Status: {selectedLawyer.status || "Available"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[920px] text-left">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Lawyer</th>
                                    <th className="px-5 py-4">Specialization</th>
                                    <th className="px-5 py-4">Fee</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Registered</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {isLoading && (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-6 font-semibold text-slate-500">Loading lawyers...</td>
                                    </tr>
                                )}

                                {!isLoading && lawyers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-6 font-semibold text-slate-500">No lawyers found.</td>
                                    </tr>
                                )}

                                {!isLoading && lawyers.map((lawyer) => {
                                    const id = getLawyerId(lawyer);

                                    return (
                                        <tr key={id} className="text-slate-700">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={getLawyerImage(lawyer)}
                                                        alt={lawyer.name || "Lawyer"}
                                                        width={48}
                                                        height={48}
                                                        unoptimized
                                                        className="h-12 w-12 rounded-xl object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-slate-950">{lawyer.name || "Lawyer"}</p>
                                                        <p className="text-xs font-semibold text-slate-500">{lawyer.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-semibold">{lawyer.specialization || "Legal Service"}</td>
                                            <td className="px-5 py-4 font-semibold">${lawyer.consultationFee || 0}</td>
                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-[#EEF4F8] px-3 py-1 text-xs font-bold capitalize text-[#1E3A5F]">
                                                    {lawyer.approvalStatus || "pending"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-semibold">{lawyer.registeredDate || "N/A"}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <Button type="button" onPress={() => setSelectedLawyer(lawyer)} className="h-10 rounded-lg bg-slate-100 px-4 font-bold text-slate-700">
                                                        View
                                                    </Button>
                                                    <Button type="button" onPress={() => handleApproval(lawyer, "approved")} isLoading={updatingId === id} className="h-10 rounded-lg bg-emerald-600 px-4 font-bold text-white">
                                                        Approve
                                                    </Button>
                                                    <Button type="button" onPress={() => handleApproval(lawyer, "rejected")} isLoading={updatingId === id} variant="bordered" className="h-10 rounded-lg border-rose-200 px-4 font-bold text-rose-600">
                                                        Reject
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
