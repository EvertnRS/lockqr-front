import { useEffect, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { api } from "../service/api";
import type { Door } from "../@types/Door";
import { useAuth } from "../contexts/AuthContext";

function isDoorOpen(door: Door): boolean {
  if (typeof door.isOpen === "boolean") {
    return door.isOpen;
  }

  if (typeof door.status === "string") {
    const normalized = door.status.trim().toLowerCase();
    return ["aberto", "aberta", "open", "opened"].includes(normalized);
  }

  return false;
}

export function Dashboard() {
  const [usersTotal, setUsersTotal] = useState(0);
  const [doors, setDoors] = useState<Door[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  async function loadMetrics() {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      if (isAdmin) {
        const [usersResponse, doorsResponse] = await Promise.all([
          api.get("/users"),
          api.get<Door[]>("/doors"),
        ]);

        setUsersTotal(usersResponse.data.length);
        setDoors(doorsResponse.data);
        return;
      }

      const doorsResponse = await api.get<Door[]>("/doors/me");

      setDoors(doorsResponse.data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMetrics();
  }, [user?.id, isAdmin]);

  const openDoorsTotal = doors.filter(isDoorOpen).length;
  const closedDoorsTotal = doors.length - openDoorsTotal;
  const pageSubtitle = isAdmin
    ? "Visão geral do sistema LockQR."
    : "Somente suas portas liberadas aparecem neste painel.";

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">{pageSubtitle}</p>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="metric-card">
          <div className="metric-title">{isAdmin ? "Usuários cadastrados" : "Minhas portas"}</div>
          <div className="metric-value">{isAdmin ? usersTotal : doors.length}</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">Portas abertas agora</div>
          <div className="metric-value">{openDoorsTotal}</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">Portas fechadas agora</div>
          <div className="metric-value">{closedDoorsTotal}</div>
        </div>
      </div>

      <section className="card locker-card">
        <div className="locker-header">
          <h2>{isAdmin ? "Armário" : "Meu armário"}</h2>
        </div>

        <div className="locker-legend">
          <span className="legend-chip legend-chip-open">Abertas: {openDoorsTotal}</span>
          <span className="legend-chip legend-chip-closed">Fechadas: {closedDoorsTotal}</span>
        </div>

        {isLoading ? (
          <p>Carregando portas...</p>
        ) : doors.length === 0 ? (
          <p>Nenhuma porta encontrada para montar o armário.</p>
        ) : (
          <div className="locker-grid">
            {doors.map((door) => {
              const doorOpen = isDoorOpen(door);

              return (
                <div key={door.id} className="locker-cell">
                  <div className="locker-frame">
                    <div className={doorOpen ? "locker-door is-open" : "locker-door"}>
                      <span className="locker-handle" />
                    </div>
                  </div>
                  <div className="locker-door-name">{door.name || door.id}</div>
                  <div className={doorOpen ? "badge badge-active" : "badge badge-inactive"}>
                    {doorOpen ? "Aberta" : "Fechada"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppLayout>
  );
}