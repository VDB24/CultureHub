"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchCommand } from "@/components/SearchCommand"
import { Logo } from "@/components/Logo"
import { Film, Tv, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/tv", label: "TV Shows", icon: Tv },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass rounded-none border-x-0 border-t-0 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size="default" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-2 rounded-full",
                        isActive
                          ? "text-primary bg-primary/15 hover:bg-primary/20 hover:text-primary"
                          : "text-zinc-300 hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-zinc-400 hover:text-white"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-zinc-400 hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0d0d0d]/95 backdrop-blur-xl animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 rounded-lg",
                        isActive ? "text-primary bg-primary/15" : "text-zinc-300"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
