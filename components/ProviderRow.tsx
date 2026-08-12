"use client"

import Image from "next/image"
import { ContentRow } from "@/components/ContentRow"
import { useProviderMovies, useProviderTV } from "@/hooks/useTMDB"
import { getImageUrl } from "@/lib/utils"
import type { ResolvedProvider } from "@/lib/providers"
import type { MediaItem } from "@/lib/types"

interface ProviderRowProps {
  provider: ResolvedProvider
}

function interleave<T>(a: T[] = [], b: T[] = []): T[] {
  const out: T[] = []
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i]) out.push(a[i])
    if (b[i]) out.push(b[i])
  }
  return out
}

export function ProviderRow({ provider }: ProviderRowProps) {
  const movies = useProviderMovies(provider.id)
  const shows = useProviderTV(provider.id)

  const items = interleave<MediaItem>(
    movies.data?.results as MediaItem[] | undefined,
    shows.data?.results as MediaItem[] | undefined
  )

  const isLoading = (movies.isLoading || shows.isLoading) && items.length === 0

  return (
    <ContentRow
      titleNode={
        <h2 className="text-xl font-bold text-white mb-4 px-0 flex items-center gap-2">
          {provider.logoPath && (
            <span className="w-7 h-7 rounded-md bg-white/10 border border-zinc-700/60 flex items-center justify-center p-1 overflow-hidden">
              <Image
                src={getImageUrl(provider.logoPath, "w92")}
                alt={provider.label}
                width={28}
                height={28}
                className="object-contain"
              />
            </span>
          )}
          <span>On {provider.label}</span>
        </h2>
      }
      items={items}
      isLoading={isLoading}
    />
  )
}