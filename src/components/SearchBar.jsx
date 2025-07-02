import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../api/api";
import { debounce } from "../utils/debounce";

const SearchBar = ({
  className = "",
  showInlineResults = false,
  results,
  setResults,
}) => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const debouncedFetch = useMemo(
    () =>
      debounce(async (query) => {
        if (!showInlineResults || !query.trim()) {
          setResults?.([]);
          return;
        }

        try {
          const res = await searchMovies(query);
          setResults?.(res.data.results.slice(0, 5));
        } catch (err) {
          console.error("Live search error:", err);
        }
      }, 300),
    [showInlineResults, setResults]
  );

  useEffect(() => {
    debouncedFetch(term);
  }, [term, debouncedFetch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/search?query=${encodeURIComponent(term.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search movies..."
        className="w-full px-4 py-2 rounded-full bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </form>
  );
};

export default SearchBar;
