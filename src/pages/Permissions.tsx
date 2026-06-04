import { useEffect, useState, type SyntheticEvent } from "react";
import { AppLayout } from "../components/AppLayout";
import { api } from "../service/api";
import type { Door } from "../@types/Door";
import type { User } from "../@types/User";

export function Permissions() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedDoor, setSelectedDoor] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);

  async function loadData() {
    const [doorsResponse, usersResponse] = await Promise.all([
      api.get<Door[]>("/doors"),
      api.get<User[]>("/users"),
    ]);

    setDoors(doorsResponse.data);
    setUsers(usersResponse.data.filter((user) => user.role === "user"));
  }

  async function loadDoorUsers(doorId: string) {
    if (!doorId) {
      setAllowedUsers([]);
      return;
    }

    const response = await api.get(`/permissions/doors/${doorId}/users`);
    setAllowedUsers(response.data.users || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadDoorUsers(selectedDoor);
  }, [selectedDoor]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();

    if (!selectedDoor || !selectedUser) {
      return;
    }

    await api.post(`/permissions/doors/${selectedDoor}/users/${selectedUser}`);

    setSelectedUser("");
    loadDoorUsers(selectedDoor);
  }

  async function handleRemove(userId: string) {
    await api.delete(`/permissions/doors/${selectedDoor}/users/${userId}`);
    loadDoorUsers(selectedDoor);
  }

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Permissões</h1>
          <p className="page-description">
            Defina quais usuários podem acessar cada porta.
          </p>
        </div>
      </div>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2>Adicionar permissão</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-control">
              <label>Porta</label>
              <select
                value={selectedDoor}
                onChange={(event) => setSelectedDoor(event.target.value)}
              >
                <option value="">Selecione uma porta</option>
                {doors.map((door) => (
                  <option key={door.id} value={door.id}>
                    {door.name} - {door.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label>Usuário</label>
              <select
                value={selectedUser}
                onChange={(event) => setSelectedUser(event.target.value)}
              >
                <option value="">Selecione um usuário</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="primary-button">
            Adicionar permissão
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Usuários permitidos</h2>

        {!selectedDoor ? (
          <p>Selecione uma porta para visualizar permissões.</p>
        ) : allowedUsers.length === 0 ? (
          <p>Nenhum usuário possui permissão nesta porta.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {allowedUsers.map((userId) => (
                  <tr key={userId}>
                    <td>{userId}</td>
                    <td>
                      <button className="danger-button" onClick={() => handleRemove(userId)}>
                        Remover permissão
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppLayout>
  );
}