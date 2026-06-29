"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Button,
    Card,
    Input,
    InputGroup,
    Label,
    TextField,
} from "@heroui/react";
import { At, Briefcase, Camera, FileText, House, Person, Wallet } from "@gravity-ui/icons";
import toast from "react-hot-toast";
import { uploadImageToImgBB } from "@/lib/uploadImageToImgBB";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const specializations = [
    "Business Law",
    "Family Law",
    "Property Law",
    "Criminal Law",
    "Tax & Finance",
    "Civil Litigation",
];

const LawyerInfoForm = ({ initialName = "", initialEmail = "" }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: initialName,
        email: initialEmail,
        photoUrl: "",
        specialization: "Business Law",
        bio: "",
        consultationFee: "",
        status: "Available",
        city: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (field, value) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "name",
            "email",
            "photoUrl",
            "specialization",
            "bio",
            "consultationFee",
            "status",
            "city",
        ];

        const missingField = requiredFields.find((field) => !String(formData[field]).trim());

        if (missingField) {
            toast.error("Please fill in all lawyer information fields.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${apiUrl}/api/lawyers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok || !result.insertedId) {
                toast.error(result.message || "Lawyer information could not be saved.");
                return;
            }

            toast.success("Lawyer information submitted for admin approval!");
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Unable to connect to the backend server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] bg-[#1E3A5F] p-8 text-white shadow-2xl shadow-slate-950/10 lg:p-10">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">Lawyer Profile</p>
                    <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                        Complete your lawyer information
                    </h1>
                    <p className="mt-5 text-base leading-8 text-slate-200">
                        Add your professional details so clients can discover your services on LegalEase.
                    </p>
                </div>

                <Card className="border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-950">Lawyer Information</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            This information will be saved in the lawyers collection.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <TextField isRequired name="name" className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Name</Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <Person className="h-4 w-4 text-slate-400" />
                                    <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Your full name" className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                                </InputGroup>
                            </TextField>

                            <TextField isRequired name="email" type="email" className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Email</Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <At className="h-4 w-4 text-slate-400" />
                                    <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@example.com" className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                                </InputGroup>
                            </TextField>

                            <TextField isRequired name="photoUrl" className="flex flex-col gap-1.5 sm:col-span-2">
                                <Label className="text-sm font-semibold text-slate-700">Profile Photo</Label>
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
                                <InputGroup className="flex min-h-12 flex-col items-start justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-[#1E3A5F] focus-within:bg-white sm:flex-row sm:items-center">
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

                            <div className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Specialization</Label>
                                <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                    <select value={formData.specialization} onChange={(e) => handleChange("specialization", e.target.value)} className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none">
                                        {specializations.map((specialization) => (
                                            <option key={specialization} value={specialization}>{specialization}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <TextField isRequired name="consultationFee" className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Consultation Fee</Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <Wallet className="h-4 w-4 text-slate-400" />
                                    <Input type="number" min="0" value={formData.consultationFee} onChange={(e) => handleChange("consultationFee", e.target.value)} placeholder="Example: 120" className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                                </InputGroup>
                            </TextField>

                            <div className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Status</Label>
                                <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none focus:border-[#1E3A5F] focus:bg-white">
                                    <option value="Available">Available</option>
                                    <option value="Busy">Busy</option>
                                </select>
                            </div>

                            <TextField isRequired name="city" className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">City</Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <House className="h-4 w-4 text-slate-400" />
                                    <Input value={formData.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="Example: Dhaka" className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                                </InputGroup>
                            </TextField>

                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <Label className="text-sm font-semibold text-slate-700">Bio</Label>
                                <div className="flex min-h-32 gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <FileText className="mt-1 h-4 w-4 text-slate-400" />
                                    <textarea value={formData.bio} onChange={(e) => handleChange("bio", e.target.value)} placeholder="Write a short professional summary" rows={5} className="w-full resize-none border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" radius="lg" isLoading={isLoading} isDisabled={isUploading} className="h-12 w-full bg-[#1E3A5F] font-bold text-white hover:bg-[#162c49]">
                            Save Lawyer Information
                        </Button>
                    </form>
                </Card>
            </div>
        </section>
    );
};

export default LawyerInfoForm;
