"use client"

import { useQuery } from "@tanstack/react-query"
import * as tmdb from "@/lib/tmdb"

function useMediaQuery<T>(key: (string | number)[], fn: () => Promise<T>, enabled = true) {
  return useQuery<T>({
    queryKey: key,
    queryFn: fn,
    enabled,
  })
}

// Trending
export function useTrendingMovies(timeWindow: "day" | "week" = "week") {
  return useMediaQuery(["trending", "movies", timeWindow], () => tmdb.fetchTrendingMovies(timeWindow))
}

export function useTrendingTV(timeWindow: "day" | "week" = "week") {
  return useMediaQuery(["trending", "tv", timeWindow], () => tmdb.fetchTrendingTV(timeWindow))
}

// Popular
export function usePopularMovies(page = 1) {
  return useMediaQuery(["movies", "popular", page], () => tmdb.fetchPopularMovies(page))
}

export function useTopRatedMovies(page = 1) {
  return useMediaQuery(["movies", "top_rated", page], () => tmdb.fetchTopRatedMovies(page))
}

export function useNowPlayingMovies(page = 1) {
  return useMediaQuery(["movies", "now_playing", page], () => tmdb.fetchNowPlayingMovies(page))
}

export function usePopularTV(page = 1) {
  return useMediaQuery(["tv", "popular", page], () => tmdb.fetchPopularTV(page))
}

export function useTopRatedTV(page = 1) {
  return useMediaQuery(["tv", "top_rated", page], () => tmdb.fetchTopRatedTV(page))
}

export function useAiringTodayTV(page = 1) {
  return useMediaQuery(["tv", "airing_today", page], () => tmdb.fetchAiringTodayTV(page))
}

export function useOnTheAirTV(page = 1) {
  return useMediaQuery(["tv", "on_the_air", page], () => tmdb.fetchOnTheAirTV(page))
}

// Details
export function useMovieDetails(id: number) {
  return useMediaQuery(["movie", id], () => tmdb.fetchMovieDetails(id), id > 0)
}

export function useTVDetails(id: number) {
  return useMediaQuery(["tv", id], () => tmdb.fetchTVDetails(id), id > 0)
}

export function useSeasonDetails(tvId: number, seasonNumber: number) {
  return useMediaQuery(
    ["tv", tvId, "season", seasonNumber],
    () => tmdb.fetchSeasonDetails(tvId, seasonNumber),
    tvId > 0 && seasonNumber > 0
  )
}

// Discover
export function useDiscoverMovies(params: tmdb.DiscoverParams) {
  const key = JSON.stringify(params)
  return useMediaQuery(["discover", "movies", key], () => tmdb.discoverMovies(params))
}

export function useDiscoverTV(params: tmdb.DiscoverParams) {
  const key = JSON.stringify(params)
  return useMediaQuery(["discover", "tv", key], () => tmdb.discoverTV(params))
}

// Search
export function useSearch(query: string, page = 1) {
  return useMediaQuery(
    ["search", query, page],
    () => tmdb.searchMulti(query, page),
    query.length >= 2
  )
}

// Hindi content
export function useHindiMovies(page = 1) {
  return useMediaQuery(["hindi", "movies", page], () => tmdb.fetchHindiMovies(page))
}

export function useHindiTV(page = 1) {
  return useMediaQuery(["hindi", "tv", page], () => tmdb.fetchHindiTV(page))
}

// Genres
export function useMovieGenres() {
  return useMediaQuery(["genres", "movies"], () => tmdb.fetchMovieGenres())
}

export function useTVGenres() {
  return useMediaQuery(["genres", "tv"], () => tmdb.fetchTVGenres())
}

// Watch providers
export function useWatchProviders(region = tmdb.WATCH_REGION) {
  return useMediaQuery(["watch", "providers", region], () => tmdb.fetchWatchProviders("movie", region))
}

export function useProviderMovies(providerId: number, region = tmdb.WATCH_REGION) {
  return useMediaQuery(
    ["discover", "provider", "movies", providerId, region],
    () =>
      tmdb.discoverMovies({
        with_watch_providers: String(providerId),
        watch_region: region,
        sort_by: "popularity.desc",
      }),
    providerId > 0
  )
}

export function useProviderTV(providerId: number, region = tmdb.WATCH_REGION) {
  return useMediaQuery(
    ["discover", "provider", "tv", providerId, region],
    () =>
      tmdb.discoverTV({
        with_watch_providers: String(providerId),
        watch_region: region,
        sort_by: "popularity.desc",
      }),
    providerId > 0
  )
}
