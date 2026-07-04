import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function getYear(dateStr: string): string {
  if (!dateStr) return ""
  return dateStr.split("-")[0] || ""
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + "..."
}

export function getImageUrl(path: string | null, size: string = "w500"): string {
  if (!path) return "/placeholder.svg"
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function getBackdropUrl(path: string | null): string {
  return getImageUrl(path, "original")
}

export function getPosterUrl(path: string | null): string {
  return getImageUrl(path, "w500")
}
