"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Star, Play } from "lucide-react"
import { getPosterUrl, getYear, formatRating } from "@/lib/utils"
import type { MediaItem, TMDBMovie, TMDBTVShow } from "@/lib/types"

interface MediaCardProps {
  item: MediaItem
  canHover?: boolean
  rank?: number
  tag?: string
}

export function MediaCard({ item, canHover = true, rank, tag }: MediaCardProps) {
  const router = useRouter()
  const isMovie = "title" in item
  const id = item.id
  const title = isMovie ? (item as TMDBMovie).title : (item as TMDBTVShow).name
  const date = isMovie ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date
  const href = isMovie ? `/movie/${id}` : `/tv/${id}`
  const watchHref = isMovie ? `/watch/movie/${id}` : `/watch/tv/${id}/1/1`

  return (
    <div className="group relative w-full min-w-0 max-w-full">
      <Link href={href} className="block">
        {rank != null && (
          <span
            className="top-rank-number absolute -left-8 sm:-left-10 -bottom-7 z-10 pointer-events-none select-none"
            aria-hidden
          >
            {rank}
          </span>
        )}
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-800 cursor-pointer ring-1 ring-white/[0.06] transition-all duration-300 group-hover:ring-primary/50 group-hover:shadow-apple-card-hover group-hover:shadow-[0_8px_30px_-8px_rgba(218,27,27,0.45)]">
          <Image
            src={getPosterUrl(item.poster_path)}
            alt={title}
            fill
            sizes="(max-width: 640px) 40vw, 180px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {canHover && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(watchHref)
                }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 cursor-pointer"
                aria-label={`Watch ${title}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/95 flex items-center justify-center glow-primary transition-colors relative">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </button>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge
              variant="default"
              className="text-[11px] px-1.5 py-0.5 gap-1 bg-black/70 text-white border-white/10 backdrop-blur-md"
            >
              <Star className="w-3 h-3 fill-primary text-primary" />
              {formatRating(item.vote_average)}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
        </div>
        <div className="mt-3 px-0.5 space-y-1">
          <h3 className="text-sm font-medium text-zinc-100 truncate group-hover:text-rose-300 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">{getYear(date)}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-zinc-600">
              {tag ?? (isMovie ? "Movie" : "TV")}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}