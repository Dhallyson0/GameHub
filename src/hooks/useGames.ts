import {
  useCallback,
  useState,
} from "react";

// TIPOS

export type Jogo = {
  id: number;
  name: string;

  cover?: {
    url: string;
  };

  artworks?: {
    url: string;
  }[];

  screenshots?: {
    url: string;
  }[];

  summary?: string;
  first_release_date?: number;
  rating?: number;

  genres?: {
    name: string;
  }[];

  involved_companies?: {
    developer?: boolean;
    company?: {
      name: string;
    };
  }[];

  platforms?: {
    name: string;
  }[];
};

// HOOK DE JOGOS

export function useGames() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // CARREGAR JOGOS DA HOME

  const carregarJogosHome = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(
        "http://localhost:3000/api/games/home"
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar jogos");
      }

      const dados = await resposta.json();

      // Remove jogos sem capa, sem nota e duplicados
      const jogosValidos = dados
        .filter(
          (jogo: Jogo) =>
            jogo.cover?.url &&
            jogo.rating !== undefined &&
            jogo.rating !== null
        )
        .filter(
          (jogo: Jogo, index: number, lista: Jogo[]) =>
            lista.findIndex(
              (outroJogo: Jogo) =>
                outroJogo.name.trim().toLowerCase() ===
                jogo.name.trim().toLowerCase()
            ) === index
        );

      setJogos(jogosValidos);
    } catch {
      setErro("Não foi possível carregar os jogos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  // BUSCAR JOGOS

  const buscarJogos = useCallback(
    async (nome: string) => {
      if (!nome.trim()) {
        await carregarJogosHome();
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const resposta = await fetch(
          `http://localhost:3000/api/games/search?q=${encodeURIComponent(
            nome
          )}`
        );

        if (!resposta.ok) {
          throw new Error("Erro ao buscar jogos");
        }

        const dados = await resposta.json();

        // Remove jogos sem capa, sem nota e duplicados
        const jogosValidos = dados
          .filter(
            (jogo: Jogo) =>
              jogo.cover?.url &&
              jogo.rating !== undefined &&
              jogo.rating !== null
          )
          .filter(
            (jogo: Jogo, index: number, lista: Jogo[]) =>
              lista.findIndex(
                (outroJogo: Jogo) =>
                  outroJogo.name.trim().toLowerCase() ===
                  jogo.name.trim().toLowerCase()
              ) === index
          );

        setJogos(jogosValidos);
      } catch {
        setErro("Não foi possível buscar os jogos.");
      } finally {
        setCarregando(false);
      }
    },
    [carregarJogosHome]
  );

  // BUSCAR JOGO POR ID

  const buscarJogo = useCallback(
    async (id: number) => {
      setCarregando(true);
      setErro("");

      try {
        const resposta = await fetch(
          `http://localhost:3000/api/games/${id}`
        );

        if (!resposta.ok) {
          throw new Error("Erro ao buscar jogo");
        }

        const jogo = await resposta.json();

        return jogo as Jogo;
      } catch {
        setErro("Não foi possível carregar o jogo.");

        return null;
      } finally {
        setCarregando(false);
      }
    },
    []
  );

  return {
    jogos,
    carregando,
    erro,
    carregarJogosHome,
    buscarJogos,
    buscarJogo,
  };
}