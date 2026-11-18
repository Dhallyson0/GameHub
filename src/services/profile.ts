import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function buscarPerfil(userId: string) {
  const referencia = doc(
    db,
    "users",
    userId
  );

  const resultado = await getDoc(
    referencia
  );

  if (!resultado.exists()) {
    return null;
  }

  return resultado.data();
}

export async function atualizarPerfil(
  userId: string,
  username: string,
  bio: string,
  photoURL?: string
) {
  const referencia = doc(db, "users", userId);

  const dados: {
    username: string;
    bio: string;
    photoURL?: string;
  } = {
    username,
    bio,
  };

  if (photoURL !== undefined) {
    dados.photoURL = photoURL;
  }

  await updateDoc(referencia, dados);
}