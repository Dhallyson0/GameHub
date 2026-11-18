import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";


// Cadastrar usuário
export async function cadastrarUsuario(
  username: string,
  email: string,
  senha: string
) {
  const resultado =
    await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

  const user = resultado.user;


  // Criar perfil no Firestore
  await setDoc(
    doc(db, "users", user.uid),
    {
      username: username,
      bio: "",
      photoURL: "",
      createdAt: serverTimestamp(),
    }
  );


  return user;
}


// Login
export async function loginUsuario(
  email: string,
  senha: string
) {
  const resultado =
    await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );

  return resultado.user;
}


// Logout
export async function logoutUsuario() {
  await signOut(auth);
}