import { useCallback, useState } from "react";

import {
  buscarMinhaReview,
  buscarReviewsDoJogo,
  buscarReviewsDoUsuario,
  removerReview,
  salvarReview,
  type Review,
} from "../services/reviews";

// HOOK DE REVIEWS

export function useReviews(
  userId?: string,
  gameId?: number
) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [minhaReview, setMinhaReview] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  // REVIEWS DO JOGO

  const carregarReviewsDoJogo = useCallback(
    async () => {
      if (gameId === undefined) {
        return;
      }

      setCarregando(true);

      try {
        const resultado =
          await buscarReviewsDoJogo(gameId);

        setReviews(resultado);
      } catch {
        // Erro ao carregar reviews
      } finally {
        setCarregando(false);
      }
    },
    [gameId]
  );

  // MINHA REVIEW

  const carregarMinhaReview = useCallback(
    async () => {
      if (!userId || gameId === undefined) {
        return;
      }

      try {
        const resultado =
          await buscarMinhaReview(
            userId,
            gameId
          );

        setMinhaReview(resultado);
      } catch {
        // Erro ao carregar minha review
      }
    },
    [userId, gameId]
  );

  // SALVAR REVIEW

  const salvar = useCallback(
    async (
      rating: number,
      text: string
    ) => {
      if (!userId || gameId === undefined) {
        return;
      }

      await salvarReview(
        userId,
        gameId,
        rating,
        text
      );

      await carregarReviewsDoJogo();
      await carregarMinhaReview();
    },
    [
      userId,
      gameId,
      carregarReviewsDoJogo,
      carregarMinhaReview,
    ]
  );

  // REMOVER REVIEW

  const remover = useCallback(
    async () => {
      if (!userId || gameId === undefined) {
        return;
      }

      await removerReview(
        userId,
        gameId
      );

      setMinhaReview(null);

      await carregarReviewsDoJogo();
    },
    [
      userId,
      gameId,
      carregarReviewsDoJogo,
    ]
  );

  // REVIEWS DO PERFIL

  const carregarReviewsDoUsuario =
    useCallback(
      async (id: string) => {
        setCarregando(true);

        try {
          return await buscarReviewsDoUsuario(id);
        } catch {
          return [];
        } finally {
          setCarregando(false);
        }
      },
      []
    );

  return {
    reviews,
    minhaReview,
    carregando,
    salvar,
    remover,
    carregarReviewsDoJogo,
    carregarMinhaReview,
    carregarReviewsDoUsuario,
  };
}