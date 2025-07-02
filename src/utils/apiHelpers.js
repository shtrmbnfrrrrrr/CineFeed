export const formatRating = (rating) =>
  rating ? `${rating.toFixed(2)} / 10 ⭐` : "No rating";

export const formatGenres = (genres = []) =>
  genres.map((g) => g.name).join(", ");

export const truncateText = (text, limit = 100) =>
  text.length > limit ? text.slice(0, limit) + "..." : text;
