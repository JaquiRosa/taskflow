import { useState } from "react";
import type { ToDo, ToDoFilter } from "../../types/toDo";
import { useNavigate } from "react-router-dom";
import {Trash2, ChevronRight} from "lucide-react";

export default function Home() {
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [filter, setFilter] = useState<ToDoFilter>("all");

  const navigate = useNavigate();

  const filteredToDos = toDos.filter((toDo) => {
    if (filter === "pending") {
      return !toDo.completed;
    }

    if (filter === "completed") {
      return toDo.completed;
    }

    return true;
  });

  function handleAddToDo(title: string) {
    const newToDo: ToDo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setToDos((prevToDos) => [newToDo, ...prevToDos]);
  }

  function handleRemoveToDo(id: string) {
    setToDos((prevToDos) => prevToDos.filter((toDo) => toDo.id !== id));
  }

  function handleToggleToDo(id: string) {
    setToDos((prevToDos) =>
      prevToDos.map((toDo) =>
        toDo.id === id ? { ...toDo, completed: !toDo.completed } : toDo,
      ),
    );
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

            if (!input.value.trim()) {
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
          />

          <button type="submit">Adicionar</button>
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
                  onClick={() => handleRemoveToDo(toDo.id)}
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
    </main>
  );
}