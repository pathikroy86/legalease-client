"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Button,
    Card,
    Input,
    InputGroup,
    Label,
    Radio,
    RadioGroup,
    TextField,
} from "@heroui/react";
import {
    Briefcase,
    Calendar,
    Camera,
    CardHeart,
    CircleCheck,
    Clock,
    FileText,
    House,
    MapPin,
    Person,
    Shield,
    Wallet,
} from "@gravity-ui/icons";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/uploadImageToImgBB";

const categories = [
    "Business Law",
    "Family Law",
    "Property Law",
    "Criminal Law",
    "Tax & Finance",
    "Civil Litigation",
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

const getResponseData = async (res) => {
    const text = await res.text();

    try {
        return text ? JSON.parse(text) : {};
    } catch {
        return {
            message: text || "Unexpected server response.",
        };
    }
};

const ProfileEditPage = () => {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const today = useMemo(() => new Date().toISOString().split("T")[0], []);

    const [role, setRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        photoUrl: "",
        name: "",
        specialization: "Business Law",
        bio: "",
        consultationFee: "",
        status: "Available",
        dateJoined: today,
        phone: "",
        address: "",
        city: "",
        legalInterest: "Family Law",
        preferredContact: "Email",
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (isPending) return;

            if (!session?.user) {
                setIsFetching(false);
                toast.error("Please login to edit your profile.");
                router.push("/auth/signin");
                return;
            }

            try {
                const userRole = session.user.role || "user";
                const query = new URLSearchParams({
                    role: userRole,
                    userId: session.user.id || "",
                    email: session.user.email || "",
                });

                const res = await fetch(`${apiUrl}/api/profile?${query.toString()}`);
                const profile = await getResponseData(res);

                setRole(profile.role || userRole);
                setFormData((current) => ({
                    ...current,
                    ...profile,
                    photoUrl: profile.photoUrl || session.user.image || "",
                    name: profile.name || session.user.name || "",
                    dateJoined: profile.dateJoined || today,
                }));
            } catch (err) {
                console.error(err);
                toast.error("Unable to load profile information.");
            } finally {
                setIsFetching(false);
            }
        };

        loadProfile();
    }, [isPending, router, session, today]);

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

        const profilePhotoUrl = formData.photoUrl.trim() || session?.user?.image || "";
        const profileName = formData.name.trim() || session?.user?.name || "";

        if (!profilePhotoUrl) {
            toast.error("User picture URL is required.");
            return;
        }

        if (!profileName) {
            toast.error("Name is required.");
            return;
        }

        if (role === "lawyer" && !formData.bio.trim()) {
            toast.error("Professional summary is required.");
            return;
        }

        if (role === "lawyer" && !formData.consultationFee) {
            toast.error("Consultation fee is required.");
            return;
        }

        if (role === "user" && !formData.phone.trim()) {
            toast.error("Phone number is required.");
            return;
        }

        try {
            setIsLoading(true);

            const profileData = {
                ...formData,
                role,
                photoUrl: profilePhotoUrl,
                name: profileName,
                userId: session?.user?.id || formData.userId || "",
                email: session?.user?.email || formData.email || "",
            };

            const res = await fetch(`${apiUrl}/api/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profileData),
            });

            const result = await getResponseData(res);

            if (!res.ok || !result.acknowledged) {
                toast.error(result.message || "Profile information could not be updated.");
                return;
            }

            toast.success("Profile information updated successfully!");
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Unable to connect to the backend server.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-semibold text-slate-600 shadow-xl shadow-slate-950/5">
                    Loading profile information...
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] bg-[#1E3A5F] p-8 text-white shadow-2xl shadow-slate-950/10 lg:p-10">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">
                        Profile Edit
                    </p>
                    <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                        Keep your LegalEase profile accurate
                    </h1>
                    <p className="mt-5 text-base leading-8 text-slate-200">
                        Update your photo, legal category, contact details, availability, and consultation information anytime.
                    </p>

                    <div className="mt-8 space-y-4">
                        {[
                            "Your saved profile loads from MongoDB.",
                            "Lawyers can update fee, category, status, and summary.",
                            "Clients can update picture, contact, city, and legal need.",
                        ].map((item) => (
                            <div key={item} className="flex gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A646]" />
                                <p className="text-sm leading-6 text-slate-100">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                            Edit Profile
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Update your saved information below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <Label className="text-sm font-semibold text-slate-700">
                                Profile type
                            </Label>
                            <RadioGroup
                                name="role"
                                value={role}
                                onChange={setRole}
                                orientation="horizontal"
                                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
                            >
                                <Radio value="user" className="rounded-xl border border-slate-200 bg-white p-4">
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    <Radio.Content>
                                        <Label className="font-bold text-slate-900">User (Client)</Label>
                                        <p className="mt-1 text-xs text-slate-500">Edit client profile details.</p>
                                    </Radio.Content>
                                </Radio>

                                <Radio value="lawyer" className="rounded-xl border border-slate-200 bg-white p-4">
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    <Radio.Content>
                                        <Label className="font-bold text-slate-900">Lawyer</Label>
                                        <p className="mt-1 text-xs text-slate-500">Edit professional service details.</p>
                                    </Radio.Content>
                                </Radio>
                            </RadioGroup>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <TextField isRequired name="photoUrl" className="flex flex-col gap-1.5 sm:col-span-2">
                                <Label className="text-sm font-semibold text-slate-700">
                                    {role === "lawyer" ? "High-resolution Professional Photo" : "User Picture"}
                                </Label>
                                <InputGroup className="flex min-h-12 flex-col items-start justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-[#1E3A5F] focus-within:bg-white sm:flex-row sm:items-center">
                                    <Camera className="h-4 w-4 text-slate-400" />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-[#1E3A5F] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                                    />
                                    {isUploading && <span className="text-xs font-semibold text-[#1E3A5F]">Uploading...</span>}
                                </InputGroup>
                                {formData.photoUrl && <p className="truncate text-xs font-medium text-slate-500">{formData.photoUrl}</p>}
                            </TextField>

                            <TextField isRequired name="name" className="flex flex-col gap-1.5">
                                <Label className="text-sm font-semibold text-slate-700">Name</Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <Person className="h-4 w-4 text-slate-400" />
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                </InputGroup>
                            </TextField>

                            {role === "lawyer" ? (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-sm font-semibold text-slate-700">
                                            Specialization / Category
                                        </Label>
                                        <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                            <Briefcase className="h-4 w-4 text-slate-400" />
                                            <select
                                                value={formData.specialization}
                                                onChange={(e) => handleChange("specialization", e.target.value)}
                                                className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none"
                                            >
                                                {categories.map((category) => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <TextField isRequired name="consultationFee" className="flex flex-col gap-1.5">
                                        <Label className="text-sm font-semibold text-slate-700">Consultation Fee</Label>
                                        <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                            <Wallet className="h-4 w-4 text-slate-400" />
                                            <Input
                                                type="number"
                                                min="0"
                                                value={formData.consultationFee}
                                                onChange={(e) => handleChange("consultationFee", e.target.value)}
                                                placeholder="Example: 120"
                                                className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                            />
                                        </InputGroup>
                                    </TextField>

                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-sm font-semibold text-slate-700">Status</Label>
                                        <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                            <select
                                                value={formData.status}
                                                onChange={(e) => handleChange("status", e.target.value)}
                                                className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none"
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Busy">Busy</option>
                                            </select>
                                        </div>
                                    </div>

                                    <TextField isRequired name="dateJoined" className="flex flex-col gap-1.5">
                                        <Label className="text-sm font-semibold text-slate-700">Date Joined</Label>
                                        <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            <Input
                                                type="date"
                                                value={formData.dateJoined}
                                                onChange={(e) => handleChange("dateJoined", e.target.value)}
                                                className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none"
                                            />
                                        </InputGroup>
                                    </TextField>

                                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                                        <Label className="text-sm font-semibold text-slate-700">
                                            Bio / Professional Summary
                                        </Label>
                                        <div className="flex min-h-32 gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                            <FileText className="mt-1 h-4 w-4 text-slate-400" />
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => handleChange("bio", e.target.value)}
                                                placeholder="Write a short professional summary"
                                                rows={5}
                                                className="w-full resize-none border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <TextField isRequired name="phone" className="flex flex-col gap-1.5">
                                        <Label className="text-sm font-semibold text-slate-700">Phone Number</Label>
                                        <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                            <Shield className="h-4 w-4 text-slate-400" />
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => handleChange("phone", e.target.value)}
                                                placeholder="Enter phone number"
                                                className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                            />
                                        </InputGroup>
                                    </TextField>

                                    <TextField name="city" className="flex flex-col gap-1.5">
                                        <Label className="text-sm font-semibold text-slate-700">City</Label>
                                        <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                            <House className="h-4 w-4 text-slate-400" />
                                            <Input
                                                value={formData.city}
                                                onChange={(e) => handleChange("city", e.target.value)}
                                                placeholder="Example: Dhaka"
                                                className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                            />
                                        </InputGroup>
                                    </TextField>

                                    <TextField name="address" className="flex flex-col gap-1.5">
                                        <Label className="text-sm font-semibold text-slate-700">Address</Label>
                                        <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            <Input
                                                value={formData.address}
                                                onChange={(e) => handleChange("address", e.target.value)}
                                                placeholder="Enter address"
                                                className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                            />
                                        </InputGroup>
                                    </TextField>

                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-sm font-semibold text-slate-700">Legal Need Category</Label>
                                        <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                            <CardHeart className="h-4 w-4 text-slate-400" />
                                            <select
                                                value={formData.legalInterest}
                                                onChange={(e) => handleChange("legalInterest", e.target.value)}
                                                className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none"
                                            >
                                                {categories.map((category) => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                                        <Label className="text-sm font-semibold text-slate-700">Preferred Contact Method</Label>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                            {["Email", "Phone", "Both"].map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => handleChange("preferredContact", method)}
                                                    className={`h-11 rounded-xl border text-sm font-bold transition ${formData.preferredContact === method
                                                        ? "border-[#1E3A5F] bg-[#EEF4F8] text-[#1E3A5F]"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <Button
                            type="submit"
                            radius="lg"
                            isLoading={isLoading}
                            className="h-12 w-full bg-[#1E3A5F] font-bold text-white hover:bg-[#162c49]"
                        >
                            Update Profile
                        </Button>
                    </form>

                    <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                        Need to start over?{" "}
                        <Link href="/auth/signup" className="font-bold text-[#1E3A5F]">
                            Create a new account
                        </Link>
                    </p>
                </Card>
            </div>
        </section>
    );
};

export default ProfileEditPage;
