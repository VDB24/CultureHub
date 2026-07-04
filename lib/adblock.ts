import * as cheerio from "cheerio"

const AD_DOMAINS = [
  "popads.net",
  "popadscdn.net",
  "adsterra.com",
  "adsterratrk.com",
  "clickadu.com",
  "clicksor.com",
  "exoclick.com",
  "propellerads.com",
  "pushnami.com",
  "trafficjunky.com",
  "adcash.com",
  "adf.ly",
  "doubleclick.net",
  "googlesyndication.com",
  "googleadservices.com",
  "adserver.com",
  "adserversolutions.com",
  "adsrvr.org",
  "casalemedia.com",
  "contextweb.com",
  "cpmstar.com",
  "crwdcntrl.net",
  "gumgum.com",
  "indexww.com",
  "lijit.com",
  "media.net",
  "moat.com",
  "openx.net",
  "pubmatic.com",
  "quantserve.com",
  "rubiconproject.com",
  "scorecardresearch.com",
  "smaato.net",
  "spotx.tv",
  "taboola.com",
  "tidaltv.com",
  "yieldmo.com",
  "yieldtraffic.com",
  "jsc.adsterra.com",
  "theadst",
  "popjs",
]

const AD_PATTERNS = [
  "window.open",
  "popunder",
  "popup",
  "pop_ad",
  "popad",
  "advertisement",
  "ad_src",
  "showAd",
  "loadAd",
  "googletag",
  "AdSense",
  "adClient",
  "adSlot",
  "atOptions",
  "atConfig",
  "adsterra",
  "adFunction",
  "createPopup",
  "launchPopup",
  "openPopup",
]

const AD_SELECTORS = [
  "popup",
  "popunder",
  "advertisement",
  "adsby",
  "ad-container",
  "ad-slot",
  "banner-ad",
  "ad-placeholder",
  "ad-unit",
  "ad-box",
  "ad-wrapper",
  "ad-banner",
  "popup-overlay",
  "modal-ad",
]

export function stripAds(html: string): string {
  const $ = cheerio.load(html)

  $('script[src]').each((_, el) => {
    const src = $(el).attr("src") || ""
    if (AD_DOMAINS.some((d) => src.toLowerCase().includes(d))) {
      $(el).remove()
    }
  })

  $("script:not([src])").each((_, el) => {
    const content = $(el).html() || ""
    if (AD_PATTERNS.some((p) => content.toLowerCase().includes(p))) {
      $(el).remove()
    }
  })

  $("div, iframe, img").each((_, el) => {
    const cls = $(el).attr("class") || ""
    const id = $(el).attr("id") || ""
    const combined = `${cls} ${id}`.toLowerCase()
    if (AD_SELECTORS.some((s) => combined.includes(s))) {
      $(el).remove()
    }
  })

  $("[onclick]").each((_, el) => {
    const onclick = $(el).attr("onclick") || ""
    if (onclick.includes("window.open") || onclick.includes("popup")) {
      $(el).remove()
    }
  })

  $("iframe[src]").each((_, el) => {
    const src = $(el).attr("src") || ""
    if (AD_DOMAINS.some((d) => src.toLowerCase().includes(d))) {
      $(el).remove()
    }
  })

  return $.html()
}
