interface LogoProps {
  size?: "sm" | "default" | "lg"
}

const sizes = {
  sm: { svg: 28, text: "text-lg", gap: "gap-2" },
  default: { svg: 36, text: "text-xl", gap: "gap-2.5" },
  lg: { svg: 44, text: "text-2xl", gap: "gap-3" },
}

export function Logo({ size = "default" }: LogoProps) {
  const s = sizes[size]

  return (
    <div className={`flex items-center ${s.gap}`}>
      <svg
        viewBox="0 0 36 36"
        width={s.svg}
        height={s.svg}
        className="text-primary flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#da1b1b" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="4" stroke="url(#logoGrad)" strokeWidth="1.5" className="logo-pulse-ring" />
        <circle cx="18" cy="18" r="4" stroke="url(#logoGrad)" strokeWidth="1.5" className="logo-pulse-ring-2" />
        <circle cx="18" cy="18" r="4" stroke="url(#logoGrad)" strokeWidth="1.5" className="logo-pulse-ring-3" />
        <circle cx="18" cy="18" r="2.5" fill="url(#logoGrad)" className="logo-center-dot" />
      </svg>
      <span className={`${s.text} font-display tracking-tight leading-none`}>
        <span className="text-white">Culture</span>
        <span className="text-primary text-glow">Hub</span>
      </span>
    </div>
  )
}
