"use client"

import { useRef, useState } from "react"
import { MediaCard } from "@/components/MediaCard"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/lib/types"

interface ContentRowProps {
  title?: string
  titleNode?: React.ReactNode
  items?: MediaItem[]
  isLoading?: boolean
  rank?: boolean
}

export function ContentRow({ title, titleNode, items, isLoading, rank }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="flex gap-4 sm:gap-5 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[150px] sm:w-[170px]">
              <Skeleton className="aspect-[2/3] rounded-2xl" />
              <Skeleton className="h-4 w-24 mt-3" />
              <Skeleton className="h-3 w-14 mt-1" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!items || items.length === 0) return null

  return (
    <section className="relative group/row">
      {titleNode ? (
        titleNode
      ) : title ? (
        <h2 className="font-display text-xl sm:text-2xl text-white mb-4 px-0">{title}</h2>
      ) : null}

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-background/90 to-transparent flex items-center justify-start opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-white ml-1" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto overscroll-x-contain scrollbar-none pb-2 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "snap-start flex-shrink-0 w-[150px] sm:w-[170px]",
                rank ? "pl-8 sm:pl-10 first:pl-8" : ""
              )}
            >
              <MediaCard item={item} rank={rank ? idx + 1 : undefined} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-background/90 to-transparent flex items-center justify-end opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-white mr-1" />
          </button>
        )}
      </div>
    </section>
  )
}
