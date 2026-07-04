import Link from "next/link"
import { Logo } from "@/components/Logo"

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Logo size="lg" />
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Your premier destination for streaming movies and TV shows. Powered by Peachify.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Browse</h3>
            <ul className="space-y-2">
              <li><Link href="/movies" className="text-sm text-zinc-500 hover:text-primary transition-colors">Movies</Link></li>
              <li><Link href="/tv" className="text-sm text-zinc-500 hover:text-primary transition-colors">TV Shows</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Content</h3>
            <ul className="space-y-2">
              <li><Link href="/movies?language=hi" className="text-sm text-zinc-500 hover:text-primary transition-colors">Hindi Movies</Link></li>
              <li><Link href="/tv?language=hi" className="text-sm text-zinc-500 hover:text-primary transition-colors">Hindi Shows</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Info</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-zinc-500">Data from TMDB</span></li>
              <li><span className="text-sm text-zinc-500">Streaming by Peachify</span></li>
              <li><span className="text-sm text-zinc-500">For personal use only</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-600">
          &copy; {new Date().getFullYear()} CultureHub. This site does not host any media files.
        </div>
      </div>
    </footer>
  )
}
