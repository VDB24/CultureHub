"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getPosterUrl } from "@/lib/utils"
import { searchMulti } from "@/lib/tmdb"
import { Search, Loader2 } from "lucide-react"
import type { MediaItem, TMDBMovie, TMDBTVShow } from "@/lib/types"

interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<(MediaItem & { media_type?: string })[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [prevOpen, setPrevOpen] = useState(open)

  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      setQuery("")
      setResults([])
    }
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.length < 2) return

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const data = await searchMulti(query)
        setResults(
          data.results.filter((r) => r.media_type === "movie" || r.media_type === "tv")
        )
      } catch {
        // ignore
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleSelect = (item: MediaItem & { media_type?: string }) => {
    const isMovie = item.media_type === "movie" || "title" in item
    const id = item.id
    onOpenChange(false)
    router.push(isMovie ? `/movie/${id}` : `/tv/${id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl px-4 animate-scale-in">
        <div className="glass-deep border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden shadow-apple-card">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-zinc-400" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies & TV shows..."
              className="flex-1 bg-transparent text-white outline-none text-base placeholder:text-zinc-500"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 bg-white/[0.06] border border-white/10 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          {query.length >= 2 && (
            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 && !isSearching && (
                <div className="p-8 text-center text-zinc-500">No results found</div>
              )}
              {results.map((item) => {
                const isMovie = item.media_type === "movie" || "title" in item
                const title = isMovie
                  ? (item as TMDBMovie).title
                  : (item as TMDBTVShow).name
                const year = isMovie
                  ? (item as TMDBMovie).release_date?.split("-")[0]
                  : (item as TMDBTVShow).first_air_date?.split("-")[0]
                const mediaLabel = isMovie ? "Movie" : "TV"

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0 bg-zinc-800">
                      {item.poster_path && (
                        <Image
                          src={getPosterUrl(item.poster_path)}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{title}</p>
                      <p className="text-xs text-zinc-500">
                        {year && `${year} · `}{mediaLabel}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
