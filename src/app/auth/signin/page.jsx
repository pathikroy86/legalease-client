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
    TextField,
} from "@heroui/react";
import { At, Eye, EyeSlash, ShieldKeyhole } from "@gravity-ui/icons";
import { signIn } from "@/lib/auth-client";
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

const SigninPage = () => {
    // Form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // UI states
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const router = useRouter();
    const redirectTo = "/";

    const togglePasswordVisibility = () =>
        setIsPasswordVisible((prev) => !prev);

    const handleSignin = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Email is required.");
            return;
        }

        if (!password) {
            toast.error("Password is required.");
            return;
        }

        setIsLoading(true);

        try {
            const { error: authError } = await signIn.email({
                email,
                password,
            });

            if (authError) {
                toast.error(
                    authError.message ||
                    "Invalid email or password."
                );
                return;
            }

            toast.success("Signed in successfully! Redirecting...");

            setEmail("");
            setPassword("");

            router.push(redirectTo);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("An unexpected network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignin = async () => {
        setIsGoogleLoading(true);

        try {
            const { error: authError } = await signIn.social({
                provider: "google",
                callbackURL: redirectTo,
            });

            if (authError) {
                toast.error(
                    authError.message ||
                    "Google login could not be started."
                );
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected network error occurred.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] bg-[#1E3A5F] p-8 text-white shadow-2xl shadow-slate-950/10 lg:p-10">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#C9A646]">
                        Welcome Back
                    </p>
                    <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                        Continue your legal journey
                    </h1>
                    <p className="mt-5 text-base leading-8 text-slate-200">
                        Login to manage hiring requests, comments, payments, lawyer profiles, and dashboard activity.
                    </p>

                    <div className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                        <p className="text-lg font-bold">LegalEase dashboard access</p>
                        <p className="mt-2 text-sm leading-6 text-slate-200">
                            Clients can track hiring history. Lawyers can manage requests and services. Admins can oversee users and transactions.
                        </p>
                    </div>
                </div>

                <Card className="border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
                    {/* Header */}
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                            Login
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Enter your credentials to access your account.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="bordered"
                        radius="lg"
                        onPress={handleGoogleSignin}
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
                            Or Login with email
                        </span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <form onSubmit={handleSignin} className="space-y-5">
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

                        {/* Password */}
                        <TextField
                            isRequired
                            name="password"
                            className="flex flex-col gap-1.5"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <Label className="text-sm font-semibold text-slate-700">
                                    Password
                                </Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs font-bold text-[#1E3A5F]"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <InputGroup className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1E3A5F] focus-within:bg-white">
                                <ShieldKeyhole className="h-4 w-4 text-slate-400" />
                                <Input
                                    type={isPasswordVisible ? "text" : "password"}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
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

                        {/* Submit */}
                        <Button
                            type="submit"
                            radius="lg"
                            isLoading={isLoading}
                            isDisabled={isLoading || isGoogleLoading}
                            className="h-12 w-full bg-[#1E3A5F] font-bold text-white hover:bg-[#162c49]"
                        >
                            Login
                        </Button>
                    </form>

                    <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                        New to LegalEase?{" "}
                        <Link
                            href="/auth/signup"
                            className="font-bold text-[#1E3A5F]"
                        >
                            Create an account
                        </Link>
                    </p>
                </Card>
            </div>
        </section>
    );
};

export default SigninPage;
