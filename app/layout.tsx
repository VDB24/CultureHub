import type { Metadata, Viewport } from "next"
import { Montserrat, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CultureHub — Stream Movies, TV Shows, Live TV & Sports",
  description: "Your premier destination for streaming movies, TV shows, anime, live TV and live sports. Watch the latest and greatest content in stunning quality — powered by the Ctv Pro premium viewer.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${geistMono.variable}`}>
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
