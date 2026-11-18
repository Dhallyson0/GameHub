import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import FormInput from "../components/FormInput";

import "../styles/auth.css";

import sapo from "../assets/img/sapo.png";

// CADASTRO

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  // CADASTRAR

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await cadastrar(nome, email, senha);

      navigate("/");
    } catch {
      setErro("Não foi possível criar a conta.");
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
        <form
          className="auth-form"
          onSubmit={handleCadastro}
        >
          <h2>Criar Conta</h2>

          <FormInput
            id="nome"
            label="Nome de usuario:"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <FormInput
            id="email"
            label="Email:"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            minLength={6}
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

          {erro && (
            <p className="auth-error">
              {erro}
            </p>
          )}

          <button type="submit">
            Criar
          </button>

          <p className="auth-switch">
            Já possui uma conta?{" "}
            <Link to="/login">
              Entrar
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}