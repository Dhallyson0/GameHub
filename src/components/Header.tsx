import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import sapo from "../assets/img/sapo.png";
import filtro from "../assets/icons/filtro.png";
import logoutIcon from "../assets/icons/logout.png";
import usuariosIcon from "../assets/icons/usuarios.png";

import { useAuth } from "../hooks/useAuth";
import { buscarPerfil } from "../services/profile";

import "../styles/ComponentHeader.css";

// PROPS

type HeaderProps = {
  mostrarPesquisa?: boolean;
  onSearch?: (texto: string) => void;
  placeholder?: string;

  mostrarFiltros?: boolean;
  generosSelecionados?: string[];
  onGeneroChange?: (generos: string[]) => void;

  mostrarUsuarios?: boolean;
  mostrarPerfil?: boolean;
  mostrarLogout?: boolean;
};

// GÊNEROS

const generos = [
  "Ação",
  "Terror",
  "Aventura",
  "RPG",
  "Estratégia",
  "Corrida",
  "Esporte",
  "Simulação",
  "Puzzle",
  "Sobrevivência",
];

// COMPONENTE

export default function Header({
  mostrarPesquisa = true,
  onSearch = () => {},
  placeholder = "Pesquisar jogos...",

  mostrarFiltros = false,
  generosSelecionados = [],
  onGeneroChange = () => {},

  mostrarUsuarios = true,
  mostrarPerfil = true,
  mostrarLogout = false,
}: HeaderProps) {
  const [pesquisa, setPesquisa] = useState("");
  const [filtrosAberto, setFiltrosAberto] =
    useState(false);
  const [photoURL, setPhotoURL] = useState("");

  const navigate = useNavigate();

  const {
    autenticado,
    carregando,
    user,
    logout,
  } = useAuth();

  // CARREGAR FOTO DO PERFIL

  useEffect(() => {
    async function carregarFotoPerfil() {
      if (!user) {
        setPhotoURL("");
        return;
      }

      try {
        const perfil =
          await buscarPerfil(user.uid);

        if (perfil?.photoURL) {
          setPhotoURL(perfil.photoURL);
        } else {
          setPhotoURL("");
        }
      } catch {
        setPhotoURL("");
      }
    }

    carregarFotoPerfil();
  }, [user]);

  // PESQUISA

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(pesquisa);
  }

  // FILTROS

  function handleGenero(genero: string) {
    if (generosSelecionados.includes(genero)) {
      onGeneroChange(
        generosSelecionados.filter(
          (item) => item !== genero
        )
      );
    } else {
      onGeneroChange([
        ...generosSelecionados,
        genero,
      ]);
    }
  }

  // LOGOUT

  async function handleLogout() {
    navigate("/", { replace: true });
    await logout();
  }

  return (
    <header className="home-header">
      <div className="header-content">

        {/* LOGO */}
        <Link
          to="/"
          className="header-logo"
        >
          <img
            src={sapo}
            alt="GameHub"
          />
        </Link>

        {/* PESQUISA */}
        {mostrarPesquisa && (
          <form
            className="header-search"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder={placeholder}
              value={pesquisa}
              onChange={(e) =>
                setPesquisa(e.target.value)
              }
            />

            <button type="submit">
              🔍
            </button>
          </form>
        )}

        {/* FILTROS */}
        {mostrarFiltros && (
          <div className="header-filter-container">
            <button
              type="button"
              className="header-filter"
              onClick={() =>
                setFiltrosAberto(!filtrosAberto)
              }
            >
              <img
                src={filtro}
                alt="Filtros"
              />
            </button>

            {filtrosAberto && (
              <div className="filter-menu">
                <h3>Filtros</h3>

                <p>Gêneros</p>

                <div className="filter-genres">
                  {generos.map((genero) => (
                    <label
                      key={genero}
                      className="filter-option"
                    >
                      <input
                        type="checkbox"
                        checked={generosSelecionados.includes(
                          genero
                        )}
                        onChange={() =>
                          handleGenero(genero)
                        }
                      />

                      <span>{genero}</span>
                    </label>
                  ))}
                </div>

                {generosSelecionados.length > 0 && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() =>
                      onGeneroChange([])
                    }
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* USUÁRIOS */}
        {mostrarUsuarios &&
          autenticado &&
          !carregando && (
            <Link
              to="/usuarios"
              className="header-users"
              title="Procurar usuários"
            >
              <img
                src={usuariosIcon}
                alt="Usuários"
              />
            </Link>
          )}

        {/* LOGOUT */}
        {mostrarLogout &&
          autenticado &&
          !carregando && (
            <button
              type="button"
              className="header-logout"
              onClick={handleLogout}
            >
              <img
                src={logoutIcon}
                alt="Sair"
              />
            </button>
          )}

        {/* PERFIL */}
        {mostrarPerfil &&
          !mostrarLogout &&
          !carregando &&
          (
            autenticado ? (
              <Link
                to="/perfil"
                className="header-profile"
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Perfil"
                    className="header-profile-image"
                  />
                ) : (
                  <span className="header-profile-default">
                    👤
                  </span>
                )}
              </Link>
            ) : (
              <div className="header-auth">
                <Link
                  to="/login"
                  className="header-login"
                >
                  Entrar
                </Link>

                <Link
                  to="/cadastro"
                  className="header-register"
                >
                  Criar conta
                </Link>
              </div>
            )
          )}

      </div>
    </header>
  );
}