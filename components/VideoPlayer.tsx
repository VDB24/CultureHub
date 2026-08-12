"use client"

import { useEffect, useRef, useCallback } from "react"
import { useContinueWatching } from "@/hooks/useContinueWatching"
import { getSource, DEFAULT_SOURCE } from "@/lib/sources"
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
  source?: string
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
  source = DEFAULT_SOURCE,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { addItem } = useContinueWatching()

  const buildUrl = useCallback(() => {
    const config = getSource(source)
    if (!config) return ""

    const params: Record<string, string> = {}

    if (autoPlay) params.autoPlay = "true"

    if (source === "peachify") {
      params.cast = "hide"
      if (dub) params.dub = dub
      if (sub) params.sub = sub
      if (quality && quality !== "auto") params.q = quality
    }

    if (source === "vidcore") {
      params.chromecast = "true"
      if (sub) params.sub = sub
      if (title) params.title = title
      if (posterPath) params.poster = posterPath
    }

    if (mediaType === "movie") {
      return config.buildMovieUrl(tmdbId, params)
    }

    return config.buildTVUrl(tmdbId, season || 1, episode || 1, params)
  }, [tmdbId, mediaType, season, episode, dub, sub, quality, autoPlay, source, title, posterPath])

  useEffect(() => {
    const config = getSource(source)
    if (!config) return

    const allowedOrigin = config.origin

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== allowedOrigin) return

      if (source === "peachify") {
        if (event.data?.type === "MEDIA_DATA") {
          const data = event.data.data
          if (data) {
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
      }

      if (source === "vidcore") {
        if (event.data?.type === "PLAYER_EVENT") {
          const ev = event.data.data
          if (ev?.event === "timeupdate" && ev.currentTime != null && ev.duration != null) {
            const item: ContinueWatchingItem = {
              id: tmdbId,
              type: mediaType,
              title,
              poster_path: posterPath || null,
              progress: { watched: ev.currentTime, duration: ev.duration },
            }
            if (mediaType === "tv") {
              item.last_season_watched = String(season || 1)
              item.last_episode_watched = String(episode || 1)
            }
            addItem(item)
          }
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [tmdbId, mediaType, season, episode, title, posterPath, source, addItem])

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
