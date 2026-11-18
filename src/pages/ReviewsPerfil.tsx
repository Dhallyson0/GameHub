import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import GameCard from "../components/GameCard";

import { useAuth } from "../hooks/useAuth";
import { useReviews } from "../hooks/useReviews";
import { useGames } from "../hooks/useGames";

import type { Jogo } from "../hooks/useGames";
import type { Review } from "../services/reviews";

import "../styles/ReviewsPerfil.css";

// TIPOS

type ReviewComJogo = {
  review: Review;
  jogo: Jogo;
};

// PÁGINA DE REVIEWS

export default function ReviewsPerfil() {
  // AUTENTICAÇÃO

  const {
    user,
    carregando: carregandoAuth,
  } = useAuth();

  // ID DO USUÁRIO

  const { id } = useParams();

  // Se existir ID na URL, usa o ID do outro usuário.
  // Caso contrário, usa o usuário logado.
  const usuarioId = id || user?.uid;

  // REVIEWS

  const {
    carregarReviewsDoUsuario,
  } = useReviews(usuarioId);

  // JOGOS

  const { buscarJogo } = useGames();

  // ESTADOS

  const [reviewsComJogos, setReviewsComJogos] =
    useState<ReviewComJogo[]>([]);

  const [carregandoReviews, setCarregandoReviews] =
    useState(false);

  // CARREGAR REVIEWS

  useEffect(() => {
    if (carregandoAuth) {
      return;
    }

    if (!usuarioId) {
      setReviewsComJogos([]);
      return;
    }

    let ativo = true;

    async function carregarReviews() {
      setCarregandoReviews(true);

      try {
        if (!usuarioId) {
          setReviewsComJogos([]);
          return;
        }

        const reviews =
          await carregarReviewsDoUsuario(usuarioId);

        const resultados = await Promise.all(
          reviews.map(async (review) => {
            const jogo = await buscarJogo(
              review.gameId
            );

            if (!jogo) {
              return null;
            }

            return {
              review,
              jogo,
            };
          })
        );

        if (ativo) {
          setReviewsComJogos(
            resultados.filter(
              (item): item is ReviewComJogo =>
                item !== null
            )
          );
        }
      } catch {
        if (ativo) {
          setReviewsComJogos([]);
        }
      } finally {
        if (ativo) {
          setCarregandoReviews(false);
        }
      }
    }

    carregarReviews();

    return () => {
      ativo = false;
    };
  }, [
    usuarioId,
    carregandoAuth,
    carregarReviewsDoUsuario,
    buscarJogo,
  ]);

  // PERFIL

  const perfilProprio =
    !id || id === user?.uid;

  // TELA

  return (
    <>
      {/* CABEÇALHO */}
      <Header
        mostrarPesquisa={false}
        mostrarFiltros={false}
        mostrarPerfil={true}
        mostrarLogout={false}
      />

      <main className="reviews-perfil">
        <section className="reviews-container">
          <h1>
            {perfilProprio
              ? "Minhas Reviews"
              : "Reviews do perfil"}
          </h1>

          {/* CARREGANDO */}
          {carregandoAuth ||
          carregandoReviews ? (
            <p className="reviews-mensagem">
              Carregando reviews...
            </p>
          ) : !usuarioId ? (
            <p className="reviews-mensagem">
              Faça login para visualizar suas reviews.
            </p>
          ) : reviewsComJogos.length === 0 ? (
            <p className="reviews-mensagem">
              {perfilProprio
                ? "Você ainda não fez nenhuma review."
                : "Este usuário ainda não fez nenhuma review."}
            </p>
          ) : (
            /* LISTA DE REVIEWS */
            <div className="reviews-lista">
              {reviewsComJogos.map(
                ({ review, jogo }) => (
                  <article
                    key={review.id}
                    className="review-perfil-card"
                  >
                    {/* JOGO */}
                    <GameCard
                      jogo={jogo}
                      notaReview={review.rating}
                    />

                    {/* CONTEÚDO DA REVIEW */}
                    <div className="review-perfil-conteudo">
                      <h3>
                        {jogo.name}
                      </h3>

                      <p className="review-perfil-nota">
                        {perfilProprio
                          ? "Sua nota"
                          : "Nota"}:{" "}
                        {review.rating}/5 ★
                      </p>

                      <p className="review-perfil-texto">
                        {review.text}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}