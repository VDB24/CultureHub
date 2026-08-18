import type { Sport } from "@/lib/live"

// Live sports data via TheSportsDB free API (demo key "3").
// Real-time scores + today's fixtures across sports. Falls back to the static
// fixture list when the API is unreachable or a sport has no events scheduled.

const BASE = "https://www.thesportsdb.com/api/v1/json/3"

const API_SPORTS: { api: string; sport: Sport }[] = [
  { api: "Soccer", sport: "Football" },
  { api: "Basketball", sport: "Basketball" },
  { api: "Cricket", sport: "Cricket" },
  { api: "Tennis", sport: "Tennis" },
  { api: "Ice Hockey", sport: "Hockey" },
  { api: "Motor Sport", sport: "Racing" },
  { api: "Boxing", sport: "Boxing" },
]

const SPORT_CHANNELS: Record<Sport, string> = {
  Football: "sky-sports",
  Cricket: "star-sports-1",
  Basketball: "espn",
  Tennis: "espn",
  Racing: "sky-sports",
  Hockey: "espn",
  Boxing: "espn",
}

export interface LiveSportsEvent {
  id: string
  sport: Sport
  league: string
  home: string
  away: string
  time: string
  live: boolean
  homeScore?: number
  awayScore?: number
  status?: string
  channelId: string
  source: "live" | "today"
}

interface RawEvent {
  idEvent?: string
  strEvent?: string
  strSport?: string
  strLeague?: string
  strHomeTeam?: string
  strAwayTeam?: string
  strTime?: string
  dateEvent?: string
  strStatus?: string
  intHomeScore?: string
  intAwayScore?: string
}

function toSport(apiSport: string): Sport | null {
  return API_SPORTS.find((s) => s.api === apiSport)?.sport ?? null
}

function normalize(event: RawEvent, source: "live" | "today"): LiveSportsEvent | null {
  const sport = toSport(event.strSport ?? "")
  if (!sport || !event.strHomeTeam || !event.strAwayTeam) return null

  const homeScore = event.intHomeScore ? Number(event.intHomeScore) : undefined
  const awayScore = event.intAwayScore ? Number(event.intAwayScore) : undefined

  return {
    id: `tsdb-${event.idEvent ?? `${sport}-${event.strHomeTeam}-${event.strAwayTeam}`}`,
    sport,
    league: event.strLeague ?? "Live Sports",
    home: event.strHomeTeam,
    away: event.strAwayTeam,
    time: event.strTime ? formatTime(event.strTime) : "",
    live: source === "live",
    homeScore,
    awayScore,
    status: event.strStatus,
    channelId: SPORT_CHANNELS[sport],
    source,
  }
}

function formatTime(time: string): string {
  const m = time.match(/^(\d{2}):(\d{2})/)
  if (!m) return time
  let h = Number(m[1])
  const min = m[2]
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${h}:${min} ${ampm}`
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export async function fetchLiveScores(): Promise<LiveSportsEvent[]> {
  const data = await safe<{ events: RawEvent[] }>(
    async () => {
      const res = await fetch(`${BASE}/livescore.php`, { cache: "no-store" })
      return (await res.json()) as { events: RawEvent[] }
    },
    { events: [] }
  )
  return (data.events ?? []).map((e) => normalize(e, "live")).filter((e): e is LiveSportsEvent => e !== null)
}

export async function fetchTodayEvents(): Promise<LiveSportsEvent[]> {
  const today = new Date().toISOString().slice(0, 10)
  const results = await Promise.all(
    API_SPORTS.map(({ api }) =>
      safe<RawEvent[]>(
        async () => {
          const res = await fetch(`${BASE}/eventsday.php?d=${today}&s=${encodeURIComponent(api)}`, { cache: "no-store" })
          const data = (await res.json()) as { events?: RawEvent[] }
          return data.events ?? []
        },
        []
      )
    )
  )
  return results
    .flat()
    .map((e) => normalize(e, "today"))
    .filter((e): e is LiveSportsEvent => e !== null)
}

export async function fetchSportsData(): Promise<{ live: LiveSportsEvent[]; today: LiveSportsEvent[] }> {
  const [live, today] = await Promise.all([fetchLiveScores(), fetchTodayEvents()])
  return { live, today }
}