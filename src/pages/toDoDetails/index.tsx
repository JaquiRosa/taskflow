import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ToDoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = useState(() => {
    if (!id) {
      return "";
    }

    return localStorage.getItem(`to-do-description-${id}`) ?? "";
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function handleSaveDescription() {
    if (!id) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");

    setTimeout(() => {
      localStorage.setItem(`to-do-description-${id}`, description);

      setIsSaving(false);
      setSuccessMessage("Descrição de tarefa salva com sucesso!");
    }, 800);
  }

  return (
    <main className="app">
      <section className="to-do-container">
        <header className="to-do-header">
          <p className="to-do-subtitle">Detalhes</p>
          <h1>Detalhes da tarefa</h1>
          <p className="to-do-description">
            Adicione uma descrição mais completa para essa tarefa.
          </p>
        </header>

        <div className="to-do-details-form">
          <label htmlFor="description" className="to-do-details-label">
            Descrição da tarefa
          </label>

          <textarea
            id="description"
            className="to-do-details-textarea"
            placeholder="Escreva aqui os detalhes da tarefa..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

            <div className="to-do-details-footer">
              <div className="to-do-message-area">
                {successMessage && (
                  <span className="to-do-save-message">{successMessage}</span>
                )}
              </div>

              <div className="to-do-details-actions">
                <button
                  type="button"
                  className="to-do-back-button"
                  onClick={() => navigate("/")}
                >
                  Voltar
                </button>

                <button
                  type="button"
                  className="to-do-save-button"
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                >
                  {isSaving ? <span className="to-do-loading" /> : "Salvar"}
                </button>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}
