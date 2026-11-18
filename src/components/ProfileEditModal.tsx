import { useEffect, useState } from "react";

import "../styles/ComponentProfileEditModal.css";

// TIPOS

type ProfileEditModalProps = {
  username: string;
  bio: string;
  photoURL: string;

  onClose: () => void;

  onSave: (
    username: string,
    bio: string,
    foto: File | null
  ) => void;
};

// COMPONENTE

export default function ProfileEditModal({
  username,
  bio,
  photoURL,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  const [novoNome, setNovoNome] =
    useState(username);

  const [novaBio, setNovaBio] =
    useState(bio);

  const [foto, setFoto] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState(photoURL);

  // ALTERAR FOTO

  function handleFotoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) {
      return;
    }

    // Aceita somente imagens
    if (!arquivo.type.startsWith("image/")) {
      return;
    }

    setFoto(arquivo);

    const imagemURL =
      URL.createObjectURL(arquivo);

    setPreview(imagemURL);
  }

  // SALVAR ALTERAÇÕES

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    onSave(
      novoNome,
      novaBio,
      foto
    );
  }

  // LIMPAR PREVIEW

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // TELA

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">

        {/* FECHAR */}
        <button
          type="button"
          className="profile-modal-close"
          onClick={onClose}
        >
          ×
        </button>

        {/* FOTO DE PERFIL */}
        <div className="profile-modal-photo-container">
          <label
            htmlFor="profile-photo"
            className="profile-photo-label"
          >
            {preview ? (
              <img
                src={preview}
                alt="Foto de perfil"
                className="profile-modal-photo"
              />
            ) : (
              <div className="profile-modal-photo profile-modal-default">
                👤
              </div>
            )}

            <span className="profile-photo-overlay">
              trocar foto de perfil
            </span>
          </label>

          <input
            id="profile-photo"
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            hidden
          />
        </div>

        {/* FORMULÁRIO */}
        <form
          className="profile-edit-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="username">
            Nome:
          </label>

          <input
            id="username"
            type="text"
            value={novoNome}
            onChange={(e) =>
              setNovoNome(e.target.value)
            }
            required
          />

          <label htmlFor="bio">
            Biografia:
          </label>

          <textarea
            id="bio"
            value={novaBio}
            onChange={(e) =>
              setNovaBio(e.target.value)
            }
          />

          <button
            type="submit"
            className="profile-save"
          >
            salvar
          </button>
        </form>
      </div>
    </div>
  );
}