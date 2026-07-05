"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Cast, Tv } from "lucide-react"
import { getSource } from "@/lib/sources"

declare global {
  interface Window {
    __onGCastApiAvailable?: (isAvailable: boolean, errorInfo?: unknown) => void
    cast?: {
      framework: {
        CastContext: {
          getInstance(): CastContextInstance
        }
        CastContextEventType: {
          CAST_STATE_CHANGED: string
        }
        CastState: {
          CONNECTED: string
          NOT_CONNECTED: string
          NO_DEVICES_AVAILABLE: string
          CONNECTING: string
        }
      }
    }
    chrome?: {
      cast?: {
        media: {
          DEFAULT_MEDIA_RECEIVER_APP_ID: string
        }
        AutoJoinPolicy: {
          ORIGIN_SCOPED: string
        }
      }
    }
  }
}

interface CastContextInstance {
  setOptions(options: { receiverApplicationId: string; autoJoinPolicy: string }): void
  getCastState(): string
  addEventListener(type: string, handler: (event: { castState: string }) => void): void
  removeEventListener(type: string, handler: (event: { castState: string }) => void): void
  requestSession(): Promise<void>
  endCurrentSession(stopCasting: boolean): void
}

interface CastButtonProps {
  onCastChange?: (casting: boolean) => void
  source?: string
}

const CAST_SDK_URL = "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"

export function CastButton({ onCastChange, source }: CastButtonProps) {
  const [isCasting, setIsCasting] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const contextRef = useRef<CastContextInstance | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (cleanupRef.current) return

    const originalCallback = window.__onGCastApiAvailable

    window.__onGCastApiAvailable = (isAvailable: boolean) => {
      if (!isAvailable || !window.cast?.framework) return

      const context = window.cast.framework.CastContext.getInstance()
      const appId = window.chrome?.cast?.media.DEFAULT_MEDIA_RECEIVER_APP_ID || "CC1AD845"

      context.setOptions({
        receiverApplicationId: appId,
        autoJoinPolicy: "origin_scoped",
      })

      contextRef.current = context
      setSdkReady(true)

      const CastState = window.cast.framework.CastState
      setIsCasting(context.getCastState() === CastState.CONNECTED)

      const handleStateChange = (event: { castState: string }) => {
        const connected = event.castState === CastState.CONNECTED
        setIsCasting(connected)
        onCastChange?.(connected)
      }

      context.addEventListener(
        window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        handleStateChange
      )

      cleanupRef.current = () => {
        context.removeEventListener(
          window.cast!.framework.CastContextEventType.CAST_STATE_CHANGED,
          handleStateChange
        )
        context.endCurrentSession(true)
        contextRef.current = null
      }
    }

    const script = document.createElement("script")
    script.src = CAST_SDK_URL
    script.async = true
    script.defer = true
    script.onerror = () => {
      setSdkReady(false)
    }
    document.head.appendChild(script)

    return () => {
      window.__onGCastApiAvailable = originalCallback
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [onCastChange])

  const handleCastClick = useCallback(async () => {
    if (!contextRef.current) {
      setShowFallback(true)
      setTimeout(() => setShowFallback(false), 3000)
      return
    }

    if (isCasting) {
      contextRef.current.endCurrentSession(true)
    } else {
      try {
        await contextRef.current.requestSession()
      } catch {
        // User cancelled or no devices available
      }
    }
  }, [isCasting])

  const config = source ? getSource(source) : undefined
  const hasBuiltinCast = source === "peachify" || source === "vidcore"

  return (
    <div className="relative">
      <button
        onClick={handleCastClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border shadow-lg ${
          isCasting
            ? "bg-primary/20 text-primary border-primary/50 hover:bg-primary/30"
            : "bg-black/60 text-white/70 border-zinc-600/50 hover:bg-zinc-800 hover:text-white"
        }`}
        aria-label={isCasting ? "Disconnect cast" : "Cast to device"}
        title={
          isCasting
            ? "Connected - click to disconnect"
            : !sdkReady
              ? "Cast SDK loading..."
              : "Cast to device"
        }
      >
        <Cast className="w-3.5 h-3.5" />
      </button>

      {showFallback && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl shadow-black/60 p-3 text-xs text-zinc-300">
          <div className="flex items-center gap-2 mb-2 text-white font-medium">
            <Tv className="w-3.5 h-3.5" />
            Casting
          </div>
          {!sdkReady ? (
            <p>Google Cast SDK not available. Use your browser&apos;s built-in Cast menu (Chrome menu &gt; Cast) to cast this tab.</p>
          ) : (
            <p>No Cast devices found on your network. Make sure your TV and computer are on the same Wi-Fi network.</p>
          )}
          {hasBuiltinCast && (
            <p className="mt-1.5 text-zinc-500">
              Tip: {config?.name} also has a cast button inside the player.
            </p>
          )}
        </div>
      )}

      {!showFallback && !isCasting && !sdkReady && (
        <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl shadow-black/60 p-2 text-[10px] text-zinc-500 text-center">
          Loading Cast SDK...
        </div>
      )}
    </div>
  )
}
