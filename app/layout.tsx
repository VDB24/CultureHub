import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Grenze_Gotisch } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const grenze = Grenze_Gotisch({
  variable: "--font-grenze",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CultureHub - Stream Movies & TV Shows",
  description: "Your premier destination for streaming movies and TV shows. Watch the latest and greatest content in English, Hindi, and more.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${grenze.variable}`}>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
