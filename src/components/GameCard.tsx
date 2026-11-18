import { Link } from "react-router-dom";
import type { Jogo } from "../hooks/useGames";

import seta from "../assets/icons/seta.png";

import "../styles/ComponentGameCard.css";

type GameCardProps = {
  jogo: Jogo;
  notaReview?: number;
};

export default function GameCard({
  jogo,
  notaReview,
}: GameCardProps) {
  const imagem = jogo.cover?.url
    ? `https:${jogo.cover.url.replace(
        "t_thumb",
        "t_720p"
      )}`
    : "";

  const nota =
    notaReview !== undefined
      ? notaReview
      : jogo.rating !== undefined &&
        jogo.rating !== null
      ? Math.round(jogo.rating)
      : "-";

  return (
    <Link
      to={`/jogo/${jogo.id}`}
      className="game-card"
    >
      {imagem ? (
        <img
          src={imagem}
          alt={`Capa de ${jogo.name}`}
          className="game-card-image"
        />
      ) : (
        <div className="game-card-image game-card-no-image">
          Sem imagem
        </div>
      )}

      <div className="game-card-info">
        <h3>{jogo.name}</h3>

        <div className="game-card-bottom">
          <span className="game-card-rating">
            ★ {nota}
          </span>

          <img
            src={seta}
            alt=""
            className="game-card-arrow"
          />
        </div>
      </div>
    </Link>
  );
}