import { useState, useEffect } from "react";

interface Task {
  _id: string;
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "completada";
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<"pendiente" | "completada">("pendiente");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/tasks/${editingId}` : "/api/tasks";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion, estado }),
    });
    setTitulo("");
    setDescripcion("");
    setEstado("pendiente");
    setEditingId(null);
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    setTitulo(task.titulo);
    setDescripcion(task.descripcion);
    setEstado(task.estado);
    setEditingId(task._id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar tarea?")) {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Gestor de Tareas</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          required
          style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          required
          style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as any)}
          style={{ marginBottom: "8px", padding: "8px" }}
        >
          <option value="pendiente">Pendiente</option>
          <option value="completada">Completada</option>
        </select>
        <button type="submit" style={{ padding: "8px 16px" }}>
          {editingId ? "Actualizar" : "Crear"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitulo("");
              setDescripcion("");
              setEstado("pendiente");
            }}
            style={{ marginLeft: "8px", padding: "8px 16px" }}
          >
            Cancelar
          </button>
        )}
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "8px 0",
              }}
            >
              <h3>{task.titulo}</h3>
              <p>{task.descripcion}</p>
              <span
                style={{
                  color: task.estado === "completada" ? "green" : "orange",
                }}
              >
                {task.estado}
              </span>
              <div>
                <button
                  onClick={() => handleEdit(task)}
                  style={{ marginRight: "8px" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  style={{ color: "red" }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
