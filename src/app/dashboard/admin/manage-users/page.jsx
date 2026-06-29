"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const getUserId = (user) => user?._id?.$oid || user?._id || user?.id || user?.email;

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState("");
    const [deletingId, setDeletingId] = useState("");

    const loadUsers = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/admin/users`, { cache: "no-store" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Users could not be loaded.");
            }

            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Users could not be loaded.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadUsers();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const handleRoleChange = async (user, role) => {
        const id = getUserId(user);
        setUpdatingId(id);

        try {
            const res = await fetch(`${apiUrl}/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, email: user.email }),
            });
            const result = await res.json();

            if (!res.ok || !result.matchedCount) {
                toast.error(result.message || "User role could not be changed.");
                return;
            }

            setUsers((current) => current.map((item) => getUserId(item) === id ? { ...item, role } : item));
            toast.success("User role updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("User role could not be changed.");
        } finally {
            setUpdatingId("");
        }
    };

    const handleDeleteUser = async (user) => {
        const id = getUserId(user);
        const agreed = window.confirm(`Delete ${user.email}?`);
        if (!agreed) return;

        setDeletingId(id);

        try {
            const query = new URLSearchParams({ email: user.email || "" });
            const res = await fetch(`${apiUrl}/api/admin/users/${id}?${query.toString()}`, {
                method: "DELETE",
            });
            const result = await res.json();

            if (!res.ok || !result.deletedCount) {
                toast.error(result.message || "User could not be deleted.");
                return;
            }

            setUsers((current) => current.filter((item) => getUserId(item) !== id));
            toast.success("User deleted successfully!");
        } catch (err) {
            console.error(err);
            toast.error("User could not be deleted.");
        } finally {
            setDeletingId("");
        }
    };

    return (
        <section className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-6xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">Admin Dashboard</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Manage Users</h1>

                <div className="mt-8 overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Name</th>
                                    <th className="px-5 py-4">Email</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="px-5 py-4">Change Role</th>
                                    <th className="px-5 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {isLoading && (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-6 font-semibold text-slate-500">Loading users...</td>
                                    </tr>
                                )}

                                {!isLoading && users.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-6 font-semibold text-slate-500">No users found.</td>
                                    </tr>
                                )}

                                {!isLoading && users.map((user) => {
                                    const id = getUserId(user);

                                    return (
                                        <tr key={id} className="text-slate-700">
                                            <td className="px-5 py-4 font-bold text-slate-950">{user.name || "LegalEase User"}</td>
                                            <td className="px-5 py-4 font-semibold">{user.email}</td>
                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-[#EEF4F8] px-3 py-1 text-xs font-bold capitalize text-[#1E3A5F]">
                                                    {user.role || "user"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <select
                                                    value={user.role || "user"}
                                                    onChange={(e) => handleRoleChange(user, e.target.value)}
                                                    disabled={updatingId === id}
                                                    className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#1E3A5F]"
                                                >
                                                    <option value="user">user</option>
                                                    <option value="lawyer">lawyer</option>
                                                    <option value="admin">admin</option>
                                                </select>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Button
                                                    type="button"
                                                    onPress={() => handleDeleteUser(user)}
                                                    isLoading={deletingId === id}
                                                    className="h-10 rounded-lg bg-rose-600 px-4 font-bold text-white hover:bg-rose-700"
                                                >
                                                    Delete
                                                </Button>
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
