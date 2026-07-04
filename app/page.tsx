"use client"

import { HeroBanner } from "@/components/HeroBanner"
import { ContentRow } from "@/components/ContentRow"
import {
  useTrendingMovies,
  useTrendingTV,
  usePopularMovies,
  usePopularTV,
  useNowPlayingMovies,
  useTopRatedMovies,
  useTopRatedTV,
  useHindiMovies,
  useHindiTV,
  useOnTheAirTV,
} from "@/hooks/useTMDB"

export default function Home() {
  const trendingMovies = useTrendingMovies("week")
  const trendingTV = useTrendingTV("week")
  const nowPlaying = useNowPlayingMovies()
  const popularMovies = usePopularMovies()
  const popularTV = usePopularTV()
  const topMovies = useTopRatedMovies()
  const topTV = useTopRatedTV()
  const hindiMovies = useHindiMovies()
  const hindiTV = useHindiTV()
  const onTheAir = useOnTheAirTV()

  const isLoading =
    trendingMovies.isLoading ||
    trendingTV.isLoading

  return (
    <div className="min-h-screen">
      <HeroBanner
        items={trendingMovies.data?.results?.slice(0, 8)}
        isLoading={isLoading}
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
        <ContentRow
          title="Trending Movies"
          items={trendingMovies.data?.results}
          isLoading={trendingMovies.isLoading}
        />
        <ContentRow
          title="Trending TV Shows"
          items={trendingTV.data?.results}
          isLoading={trendingTV.isLoading}
        />
        <ContentRow
          title="Now Playing"
          items={nowPlaying.data?.results}
          isLoading={nowPlaying.isLoading}
        />
        <ContentRow
          title="Popular Movies"
          items={popularMovies.data?.results}
          isLoading={popularMovies.isLoading}
        />
        <ContentRow
          title="Popular TV Shows"
          items={popularTV.data?.results}
          isLoading={popularTV.isLoading}
        />
        <ContentRow
          title="Top Rated Movies"
          items={topMovies.data?.results}
          isLoading={topMovies.isLoading}
        />
        <ContentRow
          title="Top Rated TV Shows"
          items={topTV.data?.results}
          isLoading={topTV.isLoading}
        />
        <ContentRow
          title="Hindi Movies"
          items={hindiMovies.data?.results}
          isLoading={hindiMovies.isLoading}
        />
        <ContentRow
          title="Hindi TV Shows"
          items={hindiTV.data?.results}
          isLoading={hindiTV.isLoading}
        />
        <ContentRow
          title="On The Air"
          items={onTheAir.data?.results}
          isLoading={onTheAir.isLoading}
        />
      </div>
    </div>
  )
}
