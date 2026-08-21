import { NextResponse } from "next/server"
import { getSources } from "@/lib/sources"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface SourceStatus {
  ok: boolean
  status: number
  ms: number
}

let cache: { data: Record<string, SourceStatus>; ts: number } | null = null
const CACHE_TTL = 60_000

async function probe(url: string): Promise<SourceStatus> {
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })
    return { ok: res.ok, status: res.status, ms: Date.now() - start }
  } catch {
    return { ok: false, status: 0, ms: Date.now() - start }
  }
}

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  const sources = getSources()
  const results: Record<string, SourceStatus> = {}

  const probes = sources.map(async (s) => {
    const testUrl = s.buildMovieUrl(550)
    results[s.id] = await probe(testUrl)
  })

  await Promise.allSettled(probes)

  cache = { data: results, ts: Date.now() }

  return NextResponse.json(results, {
    headers: { "Cache-Control": "no-cache, max-age=0" },
  })
}
