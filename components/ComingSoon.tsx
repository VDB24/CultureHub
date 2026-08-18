import { Clock, Sparkles } from "lucide-react"

export function ComingSoon() {
  return (
    <div className="mt-14 rounded-2xl border border-dashed border-primary/25 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent p-6 sm:p-8 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-rose-300" />
        </div>
        <div>
          <p className="text-white font-display text-xl sm:text-2xl mb-1">
            More exclusive content coming soon
          </p>
          <p className="text-sm text-zinc-500 max-w-xl">
            New channels, leagues and premium events are on the way. Stay tuned — only on the Ctv Pro viewer.
          </p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/15 text-rose-300 text-[11px] font-bold tracking-[0.18em] uppercase">
        <Sparkles className="w-3.5 h-3.5" />
        Soon
      </span>
    </div>
  )
}