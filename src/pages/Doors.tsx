import { useEffect, useState, type SyntheticEvent } from "react";
import { AppLayout } from "../components/AppLayout";
import { api } from "../service/api";
import type { Door } from "../@types/Door";

type DoorFormData = {
  id: string;
  name: string;
  description: string;
  location: string;
  active: boolean;
  isOpen: boolean;
};

const initialForm: DoorFormData = {
  id: "",
  name: "",
  description: "",
  location: "",
  active: true,
  isOpen: false,
};

export function Doors() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [form, setForm] = useState<DoorFormData>(initialForm);
  const [editingDoorId, setEditingDoorId] = useState<string | null>(null);

  async function loadDoors() {
    const response = await api.get<Door[]>("/doors");
    setDoors(response.data);
  }

  useEffect(() => {
    loadDoors();
  }, []);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();

    if (editingDoorId) {
      await api.put(`/doors/${editingDoorId}`, {
        name: form.name,
        description: form.description,
        location: form.location,
        active: form.active,
        isOpen: form.isOpen,
      });
    } else {
      await api.post("/doors", form);
    }

    setForm(initialForm);
    setEditingDoorId(null);
    loadDoors();
  }

  function handleEdit(door: Door) {
    setEditingDoorId(door.id);
    setForm({
      id: door.id,
      name: door.name,
      description: door.description || "",
      location: door.location || "",
      active: door.active,
      isOpen: !!door.isOpen,
    });
  }

  async function handleDelete(id: string) {
    const confirmed = confirm("Deseja remover esta porta?");

    if (!confirmed) {
      return;
    }

    await api.delete(`/doors/${id}`);
    loadDoors();
  }

  function cancelEdit() {
    setEditingDoorId(null);
    setForm(initialForm);
  }

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Portas</h1>
          <p className="page-description">
            Gerencie as portas conectadas ao sistema LockQR.
          </p>
        </div>
      </div>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2>{editingDoorId ? "Editar porta" : "Nova porta"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-control">
              <label>ID da porta</label>
              <input
                value={form.id}
                disabled={!!editingDoorId}
                onChange={(event) => setForm({ ...form, id: event.target.value })}
                placeholder="ex: porta_lab_01"
              />
            </div>

            <div className="form-control">
              <label>Nome</label>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Laboratório 01"
              />
            </div>

            <div className="form-control">
              <label>Descrição</label>
              <input
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Descrição da porta"
              />
            </div>

            <div className="form-control">
              <label>Localização</label>
              <input
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                placeholder="Bloco A"
              />
            </div>

            <div className="form-control">
              <label>Status</label>
              <select
                value={form.active ? "true" : "false"}
                onChange={(event) => setForm({ ...form, active: event.target.value === "true" })}
              >
                <option value="true">Ativa</option>
                <option value="false">Inativa</option>
              </select>
            </div>

            <div className="form-control">
              <label>Abertura</label>
              <select
                value={form.isOpen ? "true" : "false"}
                onChange={(event) => setForm({ ...form, isOpen: event.target.value === "true" })}
              >
                <option value="false">Fechada</option>
                <option value="true">Aberta</option>
              </select>
            </div>
          </div>

          <button className="primary-button">
            {editingDoorId ? "Salvar alterações" : "Cadastrar porta"}
          </button>

          {editingDoorId && (
            <button type="button" className="secondary-button" style={{ marginLeft: 10 }} onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </form>
      </section>

      <section className="card">
        <h2>Portas cadastradas</h2>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Localização</th>
                <th>Status</th>
                <th>Abertura</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {doors.map((door) => (
                <tr key={door.id}>
                  <td>{door.id}</td>
                  <td>{door.name}</td>
                  <td>{door.location || "-"}</td>
                  <td>
                    <span className={door.active ? "badge badge-active" : "badge badge-inactive"}>
                      {door.active ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td>
                    <span className={door.isOpen ? "badge badge-active" : "badge badge-inactive"}>
                      {door.isOpen ? "Aberta" : "Fechada"}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="secondary-button" onClick={() => handleEdit(door)}>
                        Editar
                      </button>
                      <button className="danger-button" onClick={() => handleDelete(door.id)}>
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