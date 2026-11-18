import { useCallback, useState } from "react";

import {
  salvarFavorito,
  removerFavorito,
  verificarFavorito,
  buscarFavoritosDoUsuario,
  type Favorito,
} from "../services/favorites";

// HOOK DE FAVORITOS

export function useFavorites(
  userId?: string,
  gameId?: number
) {
  const [favoritado, setFavoritado] =
    useState(false);

  const [favoritos, setFavoritos] =
    useState<Favorito[]>([]);

  const [carregando, setCarregando] =
    useState(false);

  // VERIFICAR FAVORITO

  const verificar = useCallback(
    async () => {
      if (!userId || gameId === undefined) {
        return;
      }

      try {
        const resultado =
          await verificarFavorito(
            userId,
            gameId
          );

        setFavoritado(resultado);
      } catch {
        setFavoritado(false);
      }
    },
    [userId, gameId]
  );

  // ADICIONAR FAVORITO

  const adicionar = useCallback(
    async () => {
      if (!userId || gameId === undefined) {
        return;
      }

      try {
        setCarregando(true);

        await salvarFavorito(
          userId,
          gameId
        );

        setFavoritado(true);
      } catch {
        // Erro ao adicionar favorito
      } finally {
        setCarregando(false);
      }
    },
    [userId, gameId]
  );

  // REMOVER FAVORITO

  const remover = useCallback(
    async () => {
      if (!userId || gameId === undefined) {
        return;
      }

      try {
        setCarregando(true);

        await removerFavorito(
          userId,
          gameId
        );

        setFavoritado(false);
      } catch {
        // Erro ao remover favorito
      } finally {
        setCarregando(false);
      }
    },
    [userId, gameId]
  );

  // ALTERNAR FAVORITO

  const alternarFavorito = useCallback(
    async () => {
      if (favoritado) {
        await remover();
      } else {
        await adicionar();
      }
    },
    [
      favoritado,
      adicionar,
      remover,
    ]
  );

  // CARREGAR FAVORITOS

  const carregarFavoritosDoUsuario =
    useCallback(
      async (id: string) => {
        try {
          const resultado =
            await buscarFavoritosDoUsuario(id);

          setFavoritos(resultado);

          return resultado;
        } catch {
          return [];
        }
      },
      []
    );

  return {
    favoritado,
    favoritos,
    carregando,
    verificar,
    adicionar,
    remover,
    alternarFavorito,
    carregarFavoritosDoUsuario,
  };
}