// src/utils/uploadToCloudinary.js
export const uploadToCloudinary = async (file, folder = "default") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "zeigler"); // Your preset name
    formData.append("folder", folder); // Optional folder in Cloudinary
  
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dhhwh82qg/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (data.secure_url) {
        return data.secure_url; // This is the image URL
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      throw err;
    }
  };
  