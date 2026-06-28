"use client";

import { useState } from "react";
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
import toast from "react-hot-toast";

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

const SignupPage = () => {
    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");

    // UI states
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();
    const redirectTo = "/";

    const togglePasswordVisibility = () =>
        setIsPasswordVisible((prev) => !prev);

    const toggleConfirmVisibility = () =>
        setIsConfirmVisible((prev) => !prev);

    const handleSignup = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Full name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Password and confirm password do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const { error: authError } = await signUp.email({
                email,
                password,
                name,
                role,
            });

            if (authError) {
                setError(
                    authError.message ||
                    "Signup failed. This email may already be registered."
                );
                return;
            }

            setSuccess("Account created successfully! Redirecting...");

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setRole("user");

            router.push(redirectTo);
            router.refresh();
        } catch (err) {
            toast.error(err);
            setError("An unexpected network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError("");
        setSuccess("");
        setIsGoogleLoading(true);

        try {
            const { error: authError } = await signIn.social({
                provider: "google",
                callbackURL: redirectTo,
            });

            if (authError) {
                setError(
                    authError.message ||
                    "Google signup could not be started."
                );
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected network error occurred.");
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
                    {/* Header */}
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
                        isDisabled={isLoading || isGoogleLoading}
                        className="mt-6 h-12 w-full border-slate-200 bg-slate-100 font-semibold text-slate-800"
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

                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Name */}
                        <TextField
                            isRequired
                            name="name"
                            className="flex flex-col gap-1.5"
                        >
                            <Label className="text-sm font-semibold text-slate-700">
                                Full Name
                            </Label>
                            <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                <Person className="h-4 w-4 text-slate-400" />
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                />
                            </InputGroup>
                        </TextField>

                        {/* Email */}
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            className="flex flex-col gap-1.5"
                        >
                            <Label className="text-sm font-semibold text-slate-700">
                                Email
                            </Label>
                            <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                <At className="h-4 w-4 text-slate-400" />
                                <Input
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                />
                            </InputGroup>
                        </TextField>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Password */}
                            <TextField
                                isRequired
                                name="password"
                                className="flex flex-col gap-1.5"
                            >
                                <Label className="text-sm font-semibold text-slate-700">
                                    Password
                                </Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <ShieldKeyhole className="h-4 w-4 text-slate-400" />
                                    <Input
                                        type={isPasswordVisible ? "text" : "password"}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create password"
                                        className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="text-slate-400 transition hover:text-slate-700"
                                        aria-label="toggle password visibility"
                                    >
                                        {isPasswordVisible ? (
                                            <EyeSlash className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </InputGroup>
                            </TextField>

                            {/* Confirm Password */}
                            <TextField
                                isRequired
                                name="confirmPassword"
                                className="flex flex-col gap-1.5"
                            >
                                <Label className="text-sm font-semibold text-slate-700">
                                    Confirm Password
                                </Label>
                                <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                    <ShieldKeyhole className="h-4 w-4 text-slate-400" />
                                    <Input
                                        type={isConfirmVisible ? "text" : "password"}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm password"
                                        className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmVisibility}
                                        className="text-slate-400 transition hover:text-slate-700"
                                        aria-label="toggle confirm password visibility"
                                    >
                                        {isConfirmVisible ? (
                                            <EyeSlash className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </InputGroup>
                            </TextField>
                        </div>

                        {/* Role */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <Label className="text-sm font-semibold text-slate-700">
                                Choose your role
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

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                                <span className="font-semibold">Error:</span> {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                                <span className="font-semibold">Success:</span> {success}
                            </div>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            radius="lg"
                            isLoading={isLoading}
                            isDisabled={isLoading || isGoogleLoading}
                            className="h-12 w-full bg-[#1E3A5F] font-bold text-white hover:bg-[#162c49]"
                        >
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href={`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`} className="font-bold text-[#1E3A5F]">
                            Sign in
                        </Link>
                    </p>
                </Card>
            </div>
        </section>
    );
};

export default SignupPage;
