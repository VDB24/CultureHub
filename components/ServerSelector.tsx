"use client"

import { useState, useEffect, useCallback } from "react"
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
  const [open, setOpen] = useState(false)
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
    setOpen(false)
  }, [onChange])

  const current = sources.find((s) => s.id === source)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 text-xs text-white hover:bg-zinc-800 transition-colors border border-zinc-600/50 shadow-lg"
        aria-label="Server selector"
      >
        <Server className="w-3.5 h-3.5 text-primary" />
        <span className="text-white/80">{current?.name || "Server"}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-40 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl shadow-black/60 overflow-hidden">
            <div className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
              Video Server
            </div>
            {sources.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <div className="flex flex-col items-start">
                  <span className="text-white/90">{s.name}</span>
                  <span className="text-[10px] text-zinc-500">{s.description}</span>
                </div>
                {source === s.id && (
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
