"use client"

import { useState, useMemo } from "react"
import { MediaCard } from "@/components/MediaCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useDiscoverTV } from "@/hooks/useTMDB"
import { ChevronDown, Filter, Crown, Sparkles } from "lucide-react"

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity" },
  { value: "vote_average.desc", label: "Rating" },
  { value: "first_air_date.desc", label: "Release Date" },
  { value: "name.asc", label: "Title A-Z" },
]

export default function AnimePage() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("popularity.desc")
  const [showFilters, setShowFilters] = useState(false)

  const params = useMemo(
    () => ({
      page,
      sort_by: sortBy,
      with_genres: "16",
      with_original_language: "ja",
      "vote_count.gte": sortBy === "vote_average.desc" ? 100 : undefined,
    }),
    [page, sortBy]
  )

  const { data, isLoading } = useDiscoverTV(params)
  const totalPages = Math.min(data?.total_pages || 1, 500)

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero strip */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 glow-spots shadow-apple-hero-panel mb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#140c1a] via-[#0c0c14] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative p-8 sm:p-12 lg:p-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/15 text-rose-300 text-xs font-semibold tracking-[0.14em] uppercase mb-5">
            <Crown className="w-3.5 h-3.5" />
            Exclusive to Ctv Pro
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-3">
            <span className="text-glow">Anime</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mb-6">
            The best of Japanese animation — action, romance, fantasy and slice-of-life series,
            streaming in stunning quality.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span>
              Anime plays on the <span className="text-rose-300 font-semibold">Ctv Pro viewer</span> (Videasy).
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Sort
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
          <span className="hidden sm:inline text-sm text-zinc-500">{totalPages} pages</span>
        </div>
      </div>

      {showFilters && (
        <div className="glass-deep border border-white/10 rounded-2xl p-4 mb-6 animate-fade-in">
          <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
            className="w-full sm:w-72 bg-white/[0.06] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
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
              <MediaCard key={item.id} item={item} tag="Anime" />
            ))}
          </div>

          {data?.results?.length === 0 && (
            <div className="text-center py-20 text-zinc-500">
              <p className="text-lg">No anime found</p>
              <p className="text-sm mt-1">Try a different sort</p>
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