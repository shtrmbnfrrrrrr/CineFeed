import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../api/api";
import axios from "axios";

const API_KEY = "8517144c199ceff85f7a2ec4d03a8641";
const BASE_URL = "https://api.themoviedb.org/3";

const SearchBar = ({
  className = "",
  showInlineResults = false,
  results,
  setResults,
}) => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuickSearch = async () => {
      if (!showInlineResults || !term.trim()) {
        setResults?.([]);
        return;
      }

      try {
        const res = await searchMovies(term);
        setResults?.(res.data.results.slice(0, 5)); // Only show top 5
      } catch (err) {
        console.error("Live search error:", err);
      }
    };

    const debounce = setTimeout(fetchQuickSearch, 300);
    return () => clearTimeout(debounce);
  }, [term]);

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
