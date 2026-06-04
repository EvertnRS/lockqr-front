import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="logo">LockQR</div>
        <div className="logo-subtitle">
          {isAdmin ? "Painel administrativo" : "Meu painel de acesso"}
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            Dashboard
          </NavLink>

          {isAdmin && (
            <>
              <NavLink to="/users" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                Usuários
              </NavLink>

              <NavLink to="/doors" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                Portas
              </NavLink>

              <NavLink to="/permissions" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                Permissões
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <p>
            Logado como<br />
            <strong>{user?.name}</strong>
          </p>

          <button className="logout-button" onClick={logout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}