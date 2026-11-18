import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import Header from "../components/Header";
import UserCard from "../components/UserCard";

import { db } from "../services/firebase";

import "../styles/usuarios.css";

type Usuario = {
  id: string;
  username: string;
  photoURL: string;
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // IDs de usuários que usam ícone padrão
  const [fotosComErro, setFotosComErro] = useState<string[]>([]);

  // BUSCAR USUÁRIOS

  useEffect(() => {
    let ativo = true;

    async function carregarUsuarios() {
      try {
        const snapshot =
          await getDocs(collection(db, "users"));

        const lista: Usuario[] =
          snapshot.docs.map((doc) => {
            const dados = doc.data();

            return {
              id: doc.id,
              username: dados.username || "",
              photoURL: dados.photoURL || "",
            };
          });

        if (ativo) {
          setUsuarios(lista);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar usuários:",
          error
        );

        if (ativo) {
          setErro(
            "Não foi possível carregar os usuários."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarUsuarios();

    return () => {
      ativo = false;
    };
  }, []);

  // PESQUISA

  const usuariosFiltrados =
    usuarios.filter((usuario) =>
      usuario.username
        .toLowerCase()
        .includes(
          pesquisa.trim().toLowerCase()
        )
    );

  return (
    <div className="usuarios-page">

      <Header
        mostrarPesquisa={true}
        onSearch={setPesquisa}
        placeholder="Pesquisar usuários..."
        mostrarFiltros={false}
        mostrarPerfil={true}
        mostrarLogout={false}
        mostrarUsuarios={false}
      />

      <main className="usuarios-content">

        <h1 className="usuarios-title">
          Outros girinos nadando na lagoa...
        </h1>

        {carregando ? (
          <p className="usuarios-message">
            Carregando usuários...
          </p>
        ) : erro ? (
          <p className="usuarios-message usuarios-error">
            {erro}
          </p>
        ) : usuariosFiltrados.length === 0 ? (
          <p className="usuarios-message">
            Nenhum usuário encontrado.
          </p>
        ) : (
          <section className="usuarios-grid">
            {usuariosFiltrados.map((usuario) => (
              <UserCard
                key={usuario.id}
                id={usuario.id}
                username={usuario.username}
                photoURL={usuario.photoURL}
                fotoComErro={fotosComErro.includes(
                  usuario.id
                )}
                onFotoErro={() =>
                  setFotosComErro((anteriores) => [
                    ...anteriores,
                    usuario.id,
                  ])
                }
              />
            ))}
          </section>
        )}

      </main>
    </div>
  );
}