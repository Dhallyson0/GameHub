import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

import { useFavorites } from "../hooks/useFavorites";
import {
  useGames,
  type Jogo as JogoType,
} from "../hooks/useGames";
import { useAuth } from "../hooks/useAuth";
import { useReviews } from "../hooks/useReviews";

import "../styles/game.css";

// JOGO

export default function Jogo() {
  const { id } = useParams();

  const { buscarJogo, carregando } = useGames();

  // USUÁRIO

  const {
    autenticado,
    user,
  } = useAuth();

  const {
    favoritado,
    carregando: carregandoFavorito,
    verificar,
    alternarFavorito,
  } = useFavorites(
    user?.uid,
    id ? Number(id) : undefined
  );

  // VERIFICAR FAVORITO

  useEffect(() => {
    verificar();
  }, [verificar]);

  // JOGO

  const [jogo, setJogo] =
    useState<JogoType | null>(null);

  // REVIEWS

  const {
    reviews,
    salvar,
    carregarReviewsDoJogo,
  } = useReviews(
    user?.uid,
    id ? Number(id) : undefined
  );

  // CARREGAR JOGO

  useEffect(() => {
    async function carregarJogo() {
      if (!id) {
        return;
      }

      const resultado =
        await buscarJogo(Number(id));

      setJogo(resultado);
    }

    carregarJogo();
  }, [id, buscarJogo]);

  // CARREGAR REVIEWS

  useEffect(() => {
    carregarReviewsDoJogo();
  }, [carregarReviewsDoJogo]);

  // CARREGANDO

  if (carregando) {
    return (
      <p className="game-message">
        Carregando jogo...
      </p>
    );
  }

  // JOGO NÃO ENCONTRADO

  if (!jogo) {
    return (
      <p className="game-message">
        Jogo não encontrado.
      </p>
    );
  }

  // IMAGEM DO BANNER

  const imagemBanner =
    jogo.artworks?.[0]?.url
      ? `https:${jogo.artworks[0].url.replace(
          "t_thumb",
          "t_1080p"
        )}`
      : jogo.screenshots?.[0]?.url
      ? `https:${jogo.screenshots[0].url.replace(
          "t_thumb",
          "t_screenshot_huge"
        )}`
      : "";

  // DATA

  const dataLancamento =
    jogo.first_release_date
      ? new Date(
          jogo.first_release_date * 1000
        ).toLocaleDateString("pt-BR")
      : "Data desconhecida";

  // NOTA IGDB

  const notaIGDB =
    jogo.rating !== undefined &&
    jogo.rating !== null
      ? Math.round(jogo.rating)
      : null;

  // DESENVOLVEDORA

  const desenvolvedores =
    jogo.involved_companies
      ?.filter(
        (empresa) => empresa.developer
      )
      .map(
        (empresa) => empresa.company?.name
      )
      .filter(Boolean) || [];

  // PLATAFORMAS

  const plataformas =
    jogo.platforms?.map(
      (plataforma) => plataforma.name
    ) || [];

  // POSTAR REVIEW

  async function handlePostarReview(
    nota: number,
    texto: string
  ) {
    if (!jogo || !user) {
      return;
    }

    try {
      await salvar(nota, texto);

      alert("Review publicada!");
    } catch {
      alert(
        "Não foi possível publicar a review."
      );
    }
  }

  // TELA

  return (
    <div className="game-page">
      {/* CABEÇALHO */}
      <Header
        mostrarPesquisa={false}
        mostrarFiltros={false}
      />

      <main className="game-content">
        {/* IMAGEM DO JOGO */}

        {imagemBanner && (
          <div className="game-banner">
            <img
              src={imagemBanner}
              alt={`Imagem de ${jogo.name}`}
            />
          </div>
        )}

        {/* INFORMAÇÕES */}

        <section className="game-info">
          <div className="game-title-row">
            <h1>{jogo.name}</h1>

            {user && (
              <button
                type="button"
                className={
                  favoritado
                    ? "favorite-button active"
                    : "favorite-button"
                }
                onClick={alternarFavorito}
                disabled={carregandoFavorito}
                aria-label={
                  favoritado
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
                }
              >
                {favoritado ? "♥" : "♡"}
              </button>
            )}
          </div>

          <div className="game-info-tags">
            <span>
              Data de lançamento:{" "}
              {dataLancamento}
            </span>

            <span>
              Nota:{" "}
              {notaIGDB !== null
                ? `${notaIGDB}/100`
                : "Sem nota"}
            </span>

            <span>
              Desenvolvedora:{" "}
              {desenvolvedores.length > 0
                ? desenvolvedores.join(", ")
                : "Desenvolvedora desconhecida"}
            </span>

            <span>
              Plataformas:{" "}
              {plataformas.length > 0
                ? plataformas.join(", ")
                : "Plataformas desconhecidas"}
            </span>
          </div>

          {/* SINOPSE */}

          {jogo.summary && (
            <p className="game-summary">
              {jogo.summary}
            </p>
          )}
        </section>

        {/* REVIEW */}

        <section className="game-review-section">
          <h2>Deixe sua avaliação</h2>

          {autenticado ? (
            <ReviewForm
              onPostar={handlePostarReview}
            />
          ) : (
            <p className="game-login-message">
              Entre na sua conta para
              escrever uma review.
            </p>
          )}
        </section>

        {/*  REVIEWS DA COMUNIDADE */}

        <ReviewList
          reviews={reviews}
        />
      </main>
    </div>
  );
}