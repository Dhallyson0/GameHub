import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import FormInput from "../components/FormInput";

import "../styles/auth.css";

import sapo from "../assets/img/sapo.png";


export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // LOGIN

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      await login(email, senha);

      navigate("/");
    } catch (error) {
      console.error(error);
      setErro("Email ou senha incorretos.");
    }
  }


  return (
    <main className="auth-page">
      <section className="auth-left">
        <h1>
          Até o sapo
          <br />
          sabe quando
          <br />
          um jogo é
          <br />
          bom!
        </h1>

        <p>Avaliações que valem cada pulo!</p>

        <img
          src={sapo}
          alt="Sapo do GameHub"
          className="auth-frog"
        />
      </section>

      <section className="auth-right">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Bem-vindo de volta!</h2>

          <FormInput
            id="email"
            label="Email:"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            id="senha"
            label="Senha:"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <p className="auth-error">{erro}</p>}

          <button type="submit">Entrar</button>

          <p className="auth-switch">
            Ainda não possui uma conta?{" "}
            <Link to="/cadastro">Criar conta</Link>
          </p>
        </form>
      </section>
    </main>
  );
}