// Live TV & Sports player config.
// Streams are public HLS (m3u8) endpoints aggregated via iptv-org. Each channel
// carries a list of candidate streams; the player tries them in order until one
// plays. URLs change upstream - refresh this list by pulling the latest
// https://iptv-org.github.io/api/streams.json data.

// ---------- Live TV channels ----------
export type ChannelCategory =
  | "News"
  | "Sports"
  | "Entertainment"
  | "Movies"
  | "Kids"
  | "Music"
  | "International"

export interface LiveChannel {
  id: string
  name: string
  category: ChannelCategory
  country: string
  language: string
  hd?: boolean
  color: string
  streams: string[]
}

const CHANNEL_COLORS: Record<string, string> = {
  red: "from-red-600 to-rose-500",
  blue: "from-blue-600 to-sky-500",
  green: "from-emerald-600 to-teal-500",
  amber: "from-amber-500 to-orange-500",
  violet: "from-violet-600 to-purple-500",
  zinc: "from-zinc-600 to-zinc-400",
  pink: "from-pink-600 to-fuchsia-500",
}

export const LIVE_CHANNELS: LiveChannel[] = [
  // News
  { id: "cnn", name: "CNN", category: "News", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.red, streams: [] },
  { id: "bbc-news", name: "BBC News", category: "News", country: "UK", language: "English", hd: true, color: CHANNEL_COLORS.zinc, streams: ["https://dash2.antik.sk/live/test_bbc_world/playlist.m3u8", "https://thinkkast.dpdns.org/thinkkast/bbcworld_news_sd/versiglia/index.m3u8", "https://jmp2.uk/plu-65d92a8c8b24c80008e285c0.m3u8"] },
  { id: "al-jazeera", name: "Al Jazeera", category: "News", country: "Qatar", language: "English", hd: true, color: CHANNEL_COLORS.blue, streams: ["https://live-hls-apps-aje-v3-fa.getaj.net/AJE/index.m3u8", "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8", "https://streams.comclark.com/pknsd/al_jazeera/playlist.m3u8"] },
  { id: "sky-news", name: "Sky News", category: "News", country: "UK", language: "English", hd: true, color: CHANNEL_COLORS.violet, streams: ["https://jmp2.uk/plu-55b285cd2665de274553d66f.m3u8"] },
  { id: "fox-news", name: "Fox News", category: "News", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.blue, streams: ["http://247preview.foxnews.com/hls/live/2020027/fncv3preview/primary.m3u8", "http://138.121.15.230:9002/FOX-NEWS/index.m3u8", "http://45.190.28.50/FOX_NEWS/index.m3u8"] },
  { id: "ndtv-24x7", name: "NDTV 24x7", category: "News", country: "India", language: "Hindi", hd: true, color: CHANNEL_COLORS.red, streams: ["https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/master.m3u8", "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/NDTV24x7.m3u8"] },
  { id: "times-now", name: "Times Now", category: "News", country: "India", language: "Hindi", hd: true, color: CHANNEL_COLORS.zinc, streams: ["https://pubads.g.doubleclick.net/ssai/event/1mR1QUQ3Tg-VuKfiyjwNuA/master.m3u8", "https://dztlhgid9me95.cloudfront.net/live-tv/Vidgyor/timesnow/timesnow_master.m3u8"] },
  { id: "wion", name: "WION", category: "News", country: "India", language: "English", hd: true, color: CHANNEL_COLORS.blue, streams: ["https://d7x8z4yuq42qn.cloudfront.net/index_4.m3u8", "https://wion-klowdtv.amagi.tv/playlist.m3u8", "https://raw.githubusercontent.com/Alstruit/adaptive-streams/alstruit-10_23_in/streams/in/WION.in.m3u8"] },

  // Sports
  { id: "espn", name: "ESPN", category: "Sports", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.red, streams: ["http://190.83.2.182:8090/ESPN/index.m3u8", "http://181.78.197.59:8000/play/a07z/index.m3u8"] },
  { id: "star-sports-1", name: "Star Sports 1", category: "Sports", country: "India", language: "English/Hindi", hd: true, color: CHANNEL_COLORS.blue, streams: ["https://tvsen7.aynaott.com/sspts1/index.m3u8", "http://41.205.93.154/STARSPORTS1/index.m3u8"] },
  { id: "sony-sports", name: "Sony Sports", category: "Sports", country: "India", language: "English/Hindi", hd: true, color: CHANNEL_COLORS.green, streams: [] },
  { id: "bein-sports", name: "beIN Sports", category: "Sports", country: "Qatar", language: "English", hd: true, color: CHANNEL_COLORS.amber, streams: [] },
  { id: "sky-sports", name: "Sky Sports", category: "Sports", country: "UK", language: "English", hd: true, color: CHANNEL_COLORS.violet, streams: ["https://7nyaler.streamhostingcdn.top/stream/19/index.m3u8"] },
  { id: "eurosport", name: "Eurosport", category: "Sports", country: "Europe", language: "English", hd: true, color: CHANNEL_COLORS.blue, streams: [] },

  // Entertainment
  { id: "hbo", name: "HBO", category: "Entertainment", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.zinc, streams: [] },
  { id: "star-plus", name: "Star Plus", category: "Entertainment", country: "India", language: "Hindi", hd: true, color: CHANNEL_COLORS.pink, streams: ["http://202.70.146.135:8000/play/a009/index.m3u8"] },
  { id: "colors", name: "Colors TV", category: "Entertainment", country: "India", language: "Hindi", hd: true, color: CHANNEL_COLORS.red, streams: ["http://59.103.38.46:8000/play/a00b/index.m3u8"] },
  { id: "zee-tv", name: "Zee TV", category: "Entertainment", country: "India", language: "Hindi", hd: true, color: CHANNEL_COLORS.amber, streams: ["https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/sg/YuppTV/ZeeTVHDAPAC.m3u8"] },
  { id: "sony-ent", name: "Sony Entertainment", category: "Entertainment", country: "India", language: "Hindi", hd: true, color: CHANNEL_COLORS.violet, streams: ["http://38.96.178.205/SONYHD/index.m3u8"] },
  { id: "nbc", name: "NBC", category: "Entertainment", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.blue, streams: ["http://170.254.17.2/NBC/index.m3u8", "http://stream.cammonitorplus.net/1800/index.m3u8", "http://190.11.225.124:5000/live/nbc_hd/playlist.m3u8"] },

  // Movies
  { id: "hbo-max", name: "HBO Max", category: "Movies", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.violet, streams: [] },
  { id: "cinemax", name: "Cinemax", category: "Movies", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.zinc, streams: ["https://streamer.metronethn.com/Cinemax/index.m3u8"] },
  { id: "amc", name: "AMC", category: "Movies", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.green, streams: ["https://amchls.wns.live/hls/stream.m3u8"] },
  { id: "zonestars", name: "Zone Stars", category: "Movies", country: "India", language: "Hindi", hd: true, color: CHANNEL_COLORS.amber, streams: ["https://d1g8wgjurz8via.cloudfront.net/bpk-tv/NGCHD/default/NGCHD.m3u8", "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/sg/YuppTV/ZeeCinemaAPAC.m3u8", "https://amg17931-zee-amg17931c5-samsung-au-8873.playouts.now.amagi.tv/playlist.m3u8"] },

  // Kids
  { id: "cartoon-network", name: "Cartoon Network", category: "Kids", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.blue, streams: [] },
  { id: "nickelodeon", name: "Nickelodeon", category: "Kids", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.amber, streams: ["https://sra72yz.s.gy/NICKELODEON_EAST_US.m3u8", "http://23.237.104.106:8080/USA_NICKELODEON/index.m3u8", "http://198.58.104.90:8989/nickelodeon/index.m3u8"] },
  { id: "disney-jr", name: "Disney Junior", category: "Kids", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.pink, streams: ["http://tvsen7.aynascope.net/disney/index.m3u8", "http://tvsen7.aynascope.net/disneyjr/index.m3u8", "http://tvsen5.aynascope.net/disney/index.m3u8"] },

  // Music
  { id: "mtv", name: "MTV", category: "Music", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.red, streams: ["http://198.58.104.90:8989/mtv/index.m3u8", "http://40.160.24.53/MTV/index.m3u8"] },
  { id: "vh1", name: "VH1", category: "Music", country: "USA", language: "English", hd: true, color: CHANNEL_COLORS.blue, streams: ["http://40.160.24.55/VH1_WEST/index.m3u8", "http://40.160.24.55/VH1/index.m3u8"] },
  { id: "9xm", name: "9XM", category: "Music", country: "India", language: "Hindi", hd: true, color: CHANNEL_COLORS.violet, streams: ["https://b.jsrdn.com/strm/channels/9xm/master.m3u8", "https://epiconvh.akamaized.net/live/9XM/master.m3u8", "https://9xjio.wiseplayout.com/9XM/master.m3u8"] },

  // International
  { id: "france-24", name: "France 24", category: "International", country: "France", language: "English", hd: true, color: CHANNEL_COLORS.blue, streams: ["https://live.france24.com/hls/live/2037179-b/F24_FR_HI_HLS/master_900.m3u8", "https://live.france24.com/hls/live/2037179/F24_FR_HI_HLS/master_2300.m3u8"] },
  { id: "dw", name: "DW", category: "International", country: "Germany", language: "English", hd: true, color: CHANNEL_COLORS.zinc, streams: ["https://cdn-7.pishow.tv/live/431/master.m3u8", "https://dwamdstream110.akamaized.net/hls/live/2017971/dwstream110/master.m3u8", "https://stream8.cinerama.uz/1418/tracks-v1a1/mono.m3u8"] },
  { id: "rt", name: "RT", category: "International", country: "Russia", language: "English", hd: true, color: CHANNEL_COLORS.green, streams: [] },
  { id: "cctv", name: "CGTN", category: "International", country: "China", language: "English", hd: true, color: CHANNEL_COLORS.red, streams: ["https://dash4.antik.sk/live/test_cgtn/playlist.m3u8", "https://streams.comclark.com/pknsd/cgtn/playlist.m3u8", "https://h5cul1yar48um3t.wcetv.com/hls/cgtn.m3u8"] },
]

export const CHANNEL_CATEGORIES: ChannelCategory[] = [
  "News",
  "Sports",
  "Entertainment",
  "Movies",
  "Kids",
  "Music",
  "International",
]

// ---------- Live sports ----------
export type Sport = "Football" | "Cricket" | "Basketball" | "Tennis" | "Racing" | "Hockey" | "Boxing"

export interface SportsFixture {
  id: string
  sport: Sport
  league: string
  home: string
  away: string
  kickoff: string
  live?: boolean
  color: string
  channelId: string
}

const FIXTURE_COLORS: Record<string, string> = {
  green: "from-emerald-600 to-teal-500",
  blue: "from-blue-600 to-sky-500",
  red: "from-red-600 to-rose-500",
  amber: "from-amber-500 to-orange-500",
  violet: "from-violet-600 to-purple-500",
  zinc: "from-zinc-600 to-zinc-400",
}

export const SPORTS_FIXTURES: SportsFixture[] = [
  // Football
  { id: "epl-man-city-arsenal", sport: "Football", league: "Premier League", home: "Manchester City", away: "Arsenal", kickoff: "Today · 20:00", live: true, color: FIXTURE_COLORS.blue, channelId: "sky-sports" },
  { id: "ucl-real-bayern", sport: "Football", league: "UEFA Champions League", home: "Real Madrid", away: "Bayern Munich", kickoff: "Today · 22:00", live: true, color: FIXTURE_COLORS.violet, channelId: "sky-sports" },
  { id: "laliga-barca-atleti", sport: "Football", league: "La Liga", home: "Barcelona", away: "Atlético Madrid", kickoff: "Tomorrow · 23:30", color: FIXTURE_COLORS.red, channelId: "sky-sports" },
  { id: "seriea-inter-juve", sport: "Football", league: "Serie A", home: "Inter Milan", away: "Juventus", kickoff: "Tomorrow · 00:45", color: FIXTURE_COLORS.zinc, channelId: "sky-sports" },
  { id: "bundesliga-dortmund-leipzig", sport: "Football", league: "Bundesliga", home: "Borussia Dortmund", away: "RB Leipzig", kickoff: "Sat · 20:30", color: FIXTURE_COLORS.amber, channelId: "sky-sports" },

  // Cricket
  { id: "ipl-mumbai-chennai", sport: "Cricket", league: "Indian Premier League", home: "Mumbai Indians", away: "Chennai Super Kings", kickoff: "Today · 19:30", live: true, color: FIXTURE_COLORS.amber, channelId: "star-sports-1" },
  { id: "ipl-rcb-kkr", sport: "Cricket", league: "Indian Premier League", home: "Royal Challengers Bengaluru", away: "Kolkata Knight Riders", kickoff: "Tomorrow · 19:30", color: FIXTURE_COLORS.red, channelId: "star-sports-1" },
  { id: "test-ind-aus", sport: "Cricket", league: "Test Series", home: "India", away: "Australia", kickoff: "Fri · 09:30", color: FIXTURE_COLORS.blue, channelId: "star-sports-1" },

  // Basketball
  { id: "nba-lakers-celtics", sport: "Basketball", league: "NBA", home: "LA Lakers", away: "Boston Celtics", kickoff: "Today · 21:30", live: true, color: FIXTURE_COLORS.green, channelId: "espn" },
  { id: "nba-gsw-suns", sport: "Basketball", league: "NBA", home: "Golden State Warriors", away: "Phoenix Suns", kickoff: "Tomorrow · 20:00", color: FIXTURE_COLORS.zinc, channelId: "espn" },

  // Tennis
  { id: "tennis-us-open-sf", sport: "Tennis", league: "US Open · Semifinal", home: "Alcaraz", away: "Sinner", kickoff: "Today · 19:00", live: true, color: FIXTURE_COLORS.violet, channelId: "espn" },
  { id: "tennis-wimbledon-final", sport: "Tennis", league: "Wimbledon · Final", home: "Djokovic", away: "Zverev", kickoff: "Sun · 18:00", color: FIXTURE_COLORS.green, channelId: "espn" },

  // Racing
  { id: "f1-monza-gp", sport: "Racing", league: "Formula 1", home: "Monza Grand Prix", away: "Qualifying", kickoff: "Sat · 15:00", color: FIXTURE_COLORS.red, channelId: "sky-sports" },
  { id: "f1-british-gp", sport: "Racing", league: "Formula 1", home: "British Grand Prix", away: "Race", kickoff: "Sun · 14:00", color: FIXTURE_COLORS.blue, channelId: "sky-sports" },

  // Hockey / Boxing
  { id: "nhl-rangers-oilers", sport: "Hockey", league: "NHL", home: "NY Rangers", away: "Edmonton Oilers", kickoff: "Today · 23:00", live: true, color: FIXTURE_COLORS.zinc, channelId: "espn" },
  { id: "boxing-ufc-main", sport: "Boxing", league: "UFC Main Card", home: "Volkanovski", away: "Makhachev", kickoff: "Sun · 05:00", color: FIXTURE_COLORS.amber, channelId: "espn" },
]

export const SPORTS: Sport[] = ["Football", "Cricket", "Basketball", "Tennis", "Racing", "Hockey", "Boxing"]

export function getChannel(id: string): LiveChannel | undefined {
  return LIVE_CHANNELS.find((c) => c.id === id)
}

export function getFixture(id: string): SportsFixture | undefined {
  return SPORTS_FIXTURES.find((f) => f.id === id)
}