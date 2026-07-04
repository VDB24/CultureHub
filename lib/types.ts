export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  original_language: string
  original_title: string
  adult: boolean
  video: boolean
  media_type?: string
}

export interface TMDBTVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  original_language: string
  original_name: string
  media_type?: string
}

export type MediaItem = TMDBMovie | TMDBTVShow

export interface TMDBMovieDetails extends TMDBMovie {
  genres: Genre[]
  runtime: number
  tagline: string
  budget: number
  revenue: number
  status: string
  homepage: string
  production_companies: ProductionCompany[]
  credits: Credits
  videos: VideoResults
  similar: PaginatedResponse<TMDBMovie>
  recommendations: PaginatedResponse<TMDBMovie>
}

export interface TMDBTVDetails extends TMDBTVShow {
  genres: Genre[]
  tagline: string
  status: string
  homepage: string
  number_of_seasons: number
  number_of_episodes: number
  seasons: Season[]
  created_by: Creator[]
  production_companies: ProductionCompany[]
  credits: Credits
  videos: VideoResults
  similar: PaginatedResponse<TMDBTVShow>
  recommendations: PaginatedResponse<TMDBTVShow>
}

export interface Season {
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  episode_count: number
  air_date: string
}

export interface SeasonDetails extends Season {
  episodes: Episode[]
}

export interface Episode {
  id: number
  name: string
  overview: string
  still_path: string | null
  season_number: number
  episode_number: number
  air_date: string
  vote_average: number
  runtime: number
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface Creator {
  id: number
  name: string
  profile_path: string | null
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface VideoResult {
  key: string
  site: string
  type: string
  name: string
}

export interface VideoResults {
  results: VideoResult[]
}

export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface ContinueWatchingItem {
  id: number
  type: "movie" | "tv"
  title: string
  poster_path: string | null
  progress: {
    watched: number
    duration: number
  }
  last_season_watched?: string
  last_episode_watched?: string
  show_progress?: Record<string, {
    season: string
    episode: string
    progress: {
      watched: number
      duration: number
    }
  }>
}
