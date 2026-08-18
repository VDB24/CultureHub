"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { SPORTS_FIXTURES, SPORTS, SportsFixture, type Sport } from "@/lib/live"
import { useSportsData } from "@/hooks/useTMDB"
import type { LiveSportsEvent } from "@/lib/sportsApi"
import { ComingSoon } from "@/components/ComingSoon"
import { cn } from "@/lib/utils"
import { Trophy, Play, Crown, Sparkles, CalendarClock } from "lucide-react"

const SPORT_COLORS: Record<Sport, string> = {
  Football: "from-blue-600 to-sky-500",
  Cricket: "from-amber-500 to-orange-500",
  Basketball: "from-emerald-600 to-teal-500",
  Tennis: "from-violet-600 to-purple-500",
  Hockey: "from-zinc-600 to-zinc-400",
  Racing: "from-red-600 to-rose-500",
  Boxing: "from-amber-500 to-orange-500",
}

interface SportsCard {
  key: string
  sport: Sport
  league: string
  home: string
  away: string
  time: string
  live: boolean
  homeScore?: number
  awayScore?: number
  href: string
  color: string
}

function toCard(event: LiveSportsEvent): SportsCard {
  return {
    key: event.id,
    sport: event.sport,
    league: event.league,
    home: event.home,
    away: event.away,
    time: event.time,
    live: event.live,
    homeScore: event.homeScore,
    awayScore: event.awayScore,
    href: `/watch/sports/${event.channelId}?home=${encodeURIComponent(event.home)}&away=${encodeURIComponent(event.away)}&league=${encodeURIComponent(event.league)}`,
    color: SPORT_COLORS[event.sport],
  }
}

function toStaticCard(fixture: SportsFixture): SportsCard {
  return {
    key: `static-${fixture.id}`,
    sport: fixture.sport,
    league: fixture.league,
    home: fixture.home,
    away: fixture.away,
    time: fixture.kickoff,
    live: Boolean(fixture.live),
    href: `/watch/sports/${fixture.id}`,
    color: fixture.color,
  }
}

export default function SportsPage() {
  const [sport, setSport] = useState<string>("All")
  const { data } = useSportsData()

  const { liveNow, fixtures } = useMemo(() => {
    const live = data?.live ?? []
    const today = data?.today ?? []

    const dynamicSports = new Set(today.map((e) => e.sport))
    const liveSports = new Set(live.map((e) => e.sport))

    const dynamicCards = today.map(toCard)
    const dynamicLive = live.map(toCard)

    const staticCards = SPORTS_FIXTURES.filter(
      (f) => !dynamicSports.has(f.sport) && !liveSports.has(f.sport)
    ).map(toStaticCard)

    const liveCards = dynamicLive.filter((c) => !dynamicSports.has(c.sport))
    const staticLive = SPORTS_FIXTURES.filter((f) => f.live && !dynamicSports.has(f.sport) && !liveSports.has(f.sport))
    const liveNow = [...liveCards, ...staticLive.map(toStaticCard)]

    const fixtureCards = [...staticCards, ...dynamicCards].filter((c) => !c.live)

    const apply = (list: SportsCard[]) => (sport === "All" ? list : list.filter((c) => c.sport === sport))

    return { liveNow: apply(liveNow), fixtures: apply(fixtureCards) }
  }, [data, sport])

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero strip */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 glow-spots shadow-apple-hero-panel mb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c14] via-[#140c0c] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative p-8 sm:p-12 lg:p-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/15 text-rose-300 text-xs font-semibold tracking-[0.14em] uppercase mb-5">
            <Crown className="w-3.5 h-3.5" />
            Exclusive to Ctv Pro
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-3">
            Live <span className="text-glow">Sports</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mb-6">
            Football, cricket, basketball, tennis and more — live scores and fixtures, refreshed
            every minute.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Trophy className="w-4 h-4 text-rose-300" />
            <span>
              Scores &amp; fixtures are live and update in real time on the{" "}
              <span className="text-rose-300 font-semibold">Ctv Pro viewer</span>.
            </span>
          </div>
        </div>
      </div>

      {/* Sport filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-8">
        {["All", ...SPORTS].map((s) => (
          <button
            key={s}
            onClick={() => setSport(s)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200",
              sport === s
                ? "bg-primary text-white border-primary glow-primary-sm"
                : "border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Live now */}
      <div className="flex items-center gap-2 mb-5">
        <span className="relative flex w-2.5 h-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-primary" />
        </span>
        <h2 className="font-display text-xl sm:text-2xl text-white">Live Now</h2>
      </div>

      {liveNow.length === 0 ? (
        <div className="mb-12 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-zinc-400 font-medium">No live matches right now</p>
          <p className="text-sm text-zinc-600 mt-1">
            Here&apos;s what&apos;s coming up next — scores appear here the moment they go live.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {liveNow.map((card) => (
            <SportsCardView key={card.key} card={card} live />
          ))}
        </div>
      )}

      {/* Today & upcoming */}
      <h2 className="font-display text-xl sm:text-2xl text-white mb-5">Matches &amp; Upcoming</h2>
      {fixtures.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-zinc-500">No fixtures in this category right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fixtures.map((card) => (
            <SportsCardView key={card.key} card={card} />
          ))}
        </div>
      )}

      <ComingSoon />

      {/* Cta strip */}
      <div className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent p-6 sm:p-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-white font-display text-2xl mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-300" />
            Full match coverage
          </p>
          <p className="text-sm text-zinc-500">
            The Ctv Pro viewer streams every major league and tournament in HD &amp; 4K.
          </p>
        </div>
        <Link href="/live">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-rose-600 transition-colors glow-primary">
            Explore Live TV
          </button>
        </Link>
      </div>
    </div>
  )
}

function SportsCardView({ card, live }: { card: SportsCard; live?: boolean }) {
  const showingScore = live && card.homeScore !== undefined && card.awayScore !== undefined
  return (
    <Link
      href={card.href}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5 shadow-apple-card hover:shadow-apple-card-hover"
    >
      <div className={cn("h-1.5 bg-gradient-to-r", card.color)} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-zinc-400">
            <Trophy className="w-3.5 h-3.5" />
            {card.league}
          </span>
          {live && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold tracking-widest animate-pulse">
              LIVE
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm flex-shrink-0", card.color)}>
              {card.home.charAt(0)}
            </div>
            <span className="text-sm font-medium text-white truncate">{card.home}</span>
            {showingScore && <span className="ml-auto text-sm font-bold text-white tabular-nums">{card.homeScore}</span>}
          </div>
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm flex-shrink-0", card.color)}>
              {card.away.charAt(0)}
            </div>
            <span className="text-sm font-medium text-white truncate">{card.away}</span>
            {showingScore && <span className="ml-auto text-sm font-bold text-white tabular-nums">{card.awayScore}</span>}
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-zinc-500 flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5" />
            {card.time || "Kick-off"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-3 h-3 fill-white" />
            Watch
          </span>
        </div>
      </div>
    </Link>
  )
}