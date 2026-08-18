"use client"

import { useState, useCallback } from "react"
import type { ContinueWatchingItem } from "@/lib/types"

const STORAGE_KEY = "culturehub-progress"

function loadItems(): ContinueWatchingItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return (Object.values(data) as ContinueWatchingItem[]).filter(
      (item) => item.progress && item.progress.duration > 0
    )
  } catch {
    return []
  }
}

export function useContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>(loadItems)

  const addItem = useCallback((item: ContinueWatchingItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const data = raw ? JSON.parse(raw) : {}
      data[item.id] = item
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setItems(Object.values(data))
    } catch {
      // ignore
    }
  }, [])

  const removeItem = useCallback((id: number) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const data = raw ? JSON.parse(raw) : {}
      delete data[id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setItems(Object.values(data))
    } catch {
      // ignore
    }
  }, [])

  return { items, addItem, removeItem }
}
