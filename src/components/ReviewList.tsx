import "../styles/ComponentReviewList.css";

// TIPOS

type Review = {
  id: string;
  username: string;
  photoURL: string;
  rating: number;
  text: string;
};

type ReviewListProps = {
  reviews: Review[];
};

// COMPONENTE

export default function ReviewList({
  reviews,
}: ReviewListProps) {
  return (
    <section className="review-list">
      <h2>Reviews da comunidade</h2>

      {/* LISTA DE REVIEWS */}
      {reviews.length === 0 ? (
        <p className="review-empty">
          Ainda não existem reviews para este jogo.
        </p>
      ) : (
        reviews.map((review) => (
          <article
            key={review.id}
            className="review-card"
          >
            {/* USUÁRIO E NOTA */}
            <div className="review-user">
              {review.photoURL ? (
                <img
                  src={review.photoURL}
                  alt={review.username}
                />
              ) : (
                <div className="review-user-default">
                  👤
                </div>
              )}

              <div>
                <h3>{review.username}</h3>

                <div className="review-card-stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
            </div>

            {/* TEXTO DA REVIEW */}
            <p>{review.text}</p>
          </article>
        ))
      )}
    </section>
  );
}