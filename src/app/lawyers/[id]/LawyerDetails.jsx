"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Briefcase, Calendar, MapPin, Wallet } from "@gravity-ui/icons";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const getInitials = (name = "") => {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return initials || "LE";
};

const LawyerDetails = ({ lawyerId }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;

    const [lawyer, setLawyer] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isHiring, setIsHiring] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [hasHired, setHasHired] = useState(false);
    const [isCheckingHire, setIsCheckingHire] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadLawyer = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/lawyers/${lawyerId}`, {
                    cache: "no-store",
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Lawyer details could not be loaded.");
                }

                if (isMounted) {
                    setLawyer(data?._id ? data : null);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError(err.message || "Lawyer details could not be loaded.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadLawyer();

        return () => {
            isMounted = false;
        };
    }, [lawyerId]);

    useEffect(() => {
        if (!user?.email || !lawyer?.email) {
            const timer = setTimeout(() => {
                setHasHired(false);
            }, 0);

            return () => clearTimeout(timer);
        }

        let isMounted = true;

        const loadHireStatus = async () => {
            try {
                setIsCheckingHire(true);
                const params = new URLSearchParams({
                    clientEmail: user.email,
                    lawyerEmail: lawyer.email,
                });
                const res = await fetch(`${apiUrl}/api/hires?${params.toString()}`, {
                    cache: "no-store",
                });
                const data = await res.json();

                if (isMounted) {
                    setHasHired(Array.isArray(data) && data.length > 0);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setHasHired(false);
                }
            } finally {
                if (isMounted) {
                    setIsCheckingHire(false);
                }
            }
        };

        loadHireStatus();

        return () => {
            isMounted = false;
        };
    }, [lawyer?.email, user?.email]);

    useEffect(() => {
        let isMounted = true;

        const loadComments = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/comments?lawyerId=${lawyerId}`, {
                    cache: "no-store",
                });
                const data = await res.json();

                if (isMounted) {
                    setComments(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadComments();

        return () => {
            isMounted = false;
        };
    }, [lawyerId]);

    const redirectToSignin = () => {
        router.push("/auth/signin");
    };

    const handleHireClick = () => {
        if (!user) {
            redirectToSignin();
            return;
        }

        setIsHireModalOpen(true);
    };

    const handleConfirmHire = async () => {
        if (!user || !lawyer) {
            redirectToSignin();
            return;
        }

        setIsHiring(true);

        try {
            const payload = {
                lawyerId,
                lawyerName: lawyer.name,
                lawyerEmail: lawyer.email,
                lawyerSpecialization: lawyer.specialization,
                hourlyRate: lawyer.consultationFee,
                clientId: user.id,
                clientName: user.name,
                clientEmail: user.email,
            };

            const res = await fetch(`${apiUrl}/api/hires`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (!res.ok || !result.insertedId) {
                toast.error(result.message || "Hire request could not be saved.");
                return;
            }

            toast.success("Hire request submitted successfully!");
            setHasHired(true);
            setIsHireModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Unable to submit hire request.");
        } finally {
            setIsHiring(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            redirectToSignin();
            return;
        }

        if (!commentText.trim()) {
            toast.error("Please write a comment first.");
            return;
        }

        if (!hasHired) {
            toast.error("Only users who have hired this lawyer can comment.");
            return;
        }

        setIsCommenting(true);

        try {
            const payload = {
                lawyerId,
                lawyerName: lawyer.name,
                lawyerEmail: lawyer.email,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                comment: commentText.trim(),
            };

            const res = await fetch(`${apiUrl}/api/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (!res.ok || !result.insertedId) {
                toast.error(result.message || "Comment could not be saved.");
                return;
            }

            const newComment = {
                ...payload,
                _id: result.insertedId,
                commentedDate: new Date().toISOString().split("T")[0],
            };

            setComments((current) => [newComment, ...current]);
            setCommentText("");
            toast.success("Comment posted successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Unable to post comment.");
        } finally {
            setIsCommenting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl rounded-[16px] border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-500 shadow-sm">
                    Loading lawyer details...
                </div>
            </section>
        );
    }

    if (error || !lawyer) {
        return (
            <section className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl rounded-[16px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-950">Lawyer not found</h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">{error || "This lawyer profile is not available."}</p>
                    <Button as={Link} href="/lawyers" className="mt-6 bg-[#1E3A5F] font-bold text-white">
                        Back to Lawyers
                    </Button>
                </div>
            </section>
        );
    }

    const isBusy = lawyer.status === "Busy";

    return (
        <section className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <Link href="/lawyers" className="text-sm font-bold text-[#1E3A5F]">
                    Back to all lawyers
                </Link>

                <div className="mt-6 grid grid-cols-1 gap-6 rounded-[20px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 md:grid-cols-[280px_1fr]">
                    <div>
                        {lawyer.photoUrl ? (
                            <Image
                                src={lawyer.photoUrl}
                                alt={`${lawyer.name || "Lawyer"} profile`}
                                width={320}
                                height={320}
                                unoptimized
                                className="aspect-square w-full rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-[#1E3A5F] text-4xl font-bold text-white">
                                {getInitials(lawyer.name)}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-slate-950">{lawyer.name}</h1>
                                <p className="mt-2 text-lg font-bold text-[#1E3A5F]">{lawyer.specialization}</p>
                            </div>
                            {isBusy && (
                                <span className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white">
                                    Busy
                                </span>
                            )}
                        </div>

                        <p className="mt-6 text-base leading-8 text-slate-600">{lawyer.bio}</p>

                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <Wallet className="h-5 w-5 text-[#C9A646]" />
                                <p className="mt-3 text-sm font-semibold text-slate-500">Hourly Rate</p>
                                <p className="mt-1 text-xl font-bold text-slate-950">${lawyer.consultationFee} / hour</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <MapPin className="h-5 w-5 text-[#C9A646]" />
                                <p className="mt-3 text-sm font-semibold text-slate-500">City</p>
                                <p className="mt-1 text-xl font-bold text-slate-950">{lawyer.city}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <Briefcase className="h-5 w-5 text-[#C9A646]" />
                                <p className="mt-3 text-sm font-semibold text-slate-500">Specialization</p>
                                <p className="mt-1 text-xl font-bold text-slate-950">{lawyer.specialization}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <Calendar className="h-5 w-5 text-[#C9A646]" />
                                <p className="mt-3 text-sm font-semibold text-slate-500">Registered</p>
                                <p className="mt-1 text-xl font-bold text-slate-950">{lawyer.registeredDate || "Recently"}</p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Button onPress={handleHireClick} className="h-12 bg-[#1E3A5F] font-bold text-white">
                                Hire Lawyer
                            </Button>
                            <Button onPress={() => !user && redirectToSignin()} variant="bordered" className="h-12 border-slate-200 font-bold text-[#1E3A5F]">
                                {user ? "Write Comment Below" : "Login to Comment"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                    <h2 className="text-2xl font-bold text-slate-950">Comments</h2>

                    <form onSubmit={handleCommentSubmit} className="mt-5">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={user && (!hasHired || isCheckingHire)}
                            placeholder={!user ? "Login to write a comment" : hasHired ? "Write your comment..." : "Hire this lawyer first to write a comment"}
                            rows={4}
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1E3A5F] focus:bg-white"
                        />
                        {user && !hasHired && (
                            <p className="mt-2 text-sm font-semibold text-amber-700">
                                Only users who have hired this lawyer can comment.
                            </p>
                        )}
                        <Button type="submit" isLoading={isCommenting} isDisabled={user && (!hasHired || isCheckingHire)} className="mt-3 h-11 bg-[#1E3A5F] font-bold text-white">
                            Post Comment
                        </Button>
                    </form>

                    <div className="mt-6 space-y-3">
                        {comments.length === 0 ? (
                            <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                                No comments yet.
                            </p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id?.$oid || comment._id || `${comment.userEmail}-${comment.commentedDate}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="font-bold text-slate-950">{comment.userName || "LegalEase User"}</p>
                                        <p className="text-xs font-semibold text-slate-500">{comment.commentedDate || "Today"}</p>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{comment.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {isHireModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4">
                    <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-950">Confirm Hire</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Send a hire request to <span className="font-bold text-slate-950">{lawyer.name}</span> for ${lawyer.consultationFee} per hour?
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="bordered" className="h-11 border-slate-200 font-bold text-slate-700" onPress={() => setIsHireModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button isLoading={isHiring} className="h-11 bg-[#1E3A5F] font-bold text-white" onPress={handleConfirmHire}>
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default LawyerDetails;
