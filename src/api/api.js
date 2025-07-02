import axios from "axios";

const API_KEY = "8517144c199ceff85f7a2ec4d03a8641";
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const searchMovies = (query) =>
  api.get("/search/movie", { params: { query } });

export const getMovieById = (id) =>
  api.get(`/movie/${id}`, { params: { language: "en-US" } });

export const fetchPopularMovies = () =>
  api.get("/movie/popular").then((res) => res.data.results);

export const fetchTrendingMovies = () =>
  api.get("/trending/movie/day").then((res) => res.data.results);

export const fetchGenres = () =>
  api.get("/genre/movie/list").then((res) => res.data.genres);

export const fetchMoviesByGenre = (genreId) =>
  api
    .get("/discover/movie", {
      params: {
        with_genres: genreId,
        sort_by: "popularity.desc",
      },
    })
    .then((res) => res.data.results);
