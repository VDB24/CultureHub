import { NextRequest } from "next/server"
import { stripAds } from "@/lib/adblock"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const path = (await params).path.join("/")
  const searchParams = request.nextUrl.searchParams.toString()

  const upstreamUrl = `https://peachify.top/embed/${path}${searchParams ? `?${searchParams}` : ""}`

  const response = await fetch(upstreamUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://peachify.top/",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    },
  })

  if (!response.ok) {
    return new Response(`Upstream error: ${response.status}`, {
      status: response.status,
    })
  }

  const html = await response.text()
  const cleanHtml = stripAds(html)

  return new Response(cleanHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}
