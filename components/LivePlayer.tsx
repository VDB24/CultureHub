"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { WifiOff, Loader2 } from "lucide-react"

interface LivePlayerProps {
  title: string
  streams: string[]
  overlay?: React.ReactNode
}

export function LivePlayer({ title, streams, overlay }: LivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<"loading" | "playing" | "failed">("loading")

  useEffect(() => {
    const video = videoRef.current
    if (!video || streams.length === 0 || index >= streams.length) {
      setStatus("failed")
      return
    }

    const url = streams[index]
    let hls: Hls | null = null
    let cancelled = false

    const advance = () => setIndex((i) => i + 1)
    setStatus("loading")

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, maxBufferLength: 30 })
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (cancelled) return
        setStatus("playing")
        video.play().catch(() => {})
      })
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (cancelled || !data.fatal) return
        hls?.destroy()
        hls = null
        advance()
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url
      const onLoaded = () => {
        if (cancelled) return
        setStatus("playing")
        video.play().catch(() => {})
      }
      const onError = () => advance()
      video.addEventListener("loadedmetadata", onLoaded)
      video.addEventListener("error", onError)
      return () => {
        cancelled = true
        video.removeEventListener("loadedmetadata", onLoaded)
        video.removeEventListener("error", onError)
        video.removeAttribute("src")
        video.load()
      }
    } else {
      setStatus("failed")
      return
    }

    return () => {
      cancelled = true
      hls?.destroy()
      video.removeAttribute("src")
      video.load()
    }
  }, [index, streams])

  const failed = status === "failed" || streams.length === 0

  return (
    <div className="absolute inset-0 bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        autoPlay
        playsInline
      />

      {overlay}

      {status === "loading" && !failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 pointer-events-none">
          <Loader2 className="w-8 h-8 text-rose-300 animate-spin" />
          <p className="text-sm text-zinc-400">Connecting to {title}…</p>
        </div>
      )}

      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
          <WifiOff className="w-10 h-10 text-zinc-600" />
          <p className="text-white font-semibold">Stream unavailable</p>
          <p className="text-sm text-zinc-500 max-w-xs text-center">
            This channel is temporarily off the air. Try again in a few minutes.
          </p>
        </div>
      )}
    </div>
  )
}