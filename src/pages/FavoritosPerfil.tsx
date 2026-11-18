import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import GameCard from "../components/GameCard";

import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { useGames, type Jogo } from "../hooks/useGames";

import type { Favorito } from "../services/favorites";

import "../styles/profile.css";

// TIPOS

type FavoritoComJogo = Favorito & {
  jogo: Jogo | null;
};

// PÁGINA DE FAVORITOS

export default function FavoritosPerfil() {
  // AUTENTICAÇÃO

  const { user } = useAuth();

  // ID DO USUÁRIO

  const { id } = useParams();

  const usuarioId = id || user?.uid;

  // FAVORITOS

  const {
    carregarFavoritosDoUsuario,
  } = useFavorites(usuarioId);

  const [favoritos, setFavoritos] =
    useState<FavoritoComJogo[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  // JOGOS

  const { buscarJogo } = useGames();

  // CARREGAR FAVORITOS

  useEffect(() => {
    async function carregarFavoritos() {
      if (!usuarioId) {
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);

        const favoritosDoUsuario =
          await carregarFavoritosDoUsuario(usuarioId);

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

        setFavoritos(favoritosComJogos);
      } catch (error) {
        console.error(
          "Erro ao carregar favoritos:",
          error
        );

        setFavoritos([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarFavoritos();
  }, [
    usuarioId,
    carregarFavoritosDoUsuario,
    buscarJogo,
  ]);

  // PROTEÇÃO

  if (!id && !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // TELA

  const perfilProprio =
    !id || id === user?.uid;

  return (
    <div className="profile-page">
      <Header
        mostrarPesquisa={false}
        mostrarFiltros={false}
        mostrarPerfil={!perfilProprio}
        mostrarLogout={perfilProprio}
      />

      <main className="profile-content">
        <section className="profile-section">
          <div className="profile-section-title">
            <h2>
              {perfilProprio
                ? "Meus favoritos:"
                : "Favoritos do perfil:"}
            </h2>
          </div>

          <div className="profile-divider" />

          {carregando ? (
            <p className="profile-message">
              Carregando favoritos...
            </p>
          ) : favoritos.length === 0 ? (
            <p className="profile-empty">
              {perfilProprio
                ? "Você ainda não adicionou nenhum jogo aos favoritos."
                : "Este usuário ainda não adicionou nenhum jogo aos favoritos."}
            </p>
          ) : (
            <div className="profile-games">
              {favoritos.map((favorito) => {
                if (!favorito.jogo) {
                  return null;
                }

                return (
                  <GameCard
                    key={favorito.id}
                    jogo={favorito.jogo}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}