import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Usuário e senha são obrigatórios");
      return;
    }

    try {
      setIsLoading(true);
      await login(username, password);
      navigate("/");
    } catch {
      setErrorMessage("Usuário ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1 className="login-title">LockQR</h1>
        <p className="login-subtitle">
          Acesse o painel de administração para gerenciar portas, usuários e permissões.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-form-group">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Digite seu usuário"
              disabled={isLoading}
              required
              aria-describedby={errorMessage ? "error-message" : undefined}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              disabled={isLoading}
              required
              aria-describedby={errorMessage ? "error-message" : undefined}
            />
          </div>

          {errorMessage && (
            <p className="error-message" id="error-message" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="login-button-wrapper">
            <button
              className="login-button"
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>Sistema de Controle de Acesso LockQR</p>
        </div>
      </section>
    </main>
  );
}