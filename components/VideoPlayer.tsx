"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useContinueWatching } from "@/hooks/useContinueWatching"
import { getSource, getSources, DEFAULT_SOURCE } from "@/lib/sources"
import type { ContinueWatchingItem } from "@/lib/types"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const STATUS_CACHE_KEY = "culturehub-source-status"
const STATUS_CACHE_TTL = 300_000

interface SourceStatus {
  ok: boolean
  status: number
  ms: number
}

function getCachedStatuses(): Record<string, SourceStatus> | null {
  try {
    const raw = sessionStorage.getItem(STATUS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { data: Record<string, SourceStatus>; ts: number }
    if (Date.now() - parsed.ts > STATUS_CACHE_TTL) return null
    return parsed.data
  } catch {
    return null
  }
}

function setCachedStatuses(data: Record<string, SourceStatus>) {
  try {
    sessionStorage.setItem(STATUS_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

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
  const [effectiveSource, setEffectiveSource] = useState(source)
  const [failoverMsg, setFailoverMsg] = useState<string | null>(null)
  const [failoverVisible, setFailoverVisible] = useState(false)
  const failoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sourceStatusesRef = useRef<Record<string, SourceStatus> | null>(null)

  useEffect(() => {
    setEffectiveSource(source)
    setFailoverMsg(null)
    setFailoverVisible(false)
  }, [source])

  const showFailoverToast = useCallback((msg: string) => {
    setFailoverMsg(msg)
    setFailoverVisible(true)
    if (failoverTimer.current) clearTimeout(failoverTimer.current)
    failoverTimer.current = setTimeout(() => setFailoverVisible(false), 4000)
  }, [])

  useEffect(() => {
    return () => {
      if (failoverTimer.current) clearTimeout(failoverTimer.current)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function checkAndFailover() {
      const cached = getCachedStatuses()
      if (cached) {
        sourceStatusesRef.current = cached
        runFailover(cached)
        return
      }

      try {
        const res = await fetch("/api/source-status")
        if (!res.ok || cancelled) return
        const data: Record<string, SourceStatus> = await res.json()
        if (cancelled) return
        sourceStatusesRef.current = data
        setCachedStatuses(data)
        runFailover(data)
      } catch {}
    }

    function runFailover(statuses: Record<string, SourceStatus>) {
      const currentStatus = statuses[source]
      if (!currentStatus || currentStatus.ok) return

      const allSources = getSources()
      const healthy = allSources.find((s) => {
        const st = statuses[s.id]
        return st && st.ok
      })

      if (healthy && healthy.id !== source && !cancelled) {
        setEffectiveSource(healthy.id)
        showFailoverToast(
          `${getSource(source)?.name || source} is currently unavailable — switched to ${healthy.name}`
        )
      }
    }

    checkAndFailover()
    return () => { cancelled = true }
  }, [source, showFailoverToast])

  const buildUrl = useCallback(() => {
    const config = getSource(effectiveSource)
    if (!config) return ""

    const params: Record<string, string> = {}

    if (autoPlay) params.autoPlay = "true"

    if (effectiveSource === "videasy") {
      params.overlay = "true"
      if (dub) params.dub = dub
      if (sub) params.sub = sub
      if (quality && quality !== "auto") params.q = quality
      if (title) params.title = title
    }

    if (effectiveSource === "peachify") {
      params.cast = "hide"
      if (dub) params.dub = dub
      if (sub) params.sub = sub
      if (quality && quality !== "auto") params.q = quality
    }

    if (effectiveSource === "vidcore") {
      params.chromecast = "true"
      if (sub) params.sub = sub
      if (title) params.title = title
      if (posterPath) params.poster = posterPath
    }

    if (mediaType === "movie") {
      return config.buildMovieUrl(tmdbId, params)
    }

    return config.buildTVUrl(tmdbId, season || 1, episode || 1, params)
  }, [tmdbId, mediaType, season, episode, dub, sub, quality, autoPlay, effectiveSource, title, posterPath])

  useEffect(() => {
    const config = getSource(effectiveSource)
    if (!config) return

    const allowedOrigin = config.origin

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== allowedOrigin) return

      if (effectiveSource === "videasy") {
        const data = event.data
        if (data?.id && (data.type === "movie" || data.type === "tv" || data.type === "anime")) {
          const watched = Number(data.progress)
          const duration = Number(data.duration)
          if (watched > 0 && duration > 0) {
            const item: ContinueWatchingItem = {
              id: tmdbId,
              type: mediaType,
              title: title || data.title || "",
              poster_path: posterPath || null,
              progress: { watched, duration },
            }
            if (data.season != null && data.episode != null) {
              item.last_season_watched = String(data.season)
              item.last_episode_watched = String(data.episode)
            }
            addItem(item)
          }
        }
      }

      if (effectiveSource === "peachify") {
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

      if (effectiveSource === "vidcore") {
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
  }, [tmdbId, mediaType, season, episode, title, posterPath, effectiveSource, addItem])

  const config = getSource(effectiveSource)

  return (
    <div className={cn("relative bg-black overflow-hidden", fill ? "w-full h-full" : "w-full aspect-video rounded-xl", className)}>
      {config ? (
        <iframe
          ref={iframeRef}
          src={buildUrl()}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title || `${mediaType} player`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <AlertTriangle className="w-10 h-10 text-zinc-600" />
          <p className="text-white font-semibold">No servers available</p>
          <p className="text-sm text-zinc-500">Try again in a few minutes.</p>
        </div>
      )}

      {failoverMsg && (
        <div
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full border border-primary/30 bg-black/90 text-sm text-zinc-200 flex items-center gap-2 backdrop-blur-md transition-all duration-300",
            failoverVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          )}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          {failoverMsg}
        </div>
      )}
    </div>
  )
}
