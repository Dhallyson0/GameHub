import { createContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";

import {
  cadastrarUsuario,
  loginUsuario,
  logoutUsuario,
} from "../services/auth";

import { auth } from "../services/firebase";

// TIPOS

type AuthContextType = {
  user: User | null;
  carregando: boolean;
  autenticado: boolean;

  cadastrar: (
    username: string,
    email: string,
    senha: string
  ) => Promise<User>;

  login: (
    email: string,
    senha: string
  ) => Promise<User>;

  logout: () => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

// CONTEXTO

export const AuthContext =
  createContext<AuthContextType | null>(null);

// PROVIDER

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  // VERIFICAR AUTENTICAÇÃO

  useEffect(() => {
    const cancelar = auth.onAuthStateChanged((usuario) => {
      setUser(usuario);
      setCarregando(false);
    });

    return cancelar;
  }, []);

  // CADASTRO

  async function cadastrar(
    username: string,
    email: string,
    senha: string
  ) {
    return await cadastrarUsuario(
      username,
      email,
      senha
    );
  }

  // LOGIN

  async function login(
    email: string,
    senha: string
  ) {
    return await loginUsuario(email, senha);
  }

  // LOGOUT

  async function logout() {
    await logoutUsuario();
  }

  // PROVIDER

  return (
    <AuthContext.Provider
      value={{
        user,
        carregando,
        autenticado: !!user,
        cadastrar,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}