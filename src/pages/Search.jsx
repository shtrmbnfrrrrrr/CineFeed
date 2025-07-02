import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { searchMovies } from "../api/api";

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [results, setResults] = useState([]);
  const [inlineResults, setInlineResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      try {
        const res = await searchMovies(query);
        setResults(res.data.results);
      } catch (err) {
        console.error("Search error:", err);
      }
    };
    fetchSearchResults();
  }, [query]);

  return (
    <div className="bg-zinc-900 text-white min-h-screen px-4 py-5 pb-10">
      {/* Header with logo and centered search */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute left-0 ">
          <Header
            showSearch={false}
            inlineResults={inlineResults}
            setInlineResults={setInlineResults}
          />
        </div>
        {/*centered search bar */}
        <div className="w-full max-w-4xl px-4 mt-10">
          <SearchBar className="w-full" />
        </div>
      </div>

      <h1 className="text-xl font-semibold text-white mb-4">
        Search Results for "<span className="text-red-500">{query}</span>"
      </h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <div className="bg-zinc-800 rounded-lg p-2 hover:bg-zinc-700 transition">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movie.title}
                  className="rounded mb-2 w-full h-auto object-cover"
                />
                <p className="text-sm text-zinc-300 truncate">{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : query ? (
        <p className="text-zinc-400">No results found.</p>
      ) : null}
      <Footer />
    </div>
  );
};

export default Search;
