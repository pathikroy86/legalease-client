export const uploadImageToImgBB = async (imageFile) => {
    const imageData = new FormData();
    imageData.append("image", imageFile);

    const res = await fetch("/api/upload-image", {
        method: "POST",
        body: imageData,
    });

    const text = await res.text();
    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { message: text || "Image could not be uploaded." };
    }

    if (!res.ok || !data.url) {
        throw new Error(data.message || "Image could not be uploaded.");
    }

    return data.url;
};
