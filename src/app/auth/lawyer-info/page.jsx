import LawyerInfoForm from "./LawyerInfoForm";

export default async function LawyerInfoPage({ searchParams }) {
    const params = await searchParams;

    return (
        <LawyerInfoForm
            initialName={params?.name || ""}
            initialEmail={params?.email || ""}
        />
    );
}
