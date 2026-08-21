"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { getSources } from "@/lib/sources"
import { Server, Check, Crown, ChevronDown, Sparkles, Globe, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "culturehub-source"
const STATUS_CACHE_KEY = "culturehub-source-status"
const STATUS_CACHE_TTL = 300_000

function getSavedSource(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveSource(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {}
}

interface SourceStatus {
  ok: boolean
  status: number
  ms: number
}

interface ServerSelectorProps {
  source: string
  onChange: (source: string) => void
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "4K Ultra HD": <Sparkles className="w-3 h-3" />,
  "Live TV": <Globe className="w-3 h-3" />,
  "Live Sports": <Sparkles className="w-3 h-3" />,
  Anime: <Sparkles className="w-3 h-3" />,
  "Fast loading": <Wifi className="w-3 h-3" />,
}

export function ServerSelector({ source, onChange }: ServerSelectorProps) {
  const sources = getSources()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const active = sources.find((s) => s.id === source) || sources[0]
  const [statuses, setStatuses] = useState<Record<string, SourceStatus> | null>(null)

  useEffect(() => {
    const saved = getSavedSource()
    if (saved && saved !== source) {
      onChange(saved)
    }
  }, [source, onChange])

  useEffect(() => {
    async function fetchStatuses() {
      try {
        const raw = sessionStorage.getItem(STATUS_CACHE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Date.now() - parsed.ts < STATUS_CACHE_TTL) {
            setStatuses(parsed.data)
            return
          }
        }
      } catch {}

      try {
        const res = await fetch("/api/source-status")
        if (!res.ok) return
        const data: Record<string, SourceStatus> = await res.json()
        setStatuses(data)
        sessionStorage.setItem(STATUS_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
      } catch {}
    }
    fetchStatuses()
  }, [])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const handleSelect = useCallback(
    (value: string) => {
      saveSource(value)
      onChange(value)
      setOpen(false)
    },
    [onChange]
  )

  const getStatus = (id: string): "online" | "offline" | "unknown" => {
    if (!statuses) return "unknown"
    const s = statuses[id]
    if (!s) return "unknown"
    return s.ok ? "online" : "offline"
  }

  return (
    <div ref={panelRef} className="relative w-max max-w-full mx-auto">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border transition-all duration-300 shadow-2xl shadow-black/60 backdrop-blur-xl",
          active?.premium
            ? "border-primary/40 bg-[#1a0505]/80 hover:border-primary/70"
            : "border-white/10 bg-black/70 hover:border-white/25"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full",
          active?.premium ? "bg-primary glow-primary-sm" : "bg-white/10"
        )}>
          {active?.premium ? (
            <Crown className="w-3.5 h-3.5 text-white" />
          ) : (
            <Server className="w-3.5 h-3.5 text-zinc-300" />
          )}
        </span>
        <span className="text-xs font-semibold text-white whitespace-nowrap">{active?.name}</span>
        <span className="flex items-center gap-1">
          {statuses && (
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              getStatus(source) === "online" ? "bg-emerald-400" : getStatus(source) === "offline" ? "bg-red-400" : "bg-zinc-500"
            )} />
          )}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 transition-transform duration-300", open && "rotate-180")} />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[min(92vw,380px)] z-50 animate-scale-in origin-bottom">
          <div className="glass-deep rounded-2xl border border-white/10 shadow-apple-card overflow-hidden">
            <div className="px-4 pt-3.5 pb-2.5 border-b border-white/[0.07]">
              <p className="text-[11px] font-semibold text-white/50 tracking-[0.14em] uppercase">
                Choose a Server
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Servers are checked automatically — if one fails, we switch you to a working backup.</p>
            </div>

            <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto scrollbar-none">
              {sources.map((s) => {
                const isActive = source === s.id
                const status = getStatus(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s.id)}
                    className={cn(
                      "w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 group",
                      isActive
                        ? "border-primary/50 bg-primary/[0.12]"
                        : "border-transparent hover:bg-white/[0.05] hover:border-white/10"
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-xl mt-0.5 flex-shrink-0 transition-colors relative",
                      s.premium
                        ? "bg-primary/20 text-rose-300 border border-primary/30"
                        : "bg-white/[0.06] text-zinc-400 border border-white/10 group-hover:text-zinc-200"
                    )}>
                      {s.premium ? <Crown className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                      {statuses && status !== "unknown" && (
                        <span className={cn(
                          "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black",
                          status === "online" ? "bg-emerald-400" : "bg-red-400"
                        )} />
                      )}
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-2 flex-wrap">
                        <span className={cn("text-sm font-semibold", isActive ? "text-white" : "text-zinc-200")}>
                          {s.name}
                        </span>
                        {s.premium && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold tracking-wide uppercase">
                            <Sparkles className="w-2.5 h-2.5" />
                            Premium
                          </span>
                        )}
                        {s.recommended && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-semibold tracking-wide uppercase">
                            Recommended
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold tracking-wide uppercase">
                            <Check className="w-2.5 h-2.5" />
                            Active
                          </span>
                        )}
                        {statuses && status === "offline" && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold tracking-wide uppercase">
                            <WifiOff className="w-2.5 h-2.5" />
                            Offline
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-zinc-500 mt-0.5">{s.description}</span>
                      {s.features && (
                        <span className="flex flex-wrap gap-1 mt-1.5">
                          {s.features.map((f) => (
                            <span
                              key={f}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[10px] text-zinc-400"
                            >
                              {FEATURE_ICONS[f]}
                              {f}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="px-4 py-2.5 border-t border-white/[0.07] bg-primary/[0.06]">
              <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-emerald-400" />
                Auto-failover enabled — broken servers are skipped automatically.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
