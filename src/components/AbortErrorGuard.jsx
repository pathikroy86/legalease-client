"use client";

import { useEffect } from "react";

const isAbortError = (reason) => {
    if (!reason) return false;

    return reason.name === "AbortError" ||
        reason.code === "ABORT_ERR" ||
        String(reason.message || "").toLowerCase().includes("signal is aborted");
};

export default function AbortErrorGuard() {
    useEffect(() => {
        const handleUnhandledRejection = (event) => {
            if (isAbortError(event.reason)) {
                event.preventDefault();
            }
        };

        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    return null;
}
