export const uploadImageToImgBB = async (imageFile) => {
    const imageData = new FormData();
    imageData.append("image", imageFile);

    const res = await fetch("/api/upload-image", {
        method: "POST",
        body: imageData,
    });

    const data = await res.json();

    if (!res.ok || !data.url) {
        throw new Error(data.message || "Image could not be uploaded.");
    }

    return data.url;
};
