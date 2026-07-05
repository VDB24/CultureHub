export interface SourceConfig {
  id: string
  name: string
  description: string
  origin: string
  buildMovieUrl: (tmdbId: number, params?: Record<string, string>) => string
  buildTVUrl: (tmdbId: number, season: number, episode: number, params?: Record<string, string>) => string
}

const SOURCES: SourceConfig[] = [
  {
    id: "peachify",
    name: "Peachify",
    description: "Fast & reliable",
    origin: "https://peachify.top",
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
    id: "vidking",
    name: "VidKing",
    description: "Fast player",
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
  {
    id: "vidcore",
    name: "VidCore",
    description: "Premium quality",
    origin: "https://www.vidcore.org",
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
