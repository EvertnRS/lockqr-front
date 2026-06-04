import { useEffect, useState, type SyntheticEvent } from "react";
import { AppLayout } from "../components/AppLayout";
import { api } from "../service/api";
import type { User, UserRole } from "../@types/User";

type UserFormData = {
  username: string;
  name: string;
  password: string;
  role: UserRole;
  active: boolean;
};

const initialForm: UserFormData = {
  username: "",
  name: "",
  password: "",
  role: "user",
  active: true,
};

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  user: "Usuário",
};

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserFormData>(initialForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  async function loadUsers() {
    const response = await api.get<User[]>("/users");
    setUsers(response.data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();

    if (editingUserId) {
      const updateData: Partial<UserFormData> = {
        name: form.name,
        role: form.role,
        active: form.active,
      };

      if (form.password.trim()) {
        updateData.password = form.password;
      }

      await api.put(`/users/${editingUserId}`, updateData);
    } else {
      await api.post("/users", form);
    }

    setForm(initialForm);
    setEditingUserId(null);
    loadUsers();
  }

  function handleEdit(user: User) {
    setEditingUserId(user.id);
    setForm({
      username: user.username,
      name: user.name,
      password: "",
      role: user.role,
      active: user.active,
    });
  }

  async function handleDelete(id: string) {
    const confirmed = confirm("Deseja remover este usuário?");

    if (!confirmed) {
      return;
    }

    await api.delete(`/users/${id}`);
    loadUsers();
  }

  function cancelEdit() {
    setEditingUserId(null);
    setForm(initialForm);
  }

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-description">
            Cadastre administradores e usuários que poderão acessar portas.
          </p>
        </div>
      </div>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2>{editingUserId ? "Editar usuário" : "Novo usuário"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-control">
              <label>Username</label>
              <input
                value={form.username}
                disabled={!!editingUserId}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                placeholder="ex: joao"
              />
            </div>

            <div className="form-control">
              <label>Nome</label>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Nome completo"
              />
            </div>

            <div className="form-control">
              <label>Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder={editingUserId ? "Deixe em branco para manter" : "Senha"}
              />
            </div>

            <div className="form-control">
              <label>Tipo</label>
              <select
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="form-control">
              <label>Status</label>
              <select
                value={form.active ? "true" : "false"}
                onChange={(event) => setForm({ ...form, active: event.target.value === "true" })}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          <button className="primary-button">
            {editingUserId ? "Salvar alterações" : "Cadastrar usuário"}
          </button>

          {editingUserId && (
            <button type="button" className="secondary-button" style={{ marginLeft: 10 }} onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </form>
      </section>

      <section className="card">
        <h2>Usuários cadastrados</h2>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>
                    <span className={user.role === "admin" ? "badge badge-admin" : "badge badge-user"}>
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td>
                    <span className={user.active ? "badge badge-active" : "badge badge-inactive"}>
                      {user.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="secondary-button" onClick={() => handleEdit(user)}>
                        Editar
                      </button>
                      <button className="danger-button" onClick={() => handleDelete(user.id)}>
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
}