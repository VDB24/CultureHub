"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTVDetails, useSeasonDetails } from "@/hooks/useTMDB"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ContentRow } from "@/components/ContentRow"
import { Play, Star, Calendar, Languages, ChevronDown } from "lucide-react"
import {
  getBackdropUrl,
  getPosterUrl,
  formatRating,
  formatDate,
  getYear,
} from "@/lib/utils"
import type { Episode } from "@/lib/types"

export default function TVDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const tvId = Number(id)
  const { data: show, isLoading } = useTVDetails(tvId)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const { data: seasonData } = useSeasonDetails(tvId, selectedSeason)

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="w-full aspect-video rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <Skeleton className="aspect-[2/3] rounded-xl" />
          <div>
            <Skeleton className="h-10 w-96 mb-4" />
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-24 w-full mb-4" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!show) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500">Show not found</p>
      </div>
    )
  }

  const seasonNumbers = show.seasons
    ?.filter((s) => s.season_number > 0)
    ?.map((s) => s.season_number) || []

  return (
    <div>
      {/* Backdrop */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh]">
        <Image
          src={getBackdropUrl(show.backdrop_path || show.poster_path)}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="hidden md:block">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50">
              <Image
                src={getPosterUrl(show.poster_path)}
                alt={show.name}
                fill
                className="object-cover"
                priority
                sizes="300px"
              />
            </div>
          </div>

          <div className="flex flex-col justify-end pb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              {show.name}
            </h1>

            {show.tagline && (
              <p className="text-lg text-zinc-400 italic mb-4">{show.tagline}</p>
            )}

            <div className="flex items-center gap-4 flex-wrap mb-6">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                <span className="text-white font-semibold">{formatRating(show.vote_average)}</span>
                <span className="text-zinc-500 text-sm">({show.vote_count.toLocaleString()})</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{getYear(show.first_air_date)}</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Languages className="w-4 h-4" />
                <span className="text-sm uppercase">{show.original_language}</span>
              </div>
              <span className="text-zinc-600">|</span>
              <span className="text-sm text-zinc-400">
                {show.number_of_seasons} {show.number_of_seasons === 1 ? "Season" : "Seasons"} ·{" "}
                {show.number_of_episodes} Episodes
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres?.map((genre) => (
                <Link key={genre.id} href={`/tv?with_genres=${genre.id}`}>
                  <Badge variant="secondary" className="hover:bg-zinc-600 transition-colors cursor-pointer">
                    {genre.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6 max-w-3xl">
              {show.overview || "No overview available."}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href={`/watch/tv/${show.id}/1/1`}>
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5 fill-white" />
                  Start Watching
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Seasons */}
        {seasonNumbers.length > 0 && (
          <section className="mt-12 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Episodes</h2>
              <div className="relative">
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-2 pr-8 text-sm border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  {seasonNumbers.map((sn) => {
                    const season = show.seasons?.find((s) => s.season_number === sn)
                    return (
                      <option key={sn} value={sn}>
                        {season?.name || `Season ${sn}`}
                      </option>
                    )
                  })}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              {seasonData?.episodes?.map((episode: Episode) => (
                <Link
                  key={episode.id}
                  href={`/watch/tv/${show.id}/${episode.season_number}/${episode.episode_number}`}
                  className="flex gap-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group"
                >
                  <div className="relative w-[160px] aspect-video rounded-md overflow-hidden flex-shrink-0 bg-zinc-800">
                    {episode.still_path ? (
                      <Image
                        src={getBackdropUrl(episode.still_path)}
                        alt={episode.name}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-zinc-500 font-mono">
                        S{String(episode.season_number).padStart(2, "0")}E{String(episode.episode_number).padStart(2, "0")}
                      </span>
                      <h3 className="text-white font-medium truncate group-hover:text-primary transition-colors">
                        {episode.name}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2">
                      {episode.overview || "No overview available."}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-600">
                      {episode.air_date && <span>{formatDate(episode.air_date)}</span>}
                      {episode.runtime > 0 && <span>{episode.runtime}m</span>}
                      {episode.vote_average > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                          {formatRating(episode.vote_average)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cast */}
        {show.credits?.cast && show.credits.cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
              {show.credits.cast.slice(0, 20).map((person) => (
                <div key={person.id} className="flex-shrink-0 w-[120px] text-center">
                  <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden bg-zinc-800 mx-auto mb-2">
                    {person.profile_path ? (
                      <Image
                        src={getPosterUrl(person.profile_path)}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-3xl font-bold">
                        {person.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-white truncate">{person.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {show.similar?.results && show.similar.results.length > 0 && (
          <div className="mb-12">
            <ContentRow title="Similar Shows" items={show.similar.results as any} />
          </div>
        )}

        {/* Recommendations */}
        {show.recommendations?.results && show.recommendations.results.length > 0 && (
          <div className="mb-12">
            <ContentRow title="Recommendations" items={show.recommendations.results as any} />
          </div>
        )}
      </div>
    </div>
  )
}
