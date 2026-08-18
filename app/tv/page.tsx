"use client"

import { useState, useMemo } from "react"
import { MediaCard } from "@/components/MediaCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useDiscoverTV,
  useTVGenres,
} from "@/hooks/useTMDB"
import { LANGUAGE_MAP } from "@/lib/tmdb"
import { ChevronDown, Filter } from "lucide-react"

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity" },
  { value: "vote_average.desc", label: "Rating" },
  { value: "first_air_date.desc", label: "Release Date" },
  { value: "name.asc", label: "Title A-Z" },
]

export default function TVPage() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("popularity.desc")
  const [genreFilter, setGenreFilter] = useState("")
  const [langFilter, setLangFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const params = useMemo(
    () => ({
      page,
      sort_by: sortBy,
      with_genres: genreFilter || undefined,
      with_original_language: langFilter || undefined,
      "vote_count.gte": sortBy === "vote_average.desc" ? 100 : undefined,
    }),
    [page, sortBy, genreFilter, langFilter]
  )

  const { data, isLoading } = useDiscoverTV(params)
  const genresQuery = useTVGenres()

  const genres = genresQuery.data?.genres || []
  const totalPages = Math.min(data?.total_pages || 1, 500)

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl sm:text-4xl text-white">TV Shows</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {showFilters && (
        <div className="glass-deep border border-white/10 rounded-2xl p-4 mb-6 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                className="w-full bg-white/[0.06] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Genre</label>
              <select
                value={genreFilter}
                onChange={(e) => { setGenreFilter(e.target.value); setPage(1) }}
                className="w-full bg-white/[0.06] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md"
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Language</label>
              <select
                value={langFilter}
                onChange={(e) => { setLangFilter(e.target.value); setPage(1) }}
                className="w-full bg-white/[0.06] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md"
              >
                <option value="">All Languages</option>
                {Object.entries(LANGUAGE_MAP).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[2/3] rounded-2xl" />
              <Skeleton className="h-4 w-20 mt-2" />
              
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {data?.results?.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>

          {data?.results?.length === 0 && (
            <div className="text-center py-20 text-zinc-500">
              <p className="text-lg">No TV shows found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-zinc-400 px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
