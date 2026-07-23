import { useEffect, useState } from "react";
import type { ToDo, ToDoFilter } from "../../types/toDo";
import { useNavigate } from "react-router-dom";
import {Trash2, ChevronRight} from "lucide-react";
import { API_URL } from "../../services/api";

export default function Home() {
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [filter, setFilter] = useState<ToDoFilter>("all");
  const [toDoToRemove, setToDoToRemove] = useState<ToDo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadToDos() {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setToDos(data);
    }

    loadToDos();
  }, []);

  useEffect(() => {
    if (!toDoToRemove) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isRemoving) {
        setToDoToRemove(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toDoToRemove, isRemoving]);

  const filteredToDos = toDos.filter((toDo) => {
    if (filter === "pending") {
      return !toDo.completed;
    }

    if (filter === "completed") {
      return toDo.completed;
    }

    return true;
  });

  async function handleAddToDo(title: string) {
    try {
      setIsAdding(true);

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      });

      const newToDo = await response.json();

      setToDos((prevToDos) => [newToDo, ...prevToDos]);
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRemoveToDo(id: string) {
    try {
      setIsRemoving(true);

      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      setToDos((prevToDos) => prevToDos.filter((toDo) => toDo.id !== id));
      setToDoToRemove(null);
    } catch (error) {
      console.error("Error removing todo:", error);
    } finally {
      setIsRemoving(false);
    }
  }

  async function handleToggleToDo(id: string) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !toDos.find((toDo) => toDo.id === id)?.completed,
        }),
      });

      const updatedToDo = await response.json();
      setToDos((prevToDos) =>
        prevToDos.map((toDo) => (toDo.id === id ? updatedToDo : toDo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  return (
    <main className="app">
      <section className="to-do-container">
        <header className="to-do-header">
          <p className="to-do-subtitle">Organize sua rotina</p>
          <h1>TaskFlow</h1>
          <p className="to-do-description">
            Uma lista de tarefas simples, rápida e organizada.
          </p>
        </header>

        <form
          className="to-do-form"
          onSubmit={(event) => {
            event.preventDefault();

            const form = event.currentTarget;
            const input = form.elements.namedItem("toDo") as HTMLInputElement;

            if (!input.value.trim() || isAdding) {
              return;
            }

            handleAddToDo(input.value);
            form.reset();
          }}
        >
          <input
            name="toDo"
            type="text"
            placeholder="Digite uma nova tarefa..."
            disabled={isAdding}
          />

          <button type="submit" disabled={isAdding}>
            {isAdding ? (
              <span
                className="to-do-loading"
                role="status"
                aria-label="Adicionando tarefa"
              />
            ) : (
              "Adicionar"
            )}
          </button>
        </form>

        <div className="to-do-filters">
          <button onClick={() => setFilter("all")}>Todas</button>
          <button onClick={() => setFilter("pending")}>Pendentes</button>
          <button onClick={() => setFilter("completed")}>Concluídas</button>
        </div>

        <ul className="to-do-list">
          {filteredToDos.map((toDo) => (
            <li key={toDo.id} className="to-do-item">
              <label className="to-do-checkbox-area">
                <input
                  type="checkbox"
                  checked={toDo.completed}
                  onChange={() => handleToggleToDo(toDo.id)}
                  aria-label={`Marcar tarefa como ${
                    toDo.completed ? "pendente" : "concluída"
                  }`}
                />

                <span
                  className={
                    toDo.completed ? "to-do-title-completed" : "to-do-title"
                  }
                >
                  {toDo.title}
                </span>
              </label>

              <div className="to-do-actions">
                <button
                  type="button"
                  className="to-do-detail-button"
                  aria-label="Detalhes da tarefa"
                  title="Detalhes da tarefa"
                  onClick={() => navigate(`/todos/${toDo.id}`)}
                >
                  <ChevronRight />
                </button>

                <button
                  type="button"
                  className="to-do-remove-button"
                  onClick={() => setToDoToRemove(toDo)}
                  aria-label="Remover tarefa"
                  title="Remover tarefa"
                >
                  <Trash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {toDoToRemove && (
        <div
          className="to-do-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isRemoving) {
              setToDoToRemove(null);
            }
          }}
        >
          <section
            className="to-do-confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-to-do-title"
            aria-describedby="remove-to-do-description"
          >
            <div className="to-do-confirmation-icon" aria-hidden="true">
              <Trash2 />
            </div>

            <div className="to-do-confirmation-content">
              <p className="to-do-confirmation-subtitle">Remover tarefa</p>
              <h2 id="remove-to-do-title">Confirmar remoção</h2>
              <p id="remove-to-do-description">
                Tem certeza de que deseja remover{" "}
                <strong>{toDoToRemove.title}</strong>? Esta ação não poderá ser
                desfeita.
              </p>
            </div>

            <div className="to-do-confirmation-actions">
              <button
                type="button"
                className="to-do-cancel-button"
                onClick={() => setToDoToRemove(null)}
                disabled={isRemoving}
                autoFocus
              >
                Cancelar
              </button>

              <button
                type="button"
                className="to-do-confirm-button"
                onClick={() => handleRemoveToDo(toDoToRemove.id)}
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <span className="to-do-loading" aria-label="Removendo" />
                ) : (
                  "Remover"
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
