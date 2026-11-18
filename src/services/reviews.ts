import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

export type Review = {
  id: string;
  userId: string;
  gameId: number;
  rating: number;
  text: string;
  username: string;
  photoURL: string;
  createdAt?: any;
  updatedAt?: any;
};


// ========================================
// SALVAR REVIEW
// ========================================

export async function salvarReview(
  userId: string,
  gameId: number,
  rating: number,
  text: string
) {
  const reviewId = `${userId}_${gameId}`;

  const reviewRef = doc(db, "reviews", reviewId);

  const reviewExistente = await getDoc(reviewRef);

  if (reviewExistente.exists()) {
    await setDoc(
      reviewRef,
      {
        rating,
        text,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } else {
    await setDoc(reviewRef, {
      userId,
      gameId,
      rating,
      text,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}


// ========================================
// BUSCAR REVIEWS DE UM JOGO
// ========================================

export async function buscarReviewsDoJogo(
  gameId: number
): Promise<Review[]> {
  const reviewsRef = collection(db, "reviews");

  const consulta = query(
    reviewsRef,
    where("gameId", "==", gameId)
  );

  const snapshot = await getDocs(consulta);

  const reviews = await Promise.all(
    snapshot.docs.map(async (reviewDoc) => {
      const dados = reviewDoc.data();

      let username = "Usuário";
      let photoURL = "";

      // Busca o perfil do usuário
      if (dados.userId) {
        const userRef = doc(
          db,
          "users",
          dados.userId
        );

        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const usuario = userSnapshot.data();

          username = usuario.username || "Usuário";
          photoURL = usuario.photoURL || "";
        }
      }

      return {
        id: reviewDoc.id,
        userId: dados.userId,
        gameId: dados.gameId,
        rating: dados.rating,
        text: dados.text,
        username,
        photoURL,
        createdAt: dados.createdAt,
        updatedAt: dados.updatedAt,
      };
    })
  );

  return reviews;
}


// ========================================
// BUSCAR MINHA REVIEW
// ========================================

export async function buscarMinhaReview(
  userId: string,
  gameId: number
) {
  const reviewId = `${userId}_${gameId}`;

  const reviewRef = doc(
    db,
    "reviews",
    reviewId
  );

  const snapshot = await getDoc(reviewRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}


// ========================================
// BUSCAR REVIEWS DO USUÁRIO
// ========================================

export async function buscarReviewsDoUsuario(
  userId: string
): Promise<Review[]> {
  const reviewsRef = collection(db, "reviews");

  const consulta = query(
    reviewsRef,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(consulta);

  const reviews = await Promise.all(
    snapshot.docs.map(async (reviewDoc) => {
      const dados = reviewDoc.data();

      let username = "Usuário";
      let photoURL = "";

      const userRef = doc(
        db,
        "users",
        userId
      );

      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const usuario = userSnapshot.data();

        username = usuario.username || "Usuário";
        photoURL = usuario.photoURL || "";
      }

      return {
        id: reviewDoc.id,
        userId: dados.userId,
        gameId: dados.gameId,
        rating: dados.rating,
        text: dados.text,
        username,
        photoURL,
        createdAt: dados.createdAt,
        updatedAt: dados.updatedAt,
      };
    })
  );

  return reviews;
}


// ========================================
// REMOVER REVIEW
// ========================================

export async function removerReview(
  userId: string,
  gameId: number
) {
  const reviewId = `${userId}_${gameId}`;

  await deleteDoc(
    doc(db, "reviews", reviewId)
  );
}