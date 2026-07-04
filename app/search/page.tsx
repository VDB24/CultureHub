"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearch } from "@/hooks/useTMDB"
import { MediaCard } from "@/components/MediaCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, X } from "lucide-react"

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = use(searchParams)
  const router = useRouter()
  const [query, setQuery] = useState(resolvedParams.q || "")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setQuery(resolvedParams.q || "")
    setPage(1)
  }, [resolvedParams.q])

  const { data, isLoading } = useSearch(query, page)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const results = data?.results?.filter(
    (item: any) => item.media_type === "movie" || item.media_type === "tv"
  ) || []

  const totalPages = Math.min(data?.total_pages || 1, 500)

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies & TV shows..."
            className="pl-12 pr-12 h-14 text-lg bg-zinc-900 border-zinc-700 focus:border-primary rounded-xl"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); router.push("/search") }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>

      {query && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-4 w-20 mt-2" />
                  <Skeleton className="h-3 w-14 mt-1" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-zinc-500 mb-6">
                {data?.total_results
                  ? `${data.total_results.toLocaleString()} results for "${query}"`
                  : `No results for "${query}"`}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.map((item: any) => (
                  <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
                ))}
              </div>

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
        </>
      )}

      {!query && (
        <div className="text-center py-20 text-zinc-500">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl">Search for movies & TV shows</p>
          <p className="text-sm mt-2">Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  )
}
