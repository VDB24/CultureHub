"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SearchCommand } from "@/components/SearchCommand"
import { Logo } from "@/components/Logo"
import { Film, Tv, Radio, Trophy, Menu, X, Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/tv", label: "TV Shows", icon: Tv },
  { href: "/anime", label: "Anime", icon: Sparkles },
  { href: "/live", label: "Live TV", icon: Radio, live: true },
  { href: "/sports", label: "Sports", icon: Trophy },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setMobileOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className="mx-auto h-full px-2 sm:px-4">
          <div
            className={cn(
              "h-full rounded-2xl border transition-[background-color,border-color,box-shadow] duration-500 ease-apple",
              scrolled
                ? "glass-deep border-white/10 shadow-apple-card"
                : "border-transparent bg-transparent"
            )}
          >
            <div className="flex items-center justify-between h-full px-3 sm:px-4">
              {/* Logo */}
              <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
                <Logo size="default" />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-0.5 p-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname.startsWith(link.href)
                  return (
                    <Link key={link.href} href={link.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "gap-2 rounded-full text-[13px] tracking-tight px-3.5",
                          isActive
                            ? "text-white bg-primary hover:bg-primary hover:text-white glow-primary-sm"
                            : "text-zinc-400 hover:text-white hover:bg-white/10"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {link.label}
                        {link.live && (
                          <span className="relative flex w-1.5 h-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-primary" />
                          </span>
                        )}
                      </Button>
                    </Link>
                  )
                })}
              </nav>

              {/* Right side */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </Button>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            "lg:hidden fixed inset-x-2 top-[4.25rem] z-50 transition-all duration-300 ease-apple origin-top",
            mobileOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          <div className="glass-deep rounded-2xl border border-white/10 shadow-apple-card overflow-hidden">
            <div className="p-2 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      isActive
                        ? "text-white bg-primary/15 border border-primary/30"
                        : "text-zinc-300 hover:bg-white/10 border border-transparent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                    {link.live && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/15 text-rose-300 text-[9px] font-bold tracking-widest ml-auto">
                        LIVE
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-white/[0.07] bg-primary/[0.06]">
              <p className="text-[11px] text-zinc-400">
                Live TV &amp; Sports — <span className="text-rose-300 font-semibold">Ctv Pro only</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}