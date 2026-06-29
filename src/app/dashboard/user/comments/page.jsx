"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const getCommentId = (comment) => comment?._id?.$oid || comment?._id;

export default function UserCommentsPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        if (!user?.email) return;

        const loadComments = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${apiUrl}/api/comments?userEmail=${user.email}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Comments could not be loaded.");
                setComments(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                toast.error(err.message || "Comments could not be loaded.");
            } finally {
                setIsLoading(false);
            }
        };

        loadComments();
    }, [user?.email]);

    const handleEditClick = (comment) => {
        setEditingComment(comment);
        setEditText(comment.comment || "");
    };

    const handleUpdate = async () => {
        const id = getCommentId(editingComment);

        if (!editText.trim()) {
            toast.error("Comment cannot be empty.");
            return;
        }

        const res = await fetch(`${apiUrl}/api/comments/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: editText }),
        });
        const result = await res.json();

        if (!res.ok || !result.modifiedCount) {
            toast.error(result.message || "Comment could not be updated.");
            return;
        }

        setComments((current) => current.map((item) => (
            getCommentId(item) === id ? { ...item, comment: editText } : item
        )));
        toast.success("Comment updated successfully!");
        setEditingComment(null);
        setEditText("");
    };

    const handleDelete = async (comment) => {
        const id = getCommentId(comment);
        const res = await fetch(`${apiUrl}/api/comments/${id}`, { method: "DELETE" });
        const result = await res.json();

        if (!res.ok || !result.deletedCount) {
            toast.error(result.message || "Comment could not be deleted.");
            return;
        }

        toast.success("Comment deleted successfully!");
        setComments((current) => current.filter((item) => getCommentId(item) !== id));
    };

    return (
        <section className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-5xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">Comment Management</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">My Comments</h1>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {isLoading && <div className="rounded-[16px] border border-slate-200 bg-white p-6 font-semibold text-slate-500">Loading comments...</div>}
                    {!isLoading && comments.length === 0 && <div className="rounded-[16px] border border-slate-200 bg-white p-6 font-semibold text-slate-500">No comments found.</div>}
                    {comments.map((comment) => (
                        <article key={getCommentId(comment)} className="rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="font-bold text-slate-950">{comment.lawyerName}</h2>
                                    <p className="mt-1 text-xs font-semibold text-slate-500">{comment.commentedDate}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-600">{comment.comment}</p>
                            <div className="mt-5 flex gap-3">
                                <Button onPress={() => handleEditClick(comment)} className="h-10 bg-[#1E3A5F] font-bold text-white">Edit</Button>
                                <Button onPress={() => handleDelete(comment)} variant="bordered" className="h-10 border-rose-200 font-bold text-rose-600">Delete</Button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {editingComment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4">
                    <div className="w-full max-w-lg rounded-[20px] bg-white p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-950">Edit Comment</h2>
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={5} className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-900 outline-none focus:border-[#1E3A5F]" />
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <Button variant="bordered" onPress={() => setEditingComment(null)} className="h-11 border-slate-200 font-bold text-slate-700">Cancel</Button>
                            <Button onPress={handleUpdate} className="h-11 bg-[#1E3A5F] font-bold text-white">Update</Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
