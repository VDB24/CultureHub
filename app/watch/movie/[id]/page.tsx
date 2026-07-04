"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useMovieDetails } from "@/hooks/useTMDB"
import { VideoPlayer } from "@/components/VideoPlayer"
import { QualitySelector } from "@/components/QualitySelector"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Info } from "lucide-react"

export default function WatchMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const movieId = Number(id)
  const { data: movie, isLoading } = useMovieDetails(movieId)
  const [quality, setQuality] = useState("auto")

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
      <div className="absolute top-4 left-4 z-20">
        <Link href={`/movie/${movie.id}`}>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white gap-2 bg-black/40 hover:bg-black/60">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <QualitySelector quality={quality} onChange={setQuality} />
        <Link href={`/movie/${movie.id}`}>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white gap-2 bg-black/40 hover:bg-black/60">
            <Info className="w-4 h-4" />
            Details
          </Button>
        </Link>
      </div>

      <VideoPlayer
        tmdbId={movie.id}
        mediaType="movie"
        title={movie.title}
        posterPath={movie.poster_path}
        quality={quality}
        fill
      />
    </div>
  )
}
