"use client"

import { useEffect, useRef, useCallback } from "react"
import { useContinueWatching } from "@/hooks/useContinueWatching"
import type { ContinueWatchingItem } from "@/lib/types"

interface VideoPlayerProps {
  tmdbId: number
  mediaType: "movie" | "tv"
  season?: number
  episode?: number
  title?: string
  posterPath?: string | null
  dub?: string
  sub?: string
  quality?: string
  autoPlay?: boolean
  fill?: boolean
  className?: string
}

export function VideoPlayer({
  tmdbId,
  mediaType,
  season,
  episode,
  title = "",
  posterPath,
  dub,
  sub,
  quality,
  autoPlay = true,
  fill,
  className,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { addItem } = useContinueWatching()

  const buildUrl = useCallback(() => {
    const base = mediaType === "movie"
      ? `/api/embed/movie/${tmdbId}`
      : `/api/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`

    const params = new URLSearchParams()

    if (!autoPlay) params.set("autoPlay", "false")
    if (dub) params.set("dub", dub)
    if (sub) params.set("sub", sub)
    if (quality && quality !== "auto") params.set("q", quality)
    if (mediaType === "tv") {
      params.set("autoNext", "30")
      params.set("showNextBtn", "true")
    }

    const qs = params.toString()
    return qs ? `${base}?${qs}` : base
  }, [tmdbId, mediaType, season, episode, dub, sub, quality, autoPlay])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data?.type === "MEDIA_DATA") {
        const data = event.data.data
        if (data) {
          // Save to localStorage via the hook
          const item: ContinueWatchingItem = {
            id: tmdbId,
            type: mediaType,
            title: title || data[tmdbId]?.title || "",
            poster_path: posterPath || data[tmdbId]?.poster_path || null,
            progress: data[tmdbId]?.progress || { watched: 0, duration: 0 },
          }
          if (mediaType === "tv") {
            item.last_season_watched = String(season || 1)
            item.last_episode_watched = String(episode || 1)
            item.show_progress = data[tmdbId]?.show_progress
          }
          addItem(item)
        }
      }

      if (event.data?.type === "PLAYER_EVENT") {
        const { event: playerEvent, currentTime, duration } = event.data.data
        // Could be used for analytics
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [tmdbId, mediaType, season, episode, title, posterPath, addItem])

  return (
    <div className={cn("relative bg-black overflow-hidden", fill ? "w-full h-full" : "w-full aspect-video rounded-xl", className)}>
      <iframe
        ref={iframeRef}
        src={buildUrl()}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title || `${mediaType} player`}
      />
    </div>
  )
}

function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ")
}
