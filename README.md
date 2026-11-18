# Desenvolvedores

* Dhallyson Breno Carvalho da Silva - 01797597
* Joanne Alexandrino Floriano de Oliveira - 01800675
* Raphael Pereira da Silva - 01797315
* Victor Davi Costa Amaral e Sousa - 01800467

# GameHub

O **GameHub** é uma plataforma web para descoberta, pesquisa e avaliação de jogos. A aplicação permite que usuários encontrem jogos, visualizem informações detalhadas, adicionem jogos aos favoritos e publiquem avaliações.

O projeto utiliza React e TypeScript no frontend, Node.js e Express no backend, Firebase para autenticação e armazenamento de dados e a API IGDB para obter informações sobre jogos.

---

## 1. Sobre o projeto

O GameHub foi desenvolvido com o objetivo de criar uma plataforma onde usuários possam descobrir novos jogos e compartilhar suas opiniões com outros jogadores.

A aplicação possui um sistema de usuários, permitindo a criação de contas, login, edição de perfil, visualização de outros usuários, favoritos e avaliações.

As informações dos jogos são obtidas através da API da IGDB, enquanto os dados relacionados aos usuários são armazenados no Firebase Firestore.

---

## 2. Objetivos

O projeto possui os seguintes objetivos:

- Criar uma plataforma para descoberta de jogos.
- Permitir a pesquisa de jogos.
- Exibir informações detalhadas sobre os jogos.
- Permitir avaliações dos usuários.
- Permitir adicionar e remover jogos dos favoritos.
- Criar perfis de usuários.
- Permitir a visualização de perfis públicos.
- Integrar uma API externa de jogos.
- Utilizar React e TypeScript na construção da interface.
- Utilizar Hooks personalizados para organizar a lógica da aplicação.
- Utilizar Firebase para autenticação e armazenamento de dados.
- Desenvolver uma API própria utilizando Node.js e Express.

---

## 3. Funcionalidades

### 3.1 Jogos

O sistema permite:

- Visualizar jogos na página inicial.
- Pesquisar jogos pelo nome.
- Filtrar jogos por gênero.
- Visualizar informações detalhadas de um jogo.
- Visualizar capa do jogo.
- Visualizar imagens adicionais.
- Visualizar data de lançamento.
- Visualizar nota da IGDB.
- Visualizar gêneros.
- Visualizar desenvolvedora.
- Visualizar plataformas.
- Visualizar sinopse.
- Visualizar avaliações da comunidade.

---

### 3.2 Pesquisa

A aplicação possui uma barra de pesquisa para encontrar jogos pelo nome.

O frontend envia a pesquisa para o backend através da rota:

```text
/api/games/search?q=nome
```

O backend realiza a consulta na IGDB e retorna os resultados para o frontend.

Quando a pesquisa está vazia, o sistema volta a carregar os jogos da página inicial.

---

### 3.3 Filtros

A página inicial possui filtros por gênero.

Os gêneros disponíveis são:

- Ação
- Terror
- Aventura
- RPG
- Estratégia
- Corrida
- Esporte
- Simulação
- Puzzle
- Sobrevivência

É possível selecionar vários gêneros ao mesmo tempo.

Quando mais de um gênero é selecionado, o sistema utiliza uma lógica AND. Dessa forma, o jogo precisa possuir todos os gêneros selecionados para aparecer no resultado.

---

### 3.4 Usuários

O GameHub possui um sistema de autenticação utilizando Firebase Authentication.

Os usuários podem:

- Criar uma conta.
- Fazer login.
- Fazer logout.
- Editar o perfil.
- Alterar o nome de usuário.
- Alterar a biografia.
- Alterar a foto de perfil.
- Visualizar outros usuários.
- Acessar perfis públicos.

---

### 3.5 Favoritos

Usuários autenticados podem adicionar jogos aos favoritos.

Os favoritos são associados à conta do usuário e podem ser visualizados no perfil.

Também é possível remover um jogo dos favoritos.

---

### 3.6 Reviews

Usuários autenticados podem publicar avaliações sobre os jogos.

Cada avaliação possui:

- Nota.
- Texto.
- Usuário responsável pela avaliação.
- Jogo avaliado.

As avaliações são exibidas na página do jogo e também podem ser visualizadas no perfil do usuário.

---

## 4. Tecnologias utilizadas

### Frontend

- React
- TypeScript
- Vite
- React Router
- CSS

### Backend

- Node.js
- Express
- CORS
- dotenv

### Banco de dados e autenticação

- Firebase Authentication
- Firebase Firestore
- Firebase Admin SDK

### API de jogos

- IGDB API
- Twitch OAuth

### Armazenamento de imagens

- Cloudinary

---

## 5. Estrutura do projeto

```text
GameHub/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   │
│   ├── assets/
│   │   ├── icons/
│   │   │   ├── filtro.png
│   │   │   ├── logout.png
│   │   │   ├── seta.png
│   │   │   └── usuarios.png
│   │   │
│   │   └── img/
│   │       └── sapo.png
│   │
│   ├── components/
│   │   ├── FormInput.tsx
│   │   ├── GameCard.tsx
│   │   ├── Header.tsx
│   │   ├── Profile.tsx
│   │   ├── ProfileEditModal.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewList.tsx
│   │   └── UserCard.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFavorites.ts
│   │   ├── useGames.ts
│   │   └── useReviews.ts
│   │
│   ├── pages/
│   │   ├── Cadastro.tsx
│   │   ├── FavoritosPerfil.tsx
│   │   ├── Home.tsx
│   │   ├── jogos.tsx
│   │   ├── Login.tsx
│   │   ├── Perfil.tsx
│   │   ├── PerfilUsuario.tsx
│   │   ├── ReviewsPerfil.tsx
│   │   └── Usuarios.tsx
│   │
│   ├── services/
│   │   ├── auth.ts
│   │   ├── favorites.ts
│   │   ├── firebase.ts
│   │   ├── profile.ts
│   │   ├── profileStorage.ts
│   │   └── reviews.ts
│   │
│   ├── styles/
│   │   ├── auth.css
│   │   ├── ComponentFormInput.css
│   │   ├── ComponentGameCard.css
│   │   ├── ComponentHeader.css
│   │   ├── ComponentProfile.css
│   │   ├── ComponentProfileEditModal.css
│   │   ├── ComponentReviewForm.css
│   │   ├── ComponentReviewList.css
│   │   ├── ComponentUserCard.css
│   │   ├── FavoritosPerfil.css
│   │   ├── game.css
│   │   ├── home.css
│   │   ├── profile.css
│   │   ├── ReviewsPerfil.css
│   │   └── usuarios.css
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## 6. Componentes

O projeto utiliza componentes reutilizáveis para dividir a interface em partes menores.

### FormInput

Componente reutilizável para campos de formulário.

É utilizado nas telas de login e cadastro.

### GameCard

Responsável por apresentar as informações básicas de um jogo em formato de card.

### Header

Responsável pelo cabeçalho da aplicação.

Possui funcionalidades como:

- Pesquisa.
- Filtros.
- Acesso ao perfil.
- Logout.

### Profile

Responsável pela apresentação das informações do perfil do usuário.

### ProfileEditModal

Modal utilizado para editar:

- Nome de usuário.
- Biografia.
- Foto de perfil.

### ReviewForm

Formulário utilizado para criar uma avaliação.

### ReviewList

Responsável por exibir as avaliações dos usuários.

### UserCard

Responsável por apresentar informações básicas de um usuário na lista de usuários.

---

## 7. Hooks personalizados

O projeto utiliza Hooks personalizados para separar a lógica da interface.

### useAuth

Responsável pela autenticação dos usuários.

Entre suas responsabilidades estão:

- Login.
- Cadastro.
- Logout.
- Verificação do usuário autenticado.
- Acesso aos dados do usuário atual.

---

### useGames

Responsável pela lógica relacionada aos jogos.

Principais funções:

```text
carregarJogosHome()
buscarJogos()
buscarJogo()
```

Também controla:

- Lista de jogos.
- Estado de carregamento.
- Mensagens de erro.

O Hook realiza as requisições para o backend e trata os resultados antes de disponibilizá-los para as páginas.

---

### useFavorites

Responsável pelo sistema de favoritos.

Entre suas funções estão:

- Verificar se um jogo está favoritado.
- Adicionar um jogo aos favoritos.
- Remover um jogo dos favoritos.
- Buscar favoritos de um usuário.

---

### useReviews

Responsável pelo sistema de avaliações.

Permite:

- Criar reviews.
- Buscar reviews de um jogo.
- Buscar reviews de um usuário.

---

## 8. Autenticação

A autenticação é realizada através do Firebase Authentication.

O usuário pode criar uma conta utilizando e-mail e senha.

Depois do cadastro, o usuário pode realizar login utilizando suas credenciais.

O estado de autenticação é compartilhado através do `AuthContext`.

---

## 9. Firebase

O Firebase é utilizado principalmente para:

- Autenticação.
- Firestore.

O Firestore armazena informações relacionadas aos usuários, favoritos e reviews.

O backend utiliza o Firebase Admin SDK para acessar o Firestore.

Fluxo:

```text
React
  |
  v
Backend
  |
  v
Firebase Admin
  |
  v
Firestore
```

---

## 10. IGDB

As informações dos jogos são obtidas através da API da IGDB.

Entre os dados utilizados estão:

- ID.
- Nome.
- Capa.
- Imagens.
- Sinopse.
- Data de lançamento.
- Nota.
- Gêneros.
- Desenvolvedoras.
- Plataformas.
- Classificação indicativa.

A comunicação com a IGDB é realizada pelo servidor Express.

---

## 11. Twitch OAuth

A IGDB utiliza autenticação através da Twitch.

O backend solicita um token utilizando as credenciais da Twitch armazenadas nas variáveis de ambiente.

São utilizadas as variáveis:

```env
TWITCH_CLIENT_ID=seu_client_id
TWITCH_CLIENT_SECRET=seu_client_secret
```

O token recebido é utilizado para realizar as requisições à IGDB.

---

## 12. Backend

O arquivo `server.js` contém o servidor Express responsável pelas requisições da aplicação.

### Rota principal

```text
GET /
```

Verifica se o servidor está funcionando.

### Teste do Firestore

```text
GET /api/test-db
```

Testa a conexão com o banco de dados.

### Buscar jogos

```text
GET /api/games/search?q=nome
```

Pesquisa jogos pelo nome.

### Jogos da Home

```text
GET /api/games/home
```

Busca os jogos utilizados na página inicial.

### Buscar jogo por ID

```text
GET /api/games/:id
```

Busca um jogo específico através do seu ID.

---

## 13. Perfis

O sistema possui páginas específicas para os usuários.

### Perfil do usuário autenticado

```text
/perfil
```

Permite visualizar e editar as informações do próprio perfil.

### Favoritos

```text
/perfil/favoritos
```

Exibe os jogos favoritos do usuário.

### Reviews

```text
/perfil/reviews
```

Exibe as avaliações realizadas pelo usuário.

### Lista de usuários

```text
/usuarios
```

Exibe os usuários cadastrados na plataforma.

### Perfil de outro usuário

```text
/usuario/:id
```

Permite visualizar o perfil público de outro usuário.

---

## 14. Variáveis de ambiente

As informações sensíveis utilizadas pelo projeto são armazenadas em variáveis de ambiente.

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000

FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_CLIENT_EMAIL=seu_client_email
FIREBASE_PRIVATE_KEY=sua_private_key

TWITCH_CLIENT_ID=seu_client_id
TWITCH_CLIENT_SECRET=seu_client_secret
```

Os valores reais devem ser utilizados apenas no ambiente local.

O arquivo `.env` não deve ser enviado para o GitHub.

---

## 15. Instalação

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

### 2. Entrar na pasta

```bash
cd GameHub
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar o `.env`

Crie o arquivo `.env` na raiz do projeto e adicione as credenciais necessárias.

### 5. Iniciar o backend

```bash
node server.js
```

O servidor será iniciado na porta configurada, normalmente:

```text
http://localhost:3000
```

### 6. Iniciar o frontend

Em outro terminal:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço onde a aplicação estará disponível.

---

## 16. Testando o backend

Para verificar se o servidor está funcionando, acesse:

```text
http://localhost:3000/
```

A resposta esperada é:

```json
{
  "message": "Servidor do GameHub funcionando!"
}
```

Para testar o Firestore:

```text
http://localhost:3000/api/test-db
```

---

## 17. Segurança

As credenciais utilizadas pelo projeto não devem ser armazenadas diretamente no código-fonte.

As principais informações protegidas são:

- Credenciais do Firebase.
- Client ID da Twitch.
- Client Secret da Twitch.
- Chaves privadas.
- Configurações do servidor.

O arquivo `.env` deve estar no `.gitignore`.

Exemplo:

```gitignore
node_modules/
.env
dist/
```

---

## 18. Conceitos aplicados

Durante o desenvolvimento do GameHub foram utilizados diversos conceitos de desenvolvimento web:

- React.
- TypeScript.
- Componentização.
- Hooks.
- Hooks personalizados.
- Context API.
- React Router.
- Estados.
- Requisições HTTP.
- APIs REST.
- JSON.
- `fetch`.
- `async/await`.
- Tratamento de erros.
- Firebase Authentication.
- Firebase Firestore.
- Firebase Admin SDK.
- Node.js.
- Express.
- Middleware.
- CORS.
- Variáveis de ambiente.
- Integração com APIs externas.
- Filtros.
- Pesquisa de dados.
- Autenticação de usuários.
- Armazenamento de dados.

---

## 19. Organização do código

O projeto foi dividido de acordo com a responsabilidade de cada parte.

```text
components/
    Componentes reutilizáveis da interface

pages/
    Páginas da aplicação

hooks/
    Lógica reutilizável

services/
    Comunicação com Firebase e outros serviços

context/
    Estados compartilhados

styles/
    Arquivos CSS

server.js
    Backend e integração com APIs externas
```

Essa divisão facilita a manutenção do projeto, permite reutilizar código e evita concentrar toda a lógica em um único arquivo.

---

## 20. Projeto acadêmico

O GameHub foi desenvolvido como um projeto acadêmico com o objetivo de aplicar conhecimentos de desenvolvimento web na prática.

Durante o desenvolvimento foram trabalhados conceitos de frontend, backend, APIs, banco de dados, autenticação, componentização, Hooks e organização de projetos.