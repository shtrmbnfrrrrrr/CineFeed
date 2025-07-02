import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocalStorageList } from "../hooks/useLocalStorageList";

const WatchLater = () => {
  const { items: watchLater } = useLocalStorageList("watchLater");
  const [inlineResults, setInlineResults] = useState([]);

  return (
    <div className="bg-zinc-900 text-white min-h-screen px-4 py-2 pb-10">
      <Header
        showSearch={true}
        inlineResults={inlineResults}
        setInlineResults={setInlineResults}
      />
      <h1 className="text-2xl font-bold mt-6 mb-6">Watch Later</h1>
      {watchLater.length === 0 ? (
        <p className="text-zinc-400 text-lg">
          You have no movies to watch later.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchLater.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="bg-zinc-800 rounded p-2"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded mb-2"
              />
              <p className="text-sm">{movie.title}</p>
            </Link>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default WatchLater;
