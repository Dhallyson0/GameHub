export async function enviarFotoPerfil(arquivo: File) {
  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const dados = new FormData();

  dados.append("file", arquivo);
  dados.append("upload_preset", uploadPreset);

  const resposta = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: dados,
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao enviar foto para o Cloudinary.");
  }

  const resultado = await resposta.json();

  return resultado.secure_url;
}