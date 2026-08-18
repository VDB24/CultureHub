"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useTVDetails } from "@/hooks/useTMDB"
import { VideoPlayer } from "@/components/VideoPlayer"
import { ServerSelector } from "@/components/ServerSelector"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DEFAULT_SOURCE } from "@/lib/sources"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

export default function WatchTVPage({
  params,
}: {
  params: Promise<{ id: string; season: string; episode: string }>
}) {
  const { id, season, episode } = use(params)
  const tvId = Number(id)
  const seasonNum = Number(season)
  const episodeNum = Number(episode)

  const { data: show, isLoading } = useTVDetails(tvId)
  const [source, setSource] = useState(DEFAULT_SOURCE)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  if (!show) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-zinc-500">Show not found</p>
      </div>
    )
  }

  const prevEpisode = episodeNum > 1
    ? `/watch/tv/${tvId}/${seasonNum}/${episodeNum - 1}`
    : null
  const nextEpisode = `/watch/tv/${tvId}/${seasonNum}/${episodeNum + 1}`

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="hidden md:flex absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-20 items-center gap-2">
        <Link href={`/tv/${show.id}`}>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white gap-2 bg-black/40 hover:bg-black/60">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="md:hidden absolute z-20 top-[max(0.75rem,env(safe-area-inset-top))] left-3 right-3 flex items-center gap-2">
        <Link href={`/tv/${show.id}`} className="shrink-0">
          <Button variant="ghost" size="icon" className="bg-black/40 hover:bg-black/60 text-white/80" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <ServerSelector source={source} onChange={setSource} />
        </div>
      </div>

      <VideoPlayer
        tmdbId={tvId}
        mediaType="tv"
        season={seasonNum}
        episode={episodeNum}
        title={`${show.name} S${seasonNum}E${episodeNum}`}
        posterPath={show.poster_path}
        source={source}
        fill
      />

      <div className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <div className="hidden md:flex">
          <ServerSelector source={source} onChange={setSource} />
        </div>

        <div className="flex items-center gap-3 max-w-[92vw]">
          {prevEpisode ? (
            <Link href={prevEpisode}>
              <Button variant="secondary" size="sm" className="gap-2 bg-black/60 hover:bg-black/80">
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="sm" className="gap-2 opacity-50 bg-black/60" disabled>
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
          )}

          <span className="text-sm text-zinc-300 bg-black/60 px-4 py-2 rounded-lg truncate min-w-0 max-w-[34vw] sm:max-w-none">
            {show.name} S{String(seasonNum).padStart(2, "0")}E{String(episodeNum).padStart(2, "0")}
          </span>

          <Link href={nextEpisode}>
            <Button variant="secondary" size="sm" className="gap-2 bg-black/60 hover:bg-black/80">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
