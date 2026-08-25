export interface SourceConfig {
  id: string
  name: string
  description: string
  origin: string
  premium?: boolean
  recommended?: boolean
  features?: string[]
  buildMovieUrl: (tmdbId: number, params?: Record<string, string>) => string
  buildTVUrl: (tmdbId: number, season: number, episode: number, params?: Record<string, string>) => string
}

const SOURCES: SourceConfig[] = [
  {
    id: "vidcore",
    name: "VidCore",
    description: "Premium quality",
    origin: "https://www.vidcore.org",
    premium: true,
    recommended: true,
    features: ["4K Ultra HD", "Chromecast"],
    buildMovieUrl(tmdbId, params = {}) {
      const base = `https://www.vidcore.org/embed/movie/${tmdbId}`
      const qs = buildQueryString(params)
      return qs ? `${base}?${qs}` : base
    },
    buildTVUrl(tmdbId, season, episode, params = {}) {
      const base = `https://www.vidcore.org/embed/tv/${tmdbId}/${season}/${episode}`
      const qs = buildQueryString(params)
      return qs ? `${base}?${qs}` : base
    },
  },
  {
    id: "peachify",
    name: "Peachify",
    description: "Fast & reliable",
    origin: "https://peachify.top",
    features: ["Fast loading", "Multi-audio"],
    buildMovieUrl(tmdbId, params = {}) {
      const base = `https://peachify.top/embed/movie/${tmdbId}`
      const qs = buildQueryString(params)
      return qs ? `${base}?${qs}` : base
    },
    buildTVUrl(tmdbId, season, episode, params = {}) {
      const base = `https://peachify.top/embed/tv/${tmdbId}/${season}/${episode}`
      const allParams = { autoNext: "30", showNextBtn: "true", ...params }
      const qs = buildQueryString(allParams)
      return qs ? `${base}?${qs}` : base
    },
  },
  {
    id: "vidsrc",
    name: "VidSrc",
    description: "Multi-server",
    origin: "https://vidsrc.fyi",
    buildMovieUrl(tmdbId) {
      return `https://vidsrc.fyi/embed/movie/${tmdbId}`
    },
    buildTVUrl(tmdbId, season, episode) {
      return `https://vidsrc.fyi/embed/tv/${tmdbId}/${season}/${episode}`
    },
  },
  {
    id: "videasy",
    name: "Ctv Pro",
    description: "Premium 4K · Currently offline",
    origin: "https://player.videasy.net",
    premium: true,
    features: ["4K Ultra HD", "Live TV", "Live Sports", "Anime"],
    buildMovieUrl(tmdbId, params = {}) {
      const allParams = { overlay: "true", color: "DA1B1B", ...params }
      const base = `https://player.videasy.net/movie/${tmdbId}`
      const qs = buildQueryString(allParams)
      return qs ? `${base}?${qs}` : base
    },
    buildTVUrl(tmdbId, season, episode, params = {}) {
      const allParams = {
        nextEpisode: "true",
        episodeSelector: "true",
        autoplayNextEpisode: "true",
        overlay: "true",
        color: "DA1B1B",
        ...params,
      }
      const base = `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`
      const qs = buildQueryString(allParams)
      return qs ? `${base}?${qs}` : base
    },
  },
  {
    id: "vidking",
    name: "VidKing",
    description: "Currently offline",
    origin: "https://www.vidking.net",
    buildMovieUrl(tmdbId, params = {}) {
      const allParams = { autoPlay: "true", ...params }
      const base = `https://www.vidking.net/embed/movie/${tmdbId}`
      const qs = buildQueryString(allParams)
      return qs ? `${base}?${qs}` : base
    },
    buildTVUrl(tmdbId, season, episode, params = {}) {
      const allParams = { autoPlay: "true", ...params }
      const base = `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}`
      const qs = buildQueryString(allParams)
      return qs ? `${base}?${qs}` : base
    },
  },
]

function buildQueryString(params?: Record<string, string>): string {
  if (!params) return ""
  const entries = Object.entries(params).filter(([, v]) => v && v !== "auto")
  return entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&")
}

export function getSource(id: string): SourceConfig | undefined {
  return SOURCES.find((s) => s.id === id)
}

export function getSources(): SourceConfig[] {
  return SOURCES
}

export const DEFAULT_SOURCE = "peachify"
export const PREMIUM_SOURCE = "vidcore"