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
}

export function MediaCard({ item, canHover = true }: MediaCardProps) {
  const router = useRouter()
  const isMovie = "title" in item
  const id = item.id
  const title = isMovie ? (item as TMDBMovie).title : (item as TMDBTVShow).name
  const date = isMovie ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date
  const href = isMovie ? `/movie/${id}` : `/tv/${id}`
  const watchHref = isMovie ? `/watch/movie/${id}` : `/watch/tv/${id}/1/1`

  return (
    <div className="group relative flex-shrink-0 w-[160px] sm:w-[180px]">
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 cursor-pointer">
          <Image
            src={getPosterUrl(item.poster_path)}
            alt={title}
            fill
            sizes="(max-width: 640px) 160px, 180px"
            className="object-cover transition-all duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {canHover && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(watchHref)
                }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 cursor-pointer"
                aria-label={`Watch ${title}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-orange-600/30 hover:bg-primary transition-colors">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </button>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="text-[11px] px-1.5 py-0.5 gap-1 bg-black/70 text-orange-400 border-orange-500/50">
              <Star className="w-3 h-3 fill-orange-400" />
              {formatRating(item.vote_average)}
            </Badge>
          </div>
        </div>
        <div className="mt-2 px-0.5">
          <h3 className="text-sm font-medium text-zinc-100 truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">{getYear(date)}</p>
        </div>
      </Link>
    </div>
  )
}

function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ")
}
