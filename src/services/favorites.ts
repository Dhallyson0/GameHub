import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export type Favorito = {
  id: string;
  userId: string;
  gameId: number;
  createdAt?: any;
};

export async function salvarFavorito(
  userId: string,
  gameId: number
) {
  const favoritoId = `${userId}_${gameId}`;

  await setDoc(
    doc(db, "favorites", favoritoId),
    {
      userId,
      gameId,
      createdAt: serverTimestamp(),
    }
  );
}

export async function removerFavorito(
  userId: string,
  gameId: number
) {
  const favoritoId = `${userId}_${gameId}`;

  await deleteDoc(
    doc(db, "favorites", favoritoId)
  );
}

export async function verificarFavorito(
  userId: string,
  gameId: number
) {
  const favoritoId = `${userId}_${gameId}`;

  const favoritosRef = collection(
    db,
    "favorites"
  );

  const consulta = query(
    favoritosRef,
    where("userId", "==", userId),
    where("gameId", "==", gameId)
  );

  const snapshot = await getDocs(consulta);

  return !snapshot.empty;
}

export async function buscarFavoritosDoUsuario(
  userId: string
): Promise<Favorito[]> {
  const favoritosRef = collection(
    db,
    "favorites"
  );

  const consulta = query(
    favoritosRef,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(consulta);

  return snapshot.docs.map((favorito) => {
    const dados = favorito.data();

    return {
      id: favorito.id,
      userId: dados.userId,
      gameId: dados.gameId,
      createdAt: dados.createdAt,
    };
  });
}