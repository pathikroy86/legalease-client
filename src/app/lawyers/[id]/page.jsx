import LawyerDetails from "./LawyerDetails";

export default async function LawyerDetailsPage({ params }) {
    const { id } = await params;

    return <LawyerDetails lawyerId={id}></LawyerDetails>;
}
