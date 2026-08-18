import type { WatchProvider } from "@/lib/tmdb"

// Known TMDB watch-provider IDs for the IN region.
// Used as a fallback so sections render even if the /watch/providers list call fails.
const KNOWN_PROVIDER_IDS: Record<string, number> = {
  netflix: 8,
  prime: 119, // Amazon Prime Video (India)
  hotstar: 122, // Hotstar / Disney+ Hotstar / JioHotstar (India)
  apple: 350, // Apple TV+
  zee5: 540,
  sonyliv: 1459,
}

const PROVIDER_URLS: Record<string, string> = {
  netflix: "https://www.netflix.com",
  prime: "https://www.primevideo.com",
  hotstar: "https://www.hotstar.com",
  apple: "https://tv.apple.com",
  zee5: "https://www.zee5.com",
  sonyliv: "https://www.sonyliv.com",
}

interface CuratedProvider {
  key: string
  label: string
  match: string[]
}

const CURATED_PROVIDERS: CuratedProvider[] = [
  { key: "netflix", label: "Netflix", match: ["netflix"] },
  { key: "prime", label: "Prime Video", match: ["prime video", "amazon"] },
  { key: "hotstar", label: "Disney+ Hotstar", match: ["hotstar", "disney", "jiohotstar", "jio hotstar", "jio-star"] },
  { key: "apple", label: "Apple TV+", match: ["apple tv"] },
  { key: "zee5", label: "ZEE5", match: ["zee5", "zee"] },
  { key: "sonyliv", label: "SonyLIV", match: ["sonyliv", "sony liv"] },
]

export interface ResolvedProvider {
  key: string
  id: number
  label: string
  logoPath: string | null
  url: string
}

export function resolveProviders(providers: WatchProvider[]): ResolvedProvider[] {
  return CURATED_PROVIDERS.map((p) => {
    const found = providers.find((wp) =>
      p.match.some((m) => wp.provider_name.toLowerCase().includes(m))
    )
    const fallbackId = KNOWN_PROVIDER_IDS[p.key]
    if (!found && fallbackId === undefined) return null
    return {
      key: p.key,
      id: found ? found.provider_id : fallbackId!,
      label: p.label,
      logoPath: found ? found.logo_path : null,
      url: PROVIDER_URLS[p.key],
    }
  }).filter((p): p is ResolvedProvider => p !== null)
}