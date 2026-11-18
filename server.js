import "dotenv/config";

import express from "express";
import cors from "cors";

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// CONFIGURAÇÃO

const app = express();

const PORT = process.env.PORT || 3000;

// MIDDLEWARES

app.use(cors());

app.use(express.json());

// FIREBASE

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,

    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    ),
  }),
});

const db = getFirestore();

// TWITCH / IGDB

let twitchAccessToken = null;

// PEGAR TOKEN DA TWITCH

async function getTwitchToken() {
  const response = await fetch(
    "https://id.twitch.tv/oauth2/token",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        client_id:
          process.env.TWITCH_CLIENT_ID,

        client_secret:
          process.env.TWITCH_CLIENT_SECRET,

        grant_type:
          "client_credentials",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao autenticar na Twitch."
    );
  }

  const data = await response.json();

  twitchAccessToken = data.access_token;

  return twitchAccessToken;
}

// ROTA PRINCIPAL

app.get("/", (req, res) => {
  res.json({
    message:
      "Servidor do GameHub funcionando!",
  });
});

// TESTAR FIRESTORE

app.get(
  "/api/test-db",
  async (req, res) => {
    try {
      const snapshot = await db
        .collection("users")
        .limit(1)
        .get();

      res.json({
        connected: true,
        documentsFound: snapshot.size,
      });
    } catch (error) {
      console.error(
        "Erro ao conectar ao Firestore."
      );

      res.status(500).json({
        connected: false,
        error: "Erro ao conectar ao banco de dados.",
      });
    }
  }
);

// BUSCAR JOGOS NA IGDB

app.get(
  "/api/games/search",
  async (req, res) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          error:
            "Digite o nome de um jogo.",
        });
      }

      const token =
        await getTwitchToken();

      const resposta = await fetch(
        "https://api.igdb.com/v4/games",
        {
          method: "POST",

          headers: {
            "Client-ID":
              process.env.TWITCH_CLIENT_ID,

            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "text/plain",
          },

          body: `
            search "${q}";

            fields
              id,
              name,
              cover.url,
              summary,
              first_release_date,
              rating,
              genres.name;

            where cover != null & rating != null;

            limit 20;
          `,
        }
      );

      if (!resposta.ok) {
        console.error(
          "Erro ao buscar jogos no IGDB."
        );

        return res.status(500).json({
          error:
            "Erro ao buscar jogos no IGDB.",
        });
      }

      const jogos =
        await resposta.json();

      res.json(jogos);
    } catch (error) {
      console.error(
        "Erro na busca de jogos."
      );

      res.status(500).json({
        error:
          "Erro no servidor.",
      });
    }
  }
);

// JOGOS DA HOME

app.get(
  "/api/games/home",
  async (req, res) => {
    try {
      const token =
        await getTwitchToken();

      const resposta = await fetch(
        "https://api.igdb.com/v4/games",
        {
          method: "POST",

          headers: {
            "Client-ID":
              process.env.TWITCH_CLIENT_ID,

            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "text/plain",
          },

          body: `
            fields
              id,
              name,
              cover.url,
              summary,
              first_release_date,
              rating,
              genres.name,
              age_ratings.rating,
              age_ratings.category;

            where
              cover != null &
              rating != null;

            offset 100;
            limit 100;
          `,
        }
      );

      if (!resposta.ok) {
        console.error(
          "Erro ao buscar jogos da home no IGDB."
        );

        return res.status(500).json({
          error:
            "Erro ao buscar jogos no IGDB.",
        });
      }

      const jogos =
        await resposta.json();

      // REMOVER JOGOS COM CLASSIFICAÇÃO 18+
      const jogosFiltrados =
        jogos.filter((jogo) => {
          if (!jogo.age_ratings) {
            return true;
          }

          return !jogo.age_ratings.some(
            (classificacao) =>
              classificacao.rating === 18
          );
        });

      res.json(jogosFiltrados);

    } catch (error) {
      console.error(
        "Erro ao carregar jogos da home."
      );

      res.status(500).json({
        error:
          "Erro no servidor.",
      });
    }
  }
);

// BUSCAR UM JOGO PELO ID

app.get(
  "/api/games/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const token =
        await getTwitchToken();

      const resposta = await fetch(
        "https://api.igdb.com/v4/games",
        {
          method: "POST",

          headers: {
            "Client-ID":
              process.env.TWITCH_CLIENT_ID,

            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "text/plain",
          },

          body: `
            fields
              id,
              name,
              cover.url,
              artworks.url,
              screenshots.url,
              summary,
              first_release_date,
              rating,
              genres.name,
              involved_companies.developer,
              involved_companies.company.name,
              platforms.name;

            where id = ${id};

            limit 1;
          `,
        }
      );

      if (!resposta.ok) {
        console.error(
          "Erro ao buscar jogo no IGDB."
        );

        return res.status(500).json({
          error:
            "Erro ao buscar jogo no IGDB.",
        });
      }

      const jogos =
        await resposta.json();

      if (jogos.length === 0) {
        return res.status(404).json({
          error:
            "Jogo não encontrado.",
        });
      }

      res.json(jogos[0]);
    } catch (error) {
      console.error(
        "Erro ao buscar jogo."
      );

      res.status(500).json({
        error:
          "Erro no servidor.",
      });
    }
  }
);

// INICIAR SERVIDOR

app.listen(PORT, () => {
  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );
});