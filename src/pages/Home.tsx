import { useEffect, useState } from "react";

import Header from "../components/Header";
import GameCard from "../components/GameCard";
import { useGames } from "../hooks/useGames";

import "../styles/home.css";

// MAPA DE GÊNEROS

const mapaGeneros: Record<string, string> = {
  "Ação": "Action",
  "Terror": "Horror",
  "Aventura": "Adventure",
  "RPG": "Role-playing",
  "Estratégia": "Strategy",
  "Corrida": "Racing",
  "Esporte": "Sport",
  "Simulação": "Simulator",
  "Puzzle": "Puzzle",
  "Sobrevivência": "Survival",
};

// HOME

export default function Home() {
  const {
    jogos,
    carregando,
    erro,
    carregarJogosHome,
    buscarJogos,
  } = useGames();

  const [generosSelecionados, setGenerosSelecionados] =
    useState<string[]>([]);

  // CARREGAR JOGOS

  useEffect(() => {
    carregarJogosHome();
  }, []);

  // FILTRAR POR GÊNERO

  const jogosFiltrados =
    generosSelecionados.length === 0
      ? jogos
      : jogos.filter((jogo) =>
          generosSelecionados.every((generoSelecionado) => {
            const generoIGDB =
              mapaGeneros[generoSelecionado];

            return jogo.genres?.some(
              (genero) =>
                genero.name === generoIGDB
            );
          })
        );

  // JOGOS EXIBIDOS

  const jogosExibidos = [...jogosFiltrados]
    .sort(() => Math.random() - 0.5)
    .slice(0, 30);

  return (
    <div className="home-page">
      {/* CABEÇALHO */}
      <Header
        mostrarPesquisa={true}
        onSearch={buscarJogos}
        placeholder="Pesquisar jogos..."
        mostrarFiltros={true}
        generosSelecionados={generosSelecionados}
        onGeneroChange={setGenerosSelecionados}
        mostrarPerfil={true}
        mostrarLogout={false}
      />

      <main className="home-content">
        {/* TÍTULO */}
        <section className="home-title">
          <h1>Bem vindo de volta!</h1>

          <p>
            Já pule as ultimas novidades...
          </p>
        </section>

        {/* CARREGANDO */}
        {carregando && (
          <p className="home-message">
            Carregando jogos...
          </p>
        )}

        {/* ERRO */}
        {erro && (
          <p className="home-error">
            {erro}
          </p>
        )}

        {/* JOGOS */}
        {!carregando && !erro && (
          <section className="games-grid">
            {jogosExibidos.map((jogo) => (
              <GameCard
                key={jogo.id}
                jogo={jogo}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}