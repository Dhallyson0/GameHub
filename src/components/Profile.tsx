import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ComponentProfile.css";

// TIPOS

type ProfileProps = {
  username: string;
  bio: string;
  photoURL: string;

  onEdit?: () => void;
  mostrarEdicao?: boolean;

  favoritos?: ReactNode;
  reviews?: ReactNode;

  caminhoFavoritos?: string;
  caminhoReviews?: string;
};

// COMPONENTE DE PERFIL

export default function Profile({
  username,
  bio,
  photoURL,
  onEdit,
  mostrarEdicao = false,
  favoritos,
  reviews,
  caminhoFavoritos,
  caminhoReviews,
}: ProfileProps) {
  const navigate = useNavigate();

  return (
    <section className="profile">

      {/* CABEÇALHO DO PERFIL */}

      <div className="profile-header">
        <div className="profile-photo-container">
          {/* FOTO DO PERFIL */}
          {photoURL ? (
            <img
              src={photoURL}
              alt={`Foto de ${username}`}
              className="profile-photo"
            />
          ) : (
            <div className="profile-photo profile-default">
              👤
            </div>
          )}

          {/* BOTÃO DE EDITAR */}
          {mostrarEdicao && (
            <button
              type="button"
              className="profile-edit"
              title="Editar perfil"
              onClick={onEdit}
            >
              ✎
            </button>
          )}
        </div>

        <h2>@{username}</h2>

        <p className="profile-bio">
          {bio || "Nenhuma biografia adicionada."}
        </p>
      </div>

      {/* FAVORITOS */}

      <section className="profile-section">
        <div className="profile-section-title">
          <h2>Favoritos:</h2>

          {caminhoFavoritos && (
            <button
              type="button"
              className="profile-see-more"
              onClick={() =>
                navigate(caminhoFavoritos)
              }
            >
              Ver mais &gt;
            </button>
          )}
        </div>

        <div className="profile-divider" />

        {favoritos && (
          <div className="profile-games">
            {favoritos}
          </div>
        )}
      </section>

      {/* REVIEWS */}

      <section className="profile-section">
        <div className="profile-section-title">
          <h2>Reviews do perfil:</h2>

          {caminhoReviews && (
            <button
              type="button"
              className="profile-see-more"
              onClick={() =>
                navigate(caminhoReviews)
              }
            >
              Ver mais &gt;
            </button>
          )}
        </div>

        <div className="profile-divider" />

        {reviews && (
          <div className="profile-games">
            {reviews}
          </div>
        )}
      </section>
    </section>
  );
}