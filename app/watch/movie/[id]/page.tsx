"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useMovieDetails } from "@/hooks/useTMDB"
import { VideoPlayer } from "@/components/VideoPlayer"
import { ServerSelector } from "@/components/ServerSelector"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DEFAULT_SOURCE } from "@/lib/sources"
import { ArrowLeft } from "lucide-react"

export default function WatchMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const movieId = Number(id)
  const { data: movie, isLoading } = useMovieDetails(movieId)
  const [source, setSource] = useState(DEFAULT_SOURCE)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-zinc-500">Movie not found</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="hidden md:block absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-20">
        <Link href={`/movie/${movie.id}`}>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white gap-2 bg-black/40 hover:bg-black/60">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="md:hidden absolute z-20 top-[max(0.75rem,env(safe-area-inset-top))] left-3 right-3 flex items-center gap-2">
        <Link href={`/movie/${movie.id}`} className="shrink-0">
          <Button variant="ghost" size="icon" className="bg-black/40 hover:bg-black/60 text-white/80" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <ServerSelector source={source} onChange={setSource} />
        </div>
      </div>

      <div className="hidden md:block absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20">
        <ServerSelector source={source} onChange={setSource} />
      </div>

      <VideoPlayer
        tmdbId={movie.id}
        mediaType="movie"
        title={movie.title}
        posterPath={movie.poster_path}
        source={source}
        fill
      />
    </div>
  )
}
