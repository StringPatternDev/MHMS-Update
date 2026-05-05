import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { file } = req.body; // base64 string

    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: "chat_files",
      resource_type: "auto", // image, video, pdf auto-detect
    });

    return res.status(200).json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: error.message });
  }
}
