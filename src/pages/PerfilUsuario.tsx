import { useEffect, useState } from "react";
import {
  Navigate,
  useParams,
} from "react-router-dom";

import Header from "../components/Header";
import Profile from "../components/Profile";
import GameCard from "../components/GameCard";

import { buscarPerfil } from "../services/profile";

import { useAuth } from "../hooks/useAuth";
import { useReviews } from "../hooks/useReviews";
import { useFavorites } from "../hooks/useFavorites";
import {
  useGames,
  type Jogo,
} from "../hooks/useGames";

import type { Review } from "../services/reviews";
import type { Favorito } from "../services/favorites";

import "../styles/profile.css";

// TIPOS

type ReviewComJogo = Review & {
  jogo: Jogo | null;
};

type FavoritoComJogo = Favorito & {
  jogo: Jogo | null;
};

// PÁGINA DE PERFIL

export default function PerfilUsuario() {
  const { id } = useParams();

  const { user } = useAuth();

  // PERFIL

  const [username, setUsername] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [photoURL, setPhotoURL] =
    useState("");

  const [carregandoPerfil, setCarregandoPerfil] =
    useState(true);

  const [naoEncontrado, setNaoEncontrado] =
    useState(false);

  // REVIEWS

  const {
    carregarReviewsDoUsuario,
  } = useReviews(id);

  const [reviews, setReviews] =
    useState<ReviewComJogo[]>([]);

  const [carregandoReviews, setCarregandoReviews] =
    useState(true);

  // FAVORITOS

  const {
    carregarFavoritosDoUsuario,
  } = useFavorites(id);

  const [favoritos, setFavoritos] =
    useState<FavoritoComJogo[]>([]);

  const [carregandoFavoritos, setCarregandoFavoritos] =
    useState(true);

  // JOGOS

  const { buscarJogo } = useGames();

  // CARREGAR PERFIL

  useEffect(() => {
    async function carregarPerfil() {
      if (!id) {
        setNaoEncontrado(true);
        setCarregandoPerfil(false);
        return;
      }

      try {
        setCarregandoPerfil(true);
        setNaoEncontrado(false);

        const perfil =
          await buscarPerfil(id);

        if (perfil) {
          setUsername(
            perfil.username || ""
          );

          setBio(
            perfil.bio || ""
          );

          setPhotoURL(
            perfil.photoURL || ""
          );
        } else {
          setNaoEncontrado(true);
        }
      } catch {
        setNaoEncontrado(true);
      } finally {
        setCarregandoPerfil(false);
      }
    }

    carregarPerfil();
  }, [id]);

  // CARREGAR REVIEWS

  useEffect(() => {
    async function carregarReviews() {
      if (!id) {
        setCarregandoReviews(false);
        return;
      }

      try {
        setCarregandoReviews(true);

        const reviewsDoUsuario =
          await carregarReviewsDoUsuario(id);

        const reviewsComJogos =
          await Promise.all(
            reviewsDoUsuario.map(
              async (review) => ({
                ...review,
                jogo: await buscarJogo(
                  review.gameId
                ),
              })
            )
          );

        setReviews(
          reviewsComJogos
        );
      } catch {
        setReviews([]);
      } finally {
        setCarregandoReviews(false);
      }
    }

    carregarReviews();
  }, [
    id,
    carregarReviewsDoUsuario,
    buscarJogo,
  ]);

  // CARREGAR FAVORITOS

  useEffect(() => {
    async function carregarFavoritos() {
      if (!id) {
        setCarregandoFavoritos(false);
        return;
      }

      try {
        setCarregandoFavoritos(true);

        const favoritosDoUsuario =
          await carregarFavoritosDoUsuario(id);

        const favoritosComJogos =
          await Promise.all(
            favoritosDoUsuario.map(
              async (favorito) => ({
                ...favorito,
                jogo: await buscarJogo(
                  favorito.gameId
                ),
              })
            )
          );

        setFavoritos(
          favoritosComJogos
        );
      } catch {
        setFavoritos([]);
      } finally {
        setCarregandoFavoritos(false);
      }
    }

    carregarFavoritos();
  }, [
    id,
    carregarFavoritosDoUsuario,
    buscarJogo,
  ]);

  // REDIRECIONAR PARA O PRÓPRIO PERFIL

  if (user && id === user.uid) {
    return (
      <Navigate
        to="/perfil"
        replace
      />
    );
  }

  // TELA

  return (
    <div className="profile-page">
      {/* CABEÇALHO */}
      <Header
        mostrarPesquisa={false}
        mostrarFiltros={false}
        mostrarPerfil={true}
        mostrarLogout={false}
      />

      <main className="profile-content">
        {carregandoPerfil ? (
          <p className="profile-message">
            Carregando perfil...
          </p>
        ) : naoEncontrado ? (
          <p className="profile-message">
            Usuário não encontrado.
          </p>
        ) : (
          <Profile
            username={username}
            bio={bio}
            photoURL={photoURL}

            // Outro usuário não pode editar
            mostrarEdicao={false}

            // FAVORITOS

            favoritos={
              carregandoFavoritos ? (
                <p className="profile-message">
                  Carregando favoritos...
                </p>
              ) : favoritos.length === 0 ? (
                <p className="profile-empty">
                  Este usuário ainda não adicionou nenhum jogo aos favoritos.
                </p>
              ) : (
                favoritos
                  .slice(0, 5)
                  .map((favorito) => {
                    if (!favorito.jogo) {
                      return null;
                    }

                    return (
                      <GameCard
                        key={favorito.id}
                        jogo={favorito.jogo}
                      />
                    );
                  })
              )
            }

            // REVIEWS

            reviews={
              carregandoReviews ? (
                <p className="profile-message">
                  Carregando reviews...
                </p>
              ) : reviews.length === 0 ? (
                <p className="profile-empty">
                  Este usuário ainda não fez nenhuma review.
                </p>
              ) : (
                reviews
                  .slice(0, 5)
                  .map((review) => {
                    if (!review.jogo) {
                      return null;
                    }

                    return (
                      <GameCard
                        key={review.id}
                        jogo={review.jogo}
                        notaReview={review.rating}
                      />
                    );
                  })
              )
            }

            // ROTAS

            caminhoFavoritos={
              `/usuario/${id}/favoritos`
            }

            caminhoReviews={
              `/usuario/${id}/reviews`
            }
          />
        )}
      </main>
    </div>
  );
}