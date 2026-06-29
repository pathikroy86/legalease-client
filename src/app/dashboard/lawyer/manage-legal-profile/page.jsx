"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Card, Input, InputGroup, Label, TextField } from "@heroui/react";
import { Briefcase, Camera, FileText, Person, Wallet } from "@gravity-ui/icons";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/uploadImageToImgBB";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";
const specializations = ["Business Law", "Family Law", "Property Law", "Criminal Law", "Tax & Finance", "Civil Litigation"];
const getLawyerId = (lawyer) => lawyer?._id?.$oid || lawyer?._id || lawyer?.email;

export default function ManageLegalProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [lawyer, setLawyer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        consultationFee: "",
        specialization: "Business Law",
        photoUrl: "",
        status: "Available",
        city: "",
    });

    useEffect(() => {
        if (!user?.email) return;

        const loadProfile = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${apiUrl}/api/lawyers/${user.email}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Legal profile could not be loaded.");
                setLawyer(data?._id ? data : null);
                setFormData({
                    name: data?.name || user.name || "",
                    bio: data?.bio || "",
                    consultationFee: data?.consultationFee || "",
                    specialization: data?.specialization || "Business Law",
                    photoUrl: data?.photoUrl || user.image || "",
                    status: data?.status || "Available",
                    city: data?.city || "",
                });
            } catch (err) {
                console.error(err);
                toast.error(err.message || "Legal profile could not be loaded.");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [user?.email, user?.image, user?.name]);

    const handleChange = (field, value) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const handleImageUpload = async (e) => {
        const imageFile = e.target.files?.[0];
        if (!imageFile) return;

        setIsUploading(true);

        try {
            const imageUrl = await uploadImageToImgBB(imageFile);
            handleChange("photoUrl", imageUrl);
            toast.success("Image uploaded successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Image upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!lawyer && !user?.email) return;
        if (!formData.name || !formData.bio || !formData.consultationFee || !formData.specialization || !formData.photoUrl) {
            toast.error("Please fill in name, bio, fee, specialization, and image URL.");
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                email: user.email,
                status: formData.status || "Available",
                city: formData.city || "Online",
            };

            const res = lawyer
                ? await fetch(`${apiUrl}/api/lawyers/${getLawyerId(lawyer)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
                : await fetch(`${apiUrl}/api/lawyers`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Legal profile could not be updated.");
                return;
            }

            if (lawyer && !result.modifiedCount && !result.matchedCount) {
                toast.error(result.message || "Legal profile could not be updated.");
                return;
            }

            if (!lawyer && !result.insertedId) {
                toast.error(result.message || "Legal profile could not be created.");
                return;
            }

            if (!lawyer) {
                setLawyer({
                    _id: result.insertedId,
                    ...payload,
                });
            }

            toast.success(lawyer ? "Legal profile updated successfully!" : "Legal profile created successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Legal profile could not be updated.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!lawyer) return;

        const id = getLawyerId(lawyer);
        const res = await fetch(`${apiUrl}/api/lawyers/${id}`, { method: "DELETE" });
        const result = await res.json();

        if (!res.ok || !result.deletedCount) {
            toast.error(result.message || "Legal profile could not be deleted.");
            return;
        }

        toast.success("Legal profile deleted successfully!");
        setLawyer(null);
    };

    return (
        <section className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-4xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">Profile Management</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Manage Legal Profile</h1>

                {isLoading ? (
                    <div className="mt-8 rounded-[16px] border border-slate-200 bg-white p-6 font-semibold text-slate-500">Loading profile...</div>
                ) : (
                    <Card className="mt-8 border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                        {!lawyer && (
                            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                                No legal service profile found. Please complete the lawyer information form first.
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <TextField isRequired className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Name</Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <Person className="h-4 w-4 text-slate-400" />
                                    <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none" />
                                </InputGroup>
                            </TextField>

                            <TextField isRequired className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Consultation Fee</Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <Wallet className="h-4 w-4 text-slate-400" />
                                    <Input type="number" value={formData.consultationFee} onChange={(e) => handleChange("consultationFee", e.target.value)} className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none" />
                                </InputGroup>
                            </TextField>

                            <div className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Specialization</Label>
                                <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                    <select value={formData.specialization} onChange={(e) => handleChange("specialization", e.target.value)} className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none">
                                        {specializations.map((specialization) => <option key={specialization} value={specialization}>{specialization}</option>)}
                                    </select>
                                </div>
                            </div>

                            <TextField isRequired className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Profile Image</Label>
                                {formData.photoUrl && (
                                    <Image
                                        src={formData.photoUrl}
                                        alt={formData.name || "Lawyer profile"}
                                        width={96}
                                        height={96}
                                        unoptimized
                                        className="h-24 w-24 rounded-2xl object-cover"
                                    />
                                )}
                                <InputGroup className="flex min-h-12 flex-col items-start justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <Camera className="h-4 w-4 text-slate-400" />
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm font-medium text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1E3A5F] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                                    {isUploading && <span className="text-xs font-semibold text-[#1E3A5F]">Uploading...</span>}
                                </InputGroup>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <Camera className="h-4 w-4 text-slate-400" />
                                    <Input value={formData.photoUrl} onChange={(e) => handleChange("photoUrl", e.target.value)} placeholder="Or paste image URL" className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                                </InputGroup>
                                {formData.photoUrl && <p className="truncate text-xs font-medium text-slate-500">{formData.photoUrl}</p>}
                            </TextField>

                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <Label className="text-sm font-semibold text-slate-700">Bio</Label>
                                <div className="flex min-h-32 gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <FileText className="mt-1 h-4 w-4 text-slate-400" />
                                    <textarea value={formData.bio} onChange={(e) => handleChange("bio", e.target.value)} rows={5} className="w-full resize-none border-none bg-transparent text-sm font-medium text-slate-900 outline-none" />
                                </div>
                            </div>

                            <div className="flex gap-3 sm:col-span-2">
                                <Button type="submit" isLoading={isSaving} isDisabled={isUploading} className="h-11 bg-[#1E3A5F] font-bold text-white">Update Service</Button>
                                <Button type="button" onPress={handleDelete} isDisabled={!lawyer} variant="bordered" className="h-11 border-rose-200 font-bold text-rose-600">Delete Service</Button>
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </section>
    );
}
