import { useState } from "react";
import type { ToDo, ToDoFilter } from "./types/toDo";
import "./index.css";

function App() {
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [filter, setFilter] = useState<ToDoFilter>("all");

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
              <span>{toDo.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
