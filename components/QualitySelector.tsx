"use client"

import { useState, useEffect, useCallback } from "react"
import { Settings, Monitor, Check } from "lucide-react"

const QUALITY_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "2160", label: "4K" },
  { value: "1080", label: "1080p" },
  { value: "720", label: "720p" },
  { value: "480", label: "480p" },
  { value: "360", label: "360p" },
]

const STORAGE_KEY = "culturehub-quality"

function getSavedQuality(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveQuality(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // storage unavailable
  }
}

interface QualitySelectorProps {
  quality: string
  onChange: (quality: string) => void
}

export function QualitySelector({ quality, onChange }: QualitySelectorProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = getSavedQuality()
    if (saved && saved !== quality) {
      onChange(saved)
    }
  }, [])

  const handleSelect = useCallback((value: string) => {
    saveQuality(value)
    onChange(value)
    setOpen(false)
  }, [onChange])

  const currentLabel = QUALITY_OPTIONS.find((o) => o.value === quality)?.label || "Auto"

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 text-xs text-white hover:bg-zinc-800 transition-colors border border-zinc-600/50 shadow-lg"
        aria-label="Quality settings"
      >
        <Monitor className="w-3.5 h-3.5 text-primary" />
        <span className="text-white/80">{currentLabel}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-40 w-36 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl shadow-black/60 overflow-hidden">
            <div className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
              Playback Quality
            </div>
            {QUALITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <span>{opt.label}</span>
                {quality === opt.value && (
                  <Check className="w-3.5 h-3.5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
