const cloudinary = require("../config/cloudinary");

async function handleUpload(file) {
  try {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  } catch (error) {
    console.error("Error al subir archivo:", error);
    throw new Error("No se pudo subir el archivo. Intenta nuevamente.");
  }
}

module.exports = handleUpload;
