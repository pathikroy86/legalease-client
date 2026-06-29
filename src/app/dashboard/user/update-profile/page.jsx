"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Card, Input, InputGroup, Label, TextField } from "@heroui/react";
import { Camera, Person } from "@gravity-ui/icons";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/uploadImageToImgBB";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";

export default function UpdateProfilePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;
    const [name, setName] = useState(user?.name || "");
    const [image, setImage] = useState(user?.image || "");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!user?.email) return;

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`${apiUrl}/api/user-profile?email=${user.email}`);
                const data = await res.json();

                if (data?._id) {
                    setName(data.name || user.name || "");
                    setImage(data.image || user.image || "");
                }
            } catch (err) {
                console.error(err);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [user?.email, user?.image, user?.name]);

    const handleImageUpload = async (e) => {
        const imageFile = e.target.files?.[0];
        if (!imageFile) return;

        setIsUploading(true);

        try {
            const imageUrl = await uploadImageToImgBB(imageFile);
            setImage(imageUrl);
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

        if (!user?.email) {
            router.push("/auth/signin");
            return;
        }

        if (!name.trim()) {
            toast.error("Full name is required.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${apiUrl}/api/user-profile`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, name, image }),
            });
            const result = await res.json();

            if (!res.ok || (!result.modifiedCount && !result.upsertedCount && !result.matchedCount)) {
                toast.error(result.message || "Profile could not be updated.");
                return;
            }

            toast.success("Profile updated successfully!");
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Unable to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">Profile Management</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Update Profile</h1>

                <Card className="mt-8 border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <TextField isRequired className="flex flex-col gap-1.5">
                            <Label className="text-sm font-semibold text-slate-700">Full Name</Label>
                            <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                <Person className="h-4 w-4 text-slate-400" />
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                            </InputGroup>
                        </TextField>

                        <TextField className="flex flex-col gap-1.5">
                            <Label className="text-sm font-semibold text-slate-700">Profile Picture</Label>
                            {image && (
                                <Image
                                    src={image}
                                    alt={name || "Profile picture"}
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
                                <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Or paste image URL" className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                            </InputGroup>
                            {image && <p className="truncate text-xs font-medium text-slate-500">{image}</p>}
                        </TextField>

                        <Button type="submit" isLoading={isLoading} isDisabled={isUploading} className="h-12 w-full bg-[#1E3A5F] font-bold text-white">
                            Update Profile
                        </Button>
                    </form>
                </Card>
            </div>
        </section>
    );
}
