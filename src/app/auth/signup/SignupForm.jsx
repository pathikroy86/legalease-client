"use client";

import React, { useState } from "react";
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
import { At, Eye, EyeSlash, Person, ShieldKeyhole } from "@gravity-ui/icons";
import { signIn, signUp } from "@/lib/auth-client";

const GoogleIcon = (props) => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fill="#4285F4"
            d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.37a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.99-4.31 2.99-7.52Z"
        />
        <path
            fill="#34A853"
            d="M12 22c2.7 0 4.96-.89 6.61-2.42l-3.23-2.51c-.89.6-2.03.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.07v2.59A9.99 9.99 0 0 0 12 22Z"
        />
        <path
            fill="#FBBC05"
            d="M6.4 13.9a6.02 6.02 0 0 1 0-3.8V7.51H3.07a10.01 10.01 0 0 0 0 8.98L6.4 13.9Z"
        />
        <path
            fill="#EA4335"
            d="M12 5.97c1.47 0 2.79.51 3.83 1.5l2.86-2.86C16.96 2.99 14.7 2 12 2a9.99 9.99 0 0 0-8.93 5.51L6.4 10.1C7.19 7.73 9.4 5.97 12 5.97Z"
        />
    </svg>
);

const SignupForm = () => {
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const updateField = (field, value) => {
        setFormValues((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = {};

        if (!formValues.name.trim()) {
            nextErrors.name = "Full name is required.";
        }

        if (!formValues.email.trim()) {
            nextErrors.email = "Email is required.";
        }

        if (formValues.password.length < 6) {
            nextErrors.password = "Password must be at least 6 characters.";
        }

        if (formValues.password !== formValues.confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(nextErrors);
        setFormError("");
        setSuccess("");

        if (Object.keys(nextErrors).length > 0) return;

        setIsSubmitting(true);

        try {
            const { error } = await signUp.email({
                name: formValues.name.trim(),
                email: formValues.email.trim(),
                password: formValues.password,
                role: formValues.role,
            });

            if (error) {
                setFormError(
                    error.message ||
                    "Signup failed. Please check your information and try again."
                );
                return;
            }

            setSuccess("Account created successfully. Redirecting...");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error(error);
            setFormError("Something went wrong while creating your account.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignup = async () => {
        setFormError("");
        setSuccess("");
        setIsGoogleLoading(true);

        try {
            sessionStorage.setItem("legalease_signup_role", formValues.role);

            const { error } = await signIn.social({
                provider: "google",
                callbackURL: `/auth/complete-signup?role=${formValues.role}`,
            });

            if (error) {
                setFormError(
                    error.message ||
                    "Google signup could not be started. Please try again."
                );
            }
        } catch (error) {
            console.error(error);
            setFormError("Something went wrong while starting Google signup.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] bg-[#1E3A5F] p-8 text-white shadow-2xl shadow-slate-950/10 lg:p-10">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">
                        Join LegalEase
                    </p>
                    <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                        Create your legal hiring account
                    </h1>
                    <p className="mt-5 text-base leading-8 text-slate-200">
                        Register as a client to hire advocates, or choose lawyer to publish and manage your legal services after verification.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                            <p className="text-2xl font-bold">Client</p>
                            <p className="mt-2 text-sm leading-6 text-slate-200">
                                Browse, hire, pay, and comment on verified lawyers.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                            <p className="text-2xl font-bold">Lawyer</p>
                            <p className="mt-2 text-sm leading-6 text-slate-200">
                                Publish services, manage requests, and track hires.
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                            Sign up
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Use email and password or continue with Google.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="bordered"
                        radius="lg"
                        onPress={handleGoogleSignup}
                        isLoading={isGoogleLoading}
                        isDisabled={isSubmitting || isGoogleLoading}
                        className="bg-slate-100 mt-6 h-12 w-full border-slate-200 font-semibold text-slate-800"
                    >
                        <GoogleIcon className="h-5 w-5" />
                        Continue with Google
                    </Button>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Or register with email
                        </span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <TextField className="flex flex-col gap-1.5" isInvalid={!!errors.name}>
                            <Label className="text-sm font-semibold text-slate-700">
                                Full Name
                            </Label>
                            <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                <Person className="h-4 w-4 text-slate-400" />
                                <Input
                                    value={formValues.name}
                                    onChange={(event) => updateField("name", event.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                />
                            </InputGroup>
                            {errors.name && <p className="text-xs font-medium text-red-600">{errors.name}</p>}
                        </TextField>

                        <TextField className="flex flex-col gap-1.5" isInvalid={!!errors.email}>
                            <Label className="text-sm font-semibold text-slate-700">
                                Email
                            </Label>
                            <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                <At className="h-4 w-4 text-slate-400" />
                                <Input
                                    type="email"
                                    value={formValues.email}
                                    onChange={(event) => updateField("email", event.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                />
                            </InputGroup>
                            {errors.email && <p className="text-xs font-medium text-red-600">{errors.email}</p>}
                        </TextField>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <TextField className="flex flex-col gap-1.5" isInvalid={!!errors.password}>
                                <Label className="text-sm font-semibold text-slate-700">
                                    Password
                                </Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <ShieldKeyhole className="h-4 w-4 text-slate-400" />
                                    <Input
                                        type={isPasswordVisible ? "text" : "password"}
                                        value={formValues.password}
                                        onChange={(event) => updateField("password", event.target.value)}
                                        placeholder="Create password"
                                        className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsPasswordVisible((current) => !current)}
                                        className="text-slate-400 transition hover:text-slate-700"
                                        aria-label="Toggle password visibility"
                                    >
                                        {isPasswordVisible ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </InputGroup>
                                {errors.password && <p className="text-xs font-medium text-red-600">{errors.password}</p>}
                            </TextField>

                            <TextField className="flex flex-col gap-1.5" isInvalid={!!errors.confirmPassword}>
                                <Label className="text-sm font-semibold text-slate-700">
                                    Confirm Password
                                </Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <ShieldKeyhole className="h-4 w-4 text-slate-400" />
                                    <Input
                                        type={isConfirmVisible ? "text" : "password"}
                                        value={formValues.confirmPassword}
                                        onChange={(event) => updateField("confirmPassword", event.target.value)}
                                        placeholder="Confirm password"
                                        className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsConfirmVisible((current) => !current)}
                                        className="text-slate-400 transition hover:text-slate-700"
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {isConfirmVisible ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </InputGroup>
                                {errors.confirmPassword && <p className="text-xs font-medium text-red-600">{errors.confirmPassword}</p>}
                            </TextField>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <Label className="text-sm font-semibold text-slate-700">
                                Choose your role
                            </Label>
                            <RadioGroup
                                name="role"
                                value={formValues.role}
                                onChange={(value) => updateField("role", value)}
                                orientation="horizontal"
                                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
                            >
                                <Radio value="user" className="rounded-xl border border-slate-200 bg-white p-4">
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    <Radio.Content>
                                        <Label className="font-bold text-slate-900">User (Client)</Label>
                                        <p className="mt-1 text-xs text-slate-500">Hire lawyers and track history.</p>
                                    </Radio.Content>
                                </Radio>

                                <Radio value="lawyer" className="rounded-xl border border-slate-200 bg-white p-4">
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    <Radio.Content>
                                        <Label className="font-bold text-slate-900">Lawyer</Label>
                                        <p className="mt-1 text-xs text-slate-500">Publish services after verification.</p>
                                    </Radio.Content>
                                </Radio>
                            </RadioGroup>
                        </div>

                        {success && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                                {success}
                            </div>
                        )}

                        {formError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                                {formError}
                            </div>
                        )}

                        <Button
                            type="submit"
                            radius="lg"
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting || isGoogleLoading}
                            className="h-12 w-full bg-[#1E3A5F] font-bold text-white hover:bg-[#162c49]"
                        >
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="font-bold text-[#1E3A5F]">
                            Sign in
                        </Link>
                    </p>
                </Card>
            </div>
        </section>
    );
};

export default SignupForm;
