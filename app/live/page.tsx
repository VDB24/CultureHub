"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { LiveChannel, LIVE_CHANNELS, CHANNEL_CATEGORIES } from "@/lib/live"
import { ChannelLogo } from "@/components/ChannelLogo"
import { ComingSoon } from "@/components/ComingSoon"
import { cn } from "@/lib/utils"
import { Radio, Search, Play, Crown, Sparkles, Globe2, Languages } from "lucide-react"

export default function LiveTVPage() {
  const [category, setCategory] = useState<string>("All")
  const [query, setQuery] = useState("")

  const channels = useMemo(() => {
    return LIVE_CHANNELS.filter((c) => {
      const matchCat = category === "All" || c.category === category
      const q = query.trim().toLowerCase()
      const matchQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.language.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [category, query])

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero strip */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 glow-spots shadow-apple-hero-panel mb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0505] via-[#0c0c0e] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative p-8 sm:p-12 lg:p-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/15 text-rose-300 text-xs font-semibold tracking-[0.14em] uppercase mb-5">
            <Crown className="w-3.5 h-3.5" />
            Free to watch
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-3">
            Live <span className="text-glow">TV</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mb-6">
            Hundreds of channels from around the world — news, sports, entertainment, movies and
            more, streaming around the clock.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Radio className="w-4 h-4 text-rose-300" />
            <span>
              Live TV streams are served via HLS — works across all servers.
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search channels..."
              className="w-64 bg-white/[0.04] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all"
            />
          </div>
          <span className="text-sm text-zinc-500">{channels.length} channels</span>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {["All", ...CHANNEL_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200",
                category === cat
                  ? "bg-primary text-white border-primary glow-primary-sm"
                  : "border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Channel grid */}
      {channels.length === 0 ? (
        <div className="text-center py-20">
          <Radio className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-zinc-500">No channels match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}

      <ComingSoon />

      {/* Cta strip */}
      <div className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent p-6 sm:p-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-white font-display text-2xl mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-300" />
            Watching in Ultra HD?
          </p>
          <p className="text-sm text-zinc-500">
            Multiple servers available with auto-failover for reliable streaming.
          </p>
        </div>
        <Link href="/sports">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-rose-600 transition-colors glow-primary">
            Explore Live Sports
          </button>
        </Link>
      </div>
    </div>
  )
}

function ChannelCard({ channel }: { channel: LiveChannel }) {
  return (
    <Link
      href={`/watch/live/${channel.id}`}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5 shadow-apple-card hover:shadow-apple-card-hover"
    >
      <div className="flex items-center gap-3">
        <ChannelLogo channel={channel} className="w-12 h-12 rounded-xl flex-shrink-0 shadow-lg" />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-rose-300 transition-colors">
            {channel.name}
          </h3>
          <p className="text-xs text-zinc-500 flex items-center gap-1 truncate">
            <Globe2 className="w-3 h-3 flex-shrink-0" />
            {channel.country}
          </p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/15 text-rose-300 text-[10px] font-bold tracking-widest">
          <Radio className="w-2.5 h-2.5" />
          LIVE
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
          <Languages className="w-3 h-3" />
          {channel.language}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-3 h-3 fill-white" />
          Watch now
        </span>
      </div>
    </Link>
  )
}