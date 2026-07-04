"use client"

import { useState, useEffect, useCallback } from "react"
import type { ContinueWatchingItem } from "@/lib/types"

const STORAGE_KEY = "peachifyProgress"

export function useContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        const list = Object.values(data) as ContinueWatchingItem[]
        setItems(list.filter((item) => item.progress && item.progress.duration > 0))
      }
    } catch {
      // ignore
    }
  }, [])

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
