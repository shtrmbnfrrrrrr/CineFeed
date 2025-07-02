import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getMovieById } from "../api/api";
import { useLocalStorageList } from "../hooks/useLocalStorageList";
import { formatRating, formatGenres } from "../utils/apiHelpers";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [inlineResults, setInlineResults] = useState([]);

  const {
    items: favorites,
    addItem: addFavorite,
    removeItem: removeFavorite,
    hasItem: isFavorite,
  } = useLocalStorageList("favorites");

  const {
    items: watchLater,
    addItem: addToWatchLater,
    removeItem: removeFromWatchLater,
    hasItem: isWatchLater,
  } = useLocalStorageList("watchLater");

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const res = await getMovieById(id);
        setMovie(res.data);
      } catch (error) {
        console.error("Failed to load movie:", error);
      }
    };
    loadMovie();
  }, [id]);

  if (!movie) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-zinc-900 text-white min-h-screen px-4 py-2 pb-10">
      <Header
        showSearch={true}
        inlineResults={inlineResults}
        setInlineResults={setInlineResults}
      />
      <div className="relative h-150 mb-6 rounded-xl overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
        </div>
      </div>

      <p className="text-zinc-300 mb-5 font-medium text-lg">{movie.overview}</p>

      <div className="mb-4">
        <p>
          <span className="text-zinc-400">Release Date:</span>{" "}
          {movie.release_date}
        </p>
        <p>
          <span className="text-zinc-400">Rating:</span>{" "}
          {formatRating(movie.vote_average)}
        </p>
        <p>
          <span className="text-zinc-400">Genres:</span>{" "}
          {formatGenres(movie.genres)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full font-semibold text-sm">
          ▶ Watch Trailer
        </button>

        <button
          onClick={() =>
            isWatchLater(movie.id)
              ? removeFromWatchLater(movie.id)
              : addToWatchLater(movie)
          }
          className="bg-zinc-700 hover:bg-zinc-600 px-6 py-2 rounded-full text-sm flex items-center gap-2"
        >
          {isWatchLater(movie.id) ? <BsBookmarkFill /> : <BsBookmark />} Watch
          Later
        </button>

        <button
          onClick={() =>
            isFavorite(movie.id) ? removeFavorite(movie.id) : addFavorite(movie)
          }
          className="bg-zinc-700 hover:bg-zinc-600 p-2 rounded-full"
        >
          {isFavorite(movie.id) ? (
            <FaHeart className="text-red-400" />
          ) : (
            <FaRegHeart className="text-red-400" />
          )}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetail;
