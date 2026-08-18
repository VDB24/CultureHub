"use client"

import { use } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getFixture, getChannel } from "@/lib/live"
import { LivePlayer } from "@/components/LivePlayer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Crown, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

export default function WatchSportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const search = useSearchParams()
  const fixture = getFixture(id)
  const channel = getChannel(id)

  const home = search.get("home")
  const away = search.get("away")
  const league = search.get("league")

  if (!fixture && !channel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-zinc-500">Event not found</p>
      </div>
    )
  }

  const title = fixture
    ? `${fixture.home} vs ${fixture.away}`
    : home && away
      ? `${home} vs ${away}`
      : `Live Sports · ${channel!.name}`

  const streams = channel?.streams ?? []

  const topLabel = fixture?.league ?? (league || "Live Sports")
  const isLive = fixture?.live ?? true
  const homeName = fixture?.home ?? home ?? "Home"
  const awayName = fixture?.away ?? away ?? "Away"
  const kickoff = fixture?.kickoff ?? ""
  const color = fixture?.color ?? "from-blue-600 to-sky-500"

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Top bar */}
      <div className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-20 flex items-center gap-2">
        <Link href="/sports">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white gap-2 bg-black/40 hover:bg-black/60">
            <ArrowLeft className="w-4 h-4" />
            Sports
          </Button>
        </Link>
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-primary/30">
          <Trophy className="w-4 h-4 text-rose-300" />
          <span className="text-sm font-semibold text-white">{topLabel}</span>
          {isLive && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold tracking-widest animate-pulse">
              LIVE
            </span>
          )}
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
        title={title}
        streams={streams}
        overlay={
          <div className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20 w-max max-w-[94vw] pointer-events-none">
            <div className="glass-deep rounded-2xl border border-white/10 px-4 py-2.5 flex items-center gap-4 shadow-apple-card">
              <div className="flex items-center gap-2">
                <span className={cn("w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs", color)}>
                  {homeName.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-white">{homeName}</span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">VS</span>
              <div className="flex items-center gap-2">
                <span className={cn("w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs", color)}>
                  {awayName.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-white">{awayName}</span>
              </div>
              {kickoff && <span className="hidden md:inline text-xs text-zinc-500 border-l border-white/10 pl-3">{kickoff}</span>}
            </div>
          </div>
        }
      />
    </div>
  )
}