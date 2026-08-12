const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export const WATCH_REGION = "IN"

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!key || key === "your_tmdb_api_key_here") {
    console.warn("TMDB API key not set. Set NEXT_PUBLIC_TMDB_API_KEY in .env.local")
  }
  return key || ""
}

async function tmdbFetch<T>(endpoint: string, revalidate?: number): Promise<T> {
  const apiKey = getApiKey()
  const separator = endpoint.includes("?") ? "&" : "?"
  const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${apiKey}`

  const res = await fetch(url, {
    next: revalidate ? { revalidate } : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`TMDB API error ${res.status}: ${res.statusText}. ${text}`)
  }

  return res.json()
}

import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBMovieDetails,
  TMDBTVDetails,
  PaginatedResponse,
  SeasonDetails,
  Genre,
} from "./types"

// Trending
export function fetchTrendingMovies(timeWindow: "day" | "week" = "week") {
  return tmdbFetch<PaginatedResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`)
}

export function fetchTrendingTV(timeWindow: "day" | "week" = "week") {
  return tmdbFetch<PaginatedResponse<TMDBTVShow>>(`/trending/tv/${timeWindow}`)
}

// Popular / Top Rated / Now Playing / Upcoming
export function fetchPopularMovies(page = 1) {
  return tmdbFetch<PaginatedResponse<TMDBMovie>>(`/movie/popular?page=${page}`)
}

export function fetchTopRatedMovies(page = 1) {
  return tmdbFetch<PaginatedResponse<TMDBMovie>>(`/movie/top_rated?page=${page}`)
}

export function fetchNowPlayingMovies(page = 1) {
  return tmdbFetch<PaginatedResponse<TMDBMovie>>(`/movie/now_playing?page=${page}`)
}

export function fetchUpcomingMovies(page = 1) {
  return tmdbFetch<PaginatedResponse<TMDBMovie>>(`/movie/upcoming?page=${page}`)
}

export function fetchPopularTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TMDBTVShow>>(`/tv/popular?page=${page}`)
}

export function fetchTopRatedTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TMDBTVShow>>(`/tv/top_rated?page=${page}`)
}

export function fetchAiringTodayTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TMDBTVShow>>(`/tv/airing_today?page=${page}`)
}

export function fetchOnTheAirTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TMDBTVShow>>(`/tv/on_the_air?page=${page}`)
}

// Details
export function fetchMovieDetails(id: number) {
  return tmdbFetch<TMDBMovieDetails>(
    `/movie/${id}?append_to_response=credits,videos,similar,recommendations`
  )
}

export function fetchTVDetails(id: number) {
  return tmdbFetch<TMDBTVDetails>(
    `/tv/${id}?append_to_response=credits,videos,similar,recommendations`
  )
}

export function fetchSeasonDetails(tvId: number, seasonNumber: number) {
  return tmdbFetch<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`)
}

// Discover with filters
export interface DiscoverParams {
  page?: number
  sort_by?: string
  with_genres?: string
  with_original_language?: string
  year?: number
  "vote_count.gte"?: number
  with_watch_providers?: string
  watch_region?: string
}

export function discoverMovies(params: DiscoverParams = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) query.set(key, String(val))
  })
  return tmdbFetch<PaginatedResponse<TMDBMovie>>(`/discover/movie?${query.toString()}`)
}

export function discoverTV(params: DiscoverParams = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) query.set(key, String(val))
  })
  return tmdbFetch<PaginatedResponse<TMDBTVShow>>(`/discover/tv?${query.toString()}`)
}

// Search
export function searchMulti(query: string, page = 1) {
  return tmdbFetch<PaginatedResponse<TMDBMovie>>(
    `/search/multi?query=${encodeURIComponent(query)}&page=${page}`
  )
}

// Genres
export function fetchMovieGenres() {
  return tmdbFetch<{ genres: Genre[] }>("/genre/movie/list")
}

export function fetchTVGenres() {
  return tmdbFetch<{ genres: Genre[] }>("/genre/tv/list")
}

// Watch providers
export interface WatchProvider {
  provider_id: number
  provider_name: string
  logo_path: string | null
}

export function fetchWatchProviders(mediaType: "movie" | "tv", region = WATCH_REGION) {
  return tmdbFetch<{ results: WatchProvider[] }>(
    `/watch/providers/${mediaType}?watch_region=${encodeURIComponent(region)}&language=en-US`
  )
}

// Hindi content helpers
export function fetchHindiMovies(page = 1) {
  return discoverMovies({ with_original_language: "hi", page, sort_by: "popularity.desc" })
}

export function fetchHindiTV(page = 1) {
  return discoverTV({ with_original_language: "hi", page, sort_by: "popularity.desc" })
}

// Language list for filtering
export const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  te: "Telugu",
  ta: "Tamil",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  es: "Spanish",
  fr: "French",
  ja: "Japanese",
  ko: "Korean",
  de: "German",
  zh: "Chinese",
}
