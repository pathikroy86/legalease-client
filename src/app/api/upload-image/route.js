export const POST = async (request) => {
    try {
        const imgbbApiKey = process.env.IMGBB_API_KEY;

        if (!imgbbApiKey) {
            return Response.json({ message: "imgBB API key is missing." }, { status: 500 });
        }

        const formData = await request.formData();
        const image = formData.get("image");

        if (!image) {
            return Response.json({ message: "Image file is required." }, { status: 400 });
        }

        const uploadData = new FormData();
        uploadData.append("image", image);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: "POST",
            body: uploadData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            return Response.json({ message: data?.error?.message || "Image upload failed." }, { status: 500 });
        }

        return Response.json({ url: data.data.display_url });
    } catch (err) {
        console.error(err);
        return Response.json({ message: "Image upload failed." }, { status: 500 });
    }
};
