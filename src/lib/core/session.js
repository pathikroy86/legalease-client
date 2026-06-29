import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session;
};

export const getCurrentUser = async () => {
    const session = await getUserSession();

    return session?.user || null;
};
