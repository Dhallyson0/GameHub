import { Link } from "react-router-dom";

import "../styles/ComponentUserCard.css";

// TIPOS

type UserCardProps = {
  id: string;
  username: string;
  photoURL: string;
  fotoComErro: boolean;
  onFotoErro: () => void;
};

// COMPONENTE

export default function UserCard({
  id,
  username,
  photoURL,
  fotoComErro,
  onFotoErro,
}: UserCardProps) {
  return (
    <Link
      to={`/usuario/${id}`}
      className="usuario-card"
    >
      {/* FOTO DO USUÁRIO */}
      {photoURL && !fotoComErro ? (
        <img
          src={photoURL}
          alt={`Foto de ${username}`}
          className="usuario-foto"
          onError={onFotoErro}
        />
      ) : (
        <div className="usuario-foto usuario-foto-padrao">
          👤
        </div>
      )}

      {/* NOME DO USUÁRIO */}
      <span className="usuario-nome">
        @{username}
      </span>
    </Link>
  );
}