import { useState } from "react";

import "../styles/ComponentReviewForm.css";

// TIPOS

type ReviewFormProps = {
  onPostar: (nota: number, texto: string) => void;
};

// COMPONENTE

export default function ReviewForm({
  onPostar,
}: ReviewFormProps) {
  const [nota, setNota] = useState(0);
  const [review, setReview] = useState("");

  // POSTAR REVIEW

  function handlePostar(e: React.FormEvent) {
    e.preventDefault();

    if (nota === 0) {
      alert("Escolha uma nota.");
      return;
    }

    if (!review.trim()) {
      alert("Escreva uma review.");
      return;
    }

    onPostar(nota, review);

    setNota(0);
    setReview("");
  }

  // TELA

  return (
    <form
      className="review-form"
      onSubmit={handlePostar}
    >
      {/* NOTA */}
      <div className="review-rating">
        <span>Nota:</span>

        <div className="review-stars">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <button
              key={estrela}
              type="button"
              className={
                estrela <= nota
                  ? "review-star active"
                  : "review-star"
              }
              onClick={() => setNota(estrela)}
              aria-label={`Dar nota ${estrela}`}
            >
              ★
            </button>
          ))}
        </div>

        {nota > 0 && (
          <span className="review-rating-number">
            {nota}/5
          </span>
        )}
      </div>

      {/* TEXTO DA REVIEW */}
      <label htmlFor="review">
        Review:
      </label>

      <textarea
        id="review"
        value={review}
        onChange={(e) =>
          setReview(e.target.value)
        }
        placeholder="Escreva sua opinião sobre o jogo..."
      />

      {/* BOTÕES */}
      <div className="review-form-buttons">
        <button
          type="button"
          className="review-cancel"
          onClick={() => {
            setNota(0);
            setReview("");
          }}
        >
          cancelar
        </button>

        <button
          type="submit"
          className="review-submit"
        >
          postar
        </button>
      </div>
    </form>
  );
}