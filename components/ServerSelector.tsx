"use client"

import { useEffect, useCallback } from "react"
import { getSources } from "@/lib/sources"
import { Server, Check } from "lucide-react"

const STORAGE_KEY = "culturehub-source"

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
  } catch {
    // storage unavailable
  }
}

interface ServerSelectorProps {
  source: string
  onChange: (source: string) => void
}

export function ServerSelector({ source, onChange }: ServerSelectorProps) {
  const sources = getSources()

  useEffect(() => {
    const saved = getSavedSource()
    if (saved && saved !== source) {
      onChange(saved)
    }
  }, [source, onChange])

  const handleSelect = useCallback((value: string) => {
    saveSource(value)
    onChange(value)
  }, [onChange])

  return (
    <div className="flex items-center gap-1 w-max max-w-full mx-auto overflow-x-auto rounded-full bg-black/70 border border-zinc-700/60 shadow-2xl shadow-black/60 backdrop-blur-sm px-1.5 py-1.5">
      {sources.map((s) => {
        const active = source === s.id
        return (
          <button
            key={s.id}
            onClick={() => handleSelect(s.id)}
            title={s.description}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              active
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            {s.name}
            {active && <Check className="w-3 h-3" />}
          </button>
        )
      })}
    </div>
  )
}
