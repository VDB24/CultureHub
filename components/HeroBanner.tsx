"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { getBackdropUrl, truncate, formatRating, getYear } from "@/lib/utils"
import type { MediaItem, TMDBMovie, TMDBTVShow } from "@/lib/types"

interface HeroBannerProps {
  items?: MediaItem[]
  isLoading?: boolean
}

export function HeroBanner({ items, isLoading }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const goTo = useCallback(
    (index: number) => {
      if (!items || isTransitioning) return
      setIsTransitioning(true)
      setCurrent(index)
      setTimeout(() => setIsTransitioning(false), 700)
    },
    [items, isTransitioning]
  )

  const next = useCallback(() => {
    if (!items) return
    goTo((current + 1) % items.length)
  }, [items, current, goTo])

  const prev = useCallback(() => {
    if (!items) return
    goTo((current - 1 + items.length) % items.length)
  }, [items, current, goTo])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStartRef.current
      touchStartRef.current = null
      if (!start || !items) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - start.x
      const dy = touch.clientY - start.y
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) next()
        else prev()
      }
    },
    [items, next, prev]
  )

  useEffect(() => {
    if (!items || items.length === 0) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [items, next])

  if (isLoading) {
    return (
      <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] min-h-[400px] bg-zinc-900 rounded-b-2xl overflow-hidden mb-8">
        <Skeleton className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <Skeleton className="h-10 w-96 mb-4" />
          <Skeleton className="h-5 w-64 mb-2" />
          <Skeleton className="h-20 w-[500px] mb-6" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-40" />
          </div>
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) return null

  const item = items[current]
  const isMovie = "title" in item
  const title = isMovie ? (item as TMDBMovie).title : (item as TMDBTVShow).name
  const date = isMovie ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date
  const overview = item.overview || "No overview available."
  const href = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`
  const watchHref = isMovie ? `/watch/movie/${item.id}` : `/watch/tv/${item.id}/1/1`

  return (
    <div
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] min-h-[400px] rounded-b-2xl overflow-hidden mb-8 group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop */}
      {items.map((it, idx) => (
        <div
          key={it.id}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            idx === current
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={getBackdropUrl(it.backdrop_path || it.poster_path)}
            alt=""
            fill
            className="object-cover"
            priority={idx === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-16 max-w-screen-2xl mx-auto">
        <div className="max-w-2xl animate-fade-in-up" key={current}>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <Badge variant="default" className="gap-1 px-3 py-1 glass rounded-full glow-primary-sm">
              <Star className="w-3.5 h-3.5 fill-primary" />
              {formatRating(item.vote_average)}
            </Badge>
            <span className="text-sm text-zinc-400">{getYear(date)}</span>
            <Badge variant="outline" className="text-xs rounded-full border-white/15 bg-white/[0.04] backdrop-blur-md">
              {isMovie ? "Movie" : "TV Series"}
            </Badge>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-white mb-3 leading-[1.05] tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)]">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 mb-6 max-w-xl leading-relaxed line-clamp-3">
            {truncate(overview, 200)}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href={watchHref}>
              <Button size="lg" className="gap-2">
                <Play className="w-5 h-5 fill-white" />
                Watch Now
              </Button>
            </Link>
            <Link href={href}>
              <Button variant="secondary" size="lg" className="gap-2">
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-primary/50 hover:shadow-[0_0_16px_-4px_rgba(218,27,27,0.5)]"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-primary/50 hover:shadow-[0_0_16px_-4px_rgba(218,27,27,0.5)]"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-16 flex gap-2">
        {items.slice(0, 6).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? "bg-primary w-6 glow-primary-sm"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
