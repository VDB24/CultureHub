"use client"

import { use, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useMovieDetails } from "@/hooks/useTMDB"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ContentRow } from "@/components/ContentRow"
import { VideoPlayer } from "@/components/VideoPlayer"
import {
  Play,
  Star,
  Clock,
  Calendar,
  Languages,
} from "lucide-react"
import {
  getBackdropUrl,
  getPosterUrl,
  formatRating,
  formatRuntime,
  formatDate,
  truncate,
} from "@/lib/utils"

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const movieId = Number(id)
  const { data: movie, isLoading } = useMovieDetails(movieId)

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="w-full aspect-video rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <Skeleton className="aspect-[2/3] rounded-xl" />
          <div>
            <Skeleton className="h-10 w-96 mb-4" />
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-72 mb-6" />
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

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500">Movie not found</p>
      </div>
    )
  }

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  )

  return (
    <div>
      {/* Backdrop */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh]">
        <Image
          src={getBackdropUrl(movie.backdrop_path || movie.poster_path)}
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
          {/* Poster */}
          <div className="hidden md:block">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50">
              <Image
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                fill
                className="object-cover"
                priority
                sizes="300px"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-end pb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-lg text-zinc-400 italic mb-4">{movie.tagline}</p>
            )}

            <div className="flex items-center gap-4 flex-wrap mb-6">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                <span className="text-white font-semibold">
                  {formatRating(movie.vote_average)}
                </span>
                <span className="text-zinc-500 text-sm">({movie.vote_count.toLocaleString()})</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(movie.release_date)}</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatRuntime(movie.runtime)}</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Languages className="w-4 h-4" />
                <span className="text-sm uppercase">{movie.original_language}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <Link key={genre.id} href={`/movies?with_genres=${genre.id}`}>
                  <Badge variant="secondary" className="hover:bg-zinc-600 transition-colors cursor-pointer">
                    {genre.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6 max-w-3xl">
              {movie.overview || "No overview available."}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href={`/watch/movie/${movie.id}`}>
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5 fill-white" />
                  Watch Now
                </Button>
              </Link>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="lg" className="gap-2">
                    Watch Trailer
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Quick embed preview */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Preview</h2>
          <VideoPlayer
            tmdbId={movie.id}
            mediaType="movie"
            title={movie.title}
            posterPath={movie.poster_path}
            autoPlay={false}
          />
        </div>

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
              {movie.credits.cast.slice(0, 20).map((person) => (
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
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div className="mb-12">
            <ContentRow
              title="Similar Movies"
              items={movie.similar.results as any}
            />
          </div>
        )}

        {/* Recommendations */}
        {movie.recommendations?.results && movie.recommendations.results.length > 0 && (
          <div className="mb-12">
            <ContentRow
              title="Recommendations"
              items={movie.recommendations.results as any}
            />
          </div>
        )}
      </div>
    </div>
  )
}
