"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { LIVE_CHANNELS } from "@/lib/live"
import { ChannelLogo } from "@/components/ChannelLogo"
import { resolveProviders, type ResolvedProvider } from "@/lib/providers"
import { useWatchProviders } from "@/hooks/useTMDB"
import { Trophy, ArrowRight, AppWindow } from "lucide-react"

export function ChannelsAndApps() {
  const { data } = useWatchProviders()
  const providers = resolveProviders(data?.results || [])
  const channels = LIVE_CHANNELS.slice(0, 8)

  return (
    <section className="relative">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="font-display text-xl sm:text-2xl text-white flex items-center gap-2.5">
          <span className="w-8 h-px bg-primary glow-primary-sm inline-block" />
          Channels &amp; Apps
        </h2>
        <Link
          href="/live"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-rose-300 transition-colors"
        >
          View all channels
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto overscroll-x-contain scrollbar-none pb-2 -mx-4 px-4 snap-x snap-mandatory">
        {channels.map((channel) => (
          <Link
            key={channel.id}
            href={`/watch/live/${channel.id}`}
            className="group flex-shrink-0 snap-start w-[120px]"
          >
            <ChannelLogo
              channel={channel}
              showLiveBadge
              className="w-full aspect-video rounded-2xl transition-all duration-300 group-hover:ring-2 group-hover:ring-primary/60 group-hover:scale-[1.03] group-hover:shadow-apple-card-hover"
            />
            <p className="mt-2 text-xs font-medium text-zinc-300 truncate text-center group-hover:text-rose-300 transition-colors">
              {channel.name}
            </p>
          </Link>
        ))}

        <Link
          href="/sports"
          className="group flex-shrink-0 snap-start w-[120px]"
        >
          <div className="relative flex items-center justify-center w-full aspect-video rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-zinc-400 transition-all duration-300 group-hover:border-primary/50 group-hover:text-rose-300">
            <Trophy className="w-6 h-6" />
          </div>
          <p className="mt-2 text-xs font-medium text-zinc-300 truncate text-center group-hover:text-rose-300 transition-colors">
            Live Sports
          </p>
        </Link>
      </div>

      {providers.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500 mb-4">
            <AppWindow className="w-3.5 h-3.5" />
            Watch on your favourite apps
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {providers.slice(0, 12).map((provider) => (
              <AppTile key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function AppTile({ provider }: { provider: ResolvedProvider }) {
  const [failed, setFailed] = useState(false)
  return (
    <a
      href={provider.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/app block"
      aria-label={`Open ${provider.label}`}
    >
      <div className="relative aspect-[4/3] rounded-2xl glass border border-white/10 overflow-hidden transition-all duration-300 group-hover/app:border-primary/50 group-hover/app:shadow-apple-card-hover group-hover/app:-translate-y-0.5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
        {!failed ? (
          <Image
            src={`/providers/${provider.key}.svg`}
            alt={provider.label}
            fill
            sizes="(max-width: 640px) 30vw, 160px"
            className={`object-contain p-3 sm:p-4 drop-shadow ${provider.key === "sonyliv" ? "brightness-0 invert" : ""}`}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white/80">{provider.label.charAt(0)}</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-xs font-medium text-zinc-400 truncate group-hover/app:text-rose-300 transition-colors">
        {provider.label}
      </p>
    </a>
  )
}