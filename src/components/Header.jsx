import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Header = ({ showSearch, inlineResults, setInlineResults }) => {
  return (
    <header className="fixed top-0 z-50 w-full px-1 py-3 flex items-center justify-between bg-zinc-900">
      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          to="/"
          className="text-xl font-bold text-white hover:text-red-500 transition"
        >
          CineFeed
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm text-zinc-300">
          <Link to="/favorites" className="hover:text-white transition">
            Favorites
          </Link>
          <Link to="/watch-later" className="hover:text-white transition">
            Watch Later
          </Link>
        </nav>
      </div>

      {showSearch && (
        <div className="relative w-80 mr-7 ml-3">
          <SearchBar
            className="w-full"
            showInlineResults={true}
            results={inlineResults}
            setResults={setInlineResults}
          />

          {inlineResults.length > 0 && (
            <div className="absolute top-full mt-2 bg-zinc-800 w-full rounded-lg shadow-lg z-40 p-2">
              {inlineResults.map((movie) => (
                <Link
                  to={`/movie/${movie.id}`}
                  key={movie.id}
                  className="flex items-center gap-2 hover:bg-zinc-700 p-2 rounded transition"
                  onClick={() => setInlineResults([])}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : "https://via.placeholder.com/92x138?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-10 h-auto rounded"
                  />
                  <span className="text-sm text-white truncate">
                    {movie.title}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
