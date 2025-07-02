import { useEffect, useRef, useState } from "react";
import {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchGenres,
  fetchMoviesByGenre,
} from "../api/api";
import { Link } from "react-router-dom";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
const SCROLL_AMOUNT = 300;

const Home = () => {
  const [popular, setPopular] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [inlineResults, setInlineResults] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [showMovieLeftArrow, setShowMovieLeftArrow] = useState(false);
  const [showMovieRightArrow, setShowMovieRightArrow] = useState(true);
  const [showGenreLeftArrow, setShowGenreLeftArrow] = useState(false);
  const [showGenreRightArrow, setShowGenreRightArrow] = useState(true);

  const movieScrollRef = useRef(null);
  const genreScrollRef = useRef(null);

  useEffect(() => {
    const loadInitial = async () => {
      const [popularData, trendingData, genresData] = await Promise.all([
        fetchPopularMovies(),
        fetchTrendingMovies(),
        fetchGenres(),
      ]);
      setPopular(popularData);
      setHeroMovie(trendingData[0]);
      setGenres([{ id: "All", name: "All" }, ...genresData]);
    };
    loadInitial();
  }, []);

  // scroll handlers
  useEffect(() => {
    const updateScrollArrows = (ref, setLeft, setRight) => {
      if (!ref.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setLeft(scrollLeft > 10);
      setRight(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const handleMovieScroll = () =>
      updateScrollArrows(
        movieScrollRef,
        setShowMovieLeftArrow,
        setShowMovieRightArrow
      );

    const handleGenreScroll = () =>
      updateScrollArrows(
        genreScrollRef,
        setShowGenreLeftArrow,
        setShowGenreRightArrow
      );

    const movieEl = movieScrollRef.current;
    const genreEl = genreScrollRef.current;

    movieEl?.addEventListener("scroll", handleMovieScroll);
    genreEl?.addEventListener("scroll", handleGenreScroll);

    handleMovieScroll();
    handleGenreScroll();

    return () => {
      movieEl?.removeEventListener("scroll", handleMovieScroll);
      genreEl?.removeEventListener("scroll", handleGenreScroll);
    };
  }, [popular, genres]);

  // filter movies by genre
  useEffect(() => {
    const loadByGenre = async () => {
      if (selectedGenre === "All") {
        const data = await fetchPopularMovies();
        setPopular(data);
      } else {
        const data = await fetchMoviesByGenre(selectedGenre);
        setPopular(data);
      }
    };
    loadByGenre();
  }, [selectedGenre]);

  // scroll helpers
  const scrollBy = (ref, amount) => {
    ref.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="bg-zinc-900 text-white min-h-screen px-4 py-2 pb-10">
      {/* Header */}
      <Header
        showSearch={true}
        inlineResults={inlineResults}
        setInlineResults={setInlineResults}
      />

      {/* Hero */}
      {heroMovie && (
        <section
          className="relative bg-black rounded-xl overflow-hidden mb-6 h-64 md:h-80 lg:h-140
             pt-16 md:pt-0"
        >
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
              alt={heroMovie.title}
              className="w-full h-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          </div>
          <div className="relative z-10 h-full flex items-center px-6 md:px-12">
            <div className="text-white max-w-xl">
              <div className="bg-yellow-400 text-black text-xs inline-block px-2 py-1 rounded font-semibold mb-3">
                Most Pupular
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight mb-2">
                {heroMovie.title}
              </h2>
              <p className="text-sm md:text-base text-zinc-300 mb-4 line-clamp-2">
                {heroMovie.overview}
              </p>
              <Link to={`/movie/${heroMovie.id}`}>
                <button className="px-5 py-2 bg-white text-black rounded hover:bg-zinc-200 transition font-semibold text-sm hover:cursor-pointer">
                  ▶ Watch Now
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <div className="relative mb-4">
        <button
          onClick={() => scrollBy(genreScrollRef, -SCROLL_AMOUNT)}
          disabled={!showGenreLeftArrow}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-zinc-800 p-2 rounded-full z-10 transition ${
            showGenreLeftArrow ? "hover:bg-red-500 cursor-pointer" : "opacity-0"
          }`}
        >
          <FaChevronLeft size={14} className="text-white" />
        </button>

        <button
          onClick={() => scrollBy(genreScrollRef, SCROLL_AMOUNT)}
          disabled={!showGenreRightArrow}
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-800 p-2 rounded-full z-10 transition ${
            showGenreRightArrow
              ? "hover:bg-red-500 cursor-pointer"
              : "opacity-40 cursor-default"
          }`}
        >
          <FaChevronRight size={14} className="text-white" />
        </button>

        <div
          ref={genreScrollRef}
          className="flex gap-2 overflow-x-auto hide-scrollbar"
        >
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-6 py-2 rounded-full text-sm transition whitespace-nowrap ${
                selectedGenre === genre.id
                  ? "bg-red-500 text-white"
                  : "bg-zinc-700 text-zinc-200 hover:bg-red-500 hover:text-white cursor-pointer"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Row */}
      <section className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">
            {selectedGenre === "All"
              ? "Featured"
              : genres.find((g) => g.id === selectedGenre)?.name || "Movies"}
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollBy(movieScrollRef, -SCROLL_AMOUNT)}
            disabled={!showMovieLeftArrow}
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-zinc-800 p-2 rounded-full z-10 transition ${
              showMovieLeftArrow
                ? "hover:bg-red-500 cursor-pointer"
                : "opacity-40 cursor-default"
            }`}
          >
            <FaChevronLeft size={18} className="text-white" />
          </button>

          <button
            onClick={() => scrollBy(movieScrollRef, SCROLL_AMOUNT)}
            disabled={!showMovieRightArrow}
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-800 p-2 rounded-full z-10 transition ${
              showMovieRightArrow
                ? "hover:bg-red-500 cursor-pointer"
                : "opacity-40 cursor-default"
            }`}
          >
            <FaChevronRight size={18} className="text-white" />
          </button>

          <div
            ref={movieScrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scroll-smooth hide-scrollbar"
          >
            {popular.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="w-32 shrink-0"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg mb-1"
                />
                <p className="text-sm truncate">{movie.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
