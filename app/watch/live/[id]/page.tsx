"use client"

import { use } from "react"
import Link from "next/link"
import { getChannel } from "@/lib/live"
import { ChannelLogo } from "@/components/ChannelLogo"
import { LivePlayer } from "@/components/LivePlayer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Crown, Radio } from "lucide-react"

export default function WatchLivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const channel = getChannel(id)

  if (!channel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-zinc-500">Channel not found</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Top bar */}
      <div className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-20 flex items-center gap-2">
        <Link href="/live">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white gap-2 bg-black/40 hover:bg-black/60">
            <ArrowLeft className="w-4 h-4" />
            Live TV
          </Button>
        </Link>
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-primary/30">
          <ChannelLogo channel={channel} className="w-7 h-7 rounded-md" />
          <span className="text-sm font-semibold text-white">{channel.name}</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold tracking-widest">
            <Radio className="w-2.5 h-2.5" />
            LIVE
          </span>
        </div>
      </div>

      {/* Premium badge */}
      <div className="hidden md:flex absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-20 items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-md">
        <Crown className="w-3.5 h-3.5 text-rose-300" />
        <span className="text-xs font-semibold text-rose-200">
          Ctv Pro Live
        </span>
      </div>

      {/* Player */}
      <LivePlayer
        title={channel.name}
        streams={channel.streams}
        overlay={
          <div className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20 w-max max-w-[94vw] pointer-events-none">
            <div className="glass-deep rounded-2xl border border-white/10 px-4 py-2.5 flex items-center gap-3 shadow-apple-card">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white truncate">{channel.name}</span>
                <span className="text-[11px] text-zinc-500">
                  {channel.country} · {channel.language} · {channel.category}
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/15 text-rose-300 text-[10px] font-semibold tracking-wider uppercase">
                <Radio className="w-3 h-3" />
                {channel.category}
              </span>
            </div>
          </div>
        }
      />
    </div>
  )
}