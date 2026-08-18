"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Radio } from "lucide-react"
import type { LiveChannel } from "@/lib/live"

interface ChannelLogoProps {
  channel: LiveChannel
  className?: string
  showLiveBadge?: boolean
}

export function ChannelLogo({ channel, className, showLiveBadge }: ChannelLogoProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        channel.color,
        className
      )}
    >
      <span className="absolute inset-0 bg-black/25" />
      {failed ? (
        <span className="relative font-display text-white text-3xl leading-none drop-shadow-lg">
          {channel.name.charAt(0)}
        </span>
      ) : (
        <span className="relative flex items-center justify-center w-[46%] aspect-square rounded-lg bg-white shadow-lg overflow-hidden p-[5%]">
          <Image
            src={`/channels/${channel.id}.png`}
            alt={channel.name}
            width={64}
            height={64}
            unoptimized
            onError={() => setFailed(true)}
            className="w-full h-full object-contain"
          />
        </span>
      )}
      {showLiveBadge && (
        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/55 backdrop-blur-md text-white text-[9px] font-bold tracking-widest">
          <Radio className="w-2.5 h-2.5 text-rose-300" />
          LIVE
        </span>
      )}
    </div>
  )
}