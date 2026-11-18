import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Header from "../components/Header";
import Profile from "../components/Profile";
import ProfileEditModal from "../components/ProfileEditModal";
import GameCard from "../components/GameCard";

import { enviarFotoPerfil } from "../services/profileStorage";
import {
  buscarPerfil,
  atualizarPerfil,
} from "../services/profile";

import { useReviews } from "../hooks/useReviews";
import { useFavorites } from "../hooks/useFavorites";
import {
  useGames,
  type Jogo,
} from "../hooks/useGames";

import type { Review } from "../services/reviews";
import type { Favorito } from "../services/favorites";

import { useAuth } from "../hooks/useAuth";

import "../styles/profile.css";

// TIPOS

type ReviewComJogo = Review & {
  jogo: Jogo | null;
};

type FavoritoComJogo = Favorito & {
  jogo: Jogo | null;
};

// PÁGINA DE PERFIL

export default function Perfil() {
  // AUTENTICAÇÃO

  const {
    user,
    autenticado,
    carregando: carregandoAuth,
  } = useAuth();

  // PERFIL

  const [username, setUsername] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [photoURL, setPhotoURL] =
    useState("");

  const [carregandoPerfil, setCarregandoPerfil] =
    useState(true);

  const [editarPerfil, setEditarPerfil] =
    useState(false);

  // REVIEWS

  const {
    carregarReviewsDoUsuario,
  } = useReviews(user?.uid);

  const [reviews, setReviews] =
    useState<ReviewComJogo[]>([]);

  const [carregandoReviews, setCarregandoReviews] =
    useState(true);

  // FAVORITOS

  const {
    carregarFavoritosDoUsuario,
  } = useFavorites(user?.uid);

  const [favoritos, setFavoritos] =
    useState<FavoritoComJogo[]>([]);

  const [carregandoFavoritos, setCarregandoFavoritos] =
    useState(true);

  // JOGOS

  const { buscarJogo } = useGames();

  // CARREGAR PERFIL

  useEffect(() => {
    async function carregarPerfil() {
      if (!user) {
        setCarregandoPerfil(false);
        return;
      }

      try {
        const perfil =
          await buscarPerfil(user.uid);

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
        }
      } catch {
        // Erro ao carregar perfil
      } finally {
        setCarregandoPerfil(false);
      }
    }

    carregarPerfil();
  }, [user]);

  // CARREGAR REVIEWS

  useEffect(() => {
    async function carregarReviews() {
      if (!user) {
        setCarregandoReviews(false);
        return;
      }

      try {
        setCarregandoReviews(true);

        const reviewsDoUsuario =
          await carregarReviewsDoUsuario(
            user.uid
          );

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

        setReviews(reviewsComJogos);
      } catch {
        setReviews([]);
      } finally {
        setCarregandoReviews(false);
      }
    }

    carregarReviews();
  }, [
    user,
    carregarReviewsDoUsuario,
    buscarJogo,
  ]);

  // CARREGAR FAVORITOS

  useEffect(() => {
    async function carregarFavoritos() {
      if (!user) {
        setCarregandoFavoritos(false);
        return;
      }

      try {
        setCarregandoFavoritos(true);

        const favoritosDoUsuario =
          await carregarFavoritosDoUsuario(
            user.uid
          );

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
    user,
    carregarFavoritosDoUsuario,
    buscarJogo,
  ]);

  // PROTEÇÃO DA PÁGINA

  if (carregandoAuth) {
    return (
      <p className="profile-message">
        Carregando...
      </p>
    );
  }

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // SALVAR PERFIL

  async function handleSalvarPerfil(
    novoNome: string,
    novaBio: string,
    novaFoto: File | null
  ) {
    if (!user) {
      return;
    }

    try {
      let novaPhotoURL = photoURL;

      if (novaFoto) {
        novaPhotoURL =
          await enviarFotoPerfil(
            novaFoto
          );
      }

      await atualizarPerfil(
        user.uid,
        novoNome,
        novaBio,
        novaPhotoURL
      );

      setUsername(novoNome);
      setBio(novaBio);
      setPhotoURL(novaPhotoURL);
      setEditarPerfil(false);
    } catch {
      // Erro ao atualizar perfil
    }
  }

  // TELA

  return (
    <div className="profile-page">
      {/* CABEÇALHO */}
      <Header
        mostrarPesquisa={false}
        mostrarFiltros={false}
        mostrarPerfil={false}
        mostrarLogout={true}
      />

      <main className="profile-content">
        <Profile
          username={username}
          bio={bio}
          photoURL={photoURL}
          onEdit={() =>
            setEditarPerfil(true)
          }
          mostrarEdicao={true}

          // FAVORITOS

          favoritos={
            carregandoFavoritos ? (
              <p className="profile-message">
                Carregando favoritos...
              </p>
            ) : favoritos.length === 0 ? (
              <p className="profile-empty">
                Você ainda não adicionou nenhum jogo aos favoritos.
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
                Você ainda não fez nenhuma review.
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

          caminhoFavoritos="/perfil/favoritos"
          caminhoReviews="/perfil/reviews"
        />

        {/*  CARREGANDO PERFIL */}

        {carregandoPerfil && (
          <p className="profile-message">
            Carregando informações...
          </p>
        )}

        {/* MODAL */}

        {editarPerfil && (
          <ProfileEditModal
            username={username}
            bio={bio}
            photoURL={photoURL}
            onClose={() =>
              setEditarPerfil(false)
            }
            onSave={handleSalvarPerfil}
          />
        )}
      </main>
    </div>
  );
}