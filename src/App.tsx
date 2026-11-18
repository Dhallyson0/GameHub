import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import Jogo from "./pages/jogos";
import FavoritosPerfil from "./pages/FavoritosPerfil";
import ReviewsPerfil from "./pages/ReviewsPerfil";
import Usuarios from "./pages/Usuarios";
import PerfilUsuario from "./pages/PerfilUsuario";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/jogo/:id" element={<Jogo />} />
          <Route path="/perfil/favoritos" element={<FavoritosPerfil />} />
          <Route path="/perfil/reviews" element={<ReviewsPerfil />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuario/:id" element={<PerfilUsuario />} />
          <Route path="/usuario/:id/favoritos" element={<FavoritosPerfil />} />
          <Route path="/usuario/:id/reviews" element={<ReviewsPerfil />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}