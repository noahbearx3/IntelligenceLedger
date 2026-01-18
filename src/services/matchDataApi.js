/**
 * Match Data API Service
 * Uses Flashscore Scraper API for real-time football data
 * Falls back to mock data when scraper is unavailable
 */

// Scraper API endpoint (Vercel serverless function)
const SCRAPER_URL = "/api/scrape";

// Check if we're in production (scraper available)
export const hasApiKey = true; // Scraper doesn't need API key

// ==================== CACHING LAYER ====================
// Cache API responses for 5 minutes to reduce scraper load
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Track scraper calls for debugging
let scraperCallsThisSession = 0;
export function getApiCallCount() {
  return scraperCallsThisSession;
}

// Team name mappings (for display purposes)
export const TEAM_IDS = {
  // Premier League
  "Liverpool": "liverpool",
  "Arsenal": "arsenal",
  "Manchester City": "manchester-city",
  "Manchester United": "manchester-united",
  "Chelsea": "chelsea",
  "Tottenham": "tottenham",
  "Newcastle United": "newcastle-utd",
  "Aston Villa": "aston-villa",
  "Brighton": "brighton",
  "West Ham": "west-ham",
  "Everton": "everton",
  "Nottingham Forest": "nottingham-forest",
  "Fulham": "fulham",
  "Brentford": "brentford",
  "Crystal Palace": "crystal-palace",
  "Bournemouth": "bournemouth",
  "Wolves": "wolverhampton",
  "Leicester City": "leicester",
  "Ipswich Town": "ipswich",
  "Southampton": "southampton",
  
  // La Liga
  "Real Madrid": "real-madrid",
  "Barcelona": "barcelona",
  "Atlético Madrid": "atletico-madrid",
  "Athletic Bilbao": "athletic-bilbao",
  "Real Sociedad": "real-sociedad",
  "Villarreal": "villarreal",
  "Real Betis": "real-betis",
  "Sevilla": "sevilla",
  "Valencia": "valencia",
  "Girona": "girona",
  
  // MLS
  "Inter Miami": "inter-miami",
  "LA Galaxy": "la-galaxy",
  "LAFC": "los-angeles-fc",
  "Atlanta United": "atlanta-united",
  "Seattle Sounders": "seattle-sounders",
  "Columbus Crew": "columbus-crew",
};

// League IDs
export const LEAGUE_IDS = {
  "EPL": "england/premier-league",
  "La Liga": "spain/laliga",
  "Bundesliga": "germany/bundesliga",
  "Serie A": "italy/serie-a",
  "Ligue 1": "france/ligue-1",
  "MLS": "usa/mls",
};

/**
 * Call the scraper API
 */
async function callScraper(type, params) {
  const cacheKey = `${type}:${JSON.stringify(params)}`;
  
  // Check cache first
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`📦 Cache hit: ${cacheKey}`);
    return cached;
  }

  try {
    console.log(`🔍 Scraper call #${++scraperCallsThisSession}: ${type}`, params);
    
    const response = await fetch(SCRAPER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...params }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Scraper error:", response.status, errorText);
      return null;
    }

    const result = await response.json();
    
    if (!result.success) {
      console.error("❌ Scraper returned error:", result.error);
      return null;
    }

    console.log(`✅ Scraper response:`, result.data);
    
    // Cache the response
    setCache(cacheKey, result.data);
    
    return result.data;
  } catch (error) {
    console.error("❌ Scraper fetch error:", error);
    return null;
  }
}

/**
 * Get team's next fixture
 */
export async function getNextFixture(teamName) {
  if (!TEAM_IDS[teamName]) {
    console.log(`⚠️ Unknown team: ${teamName}, using mock`);
    return getMockNextFixture(teamName);
  }

  const data = await callScraper("team", { teamName });
  
  if (!data || !data.nextFixture) {
    console.log(`⚠️ No fixture from scraper for ${teamName}, using mock`);
    return getMockNextFixture(teamName);
  }

  return {
    id: Date.now(),
    date: data.nextFixture.time,
    venue: "TBD",
    home: { name: data.nextFixture.home, logo: null },
    away: { name: data.nextFixture.away, logo: null },
    league: "League",
    round: "",
  };
}

/**
 * Get team's recent results (last 5)
 */
export async function getTeamForm(teamName) {
  if (!TEAM_IDS[teamName]) {
    console.log(`⚠️ Unknown team: ${teamName}, using mock form`);
    return getMockTeamForm(teamName);
  }

  const data = await callScraper("form", { teamName });
  
  if (!data || data.length === 0) {
    console.log(`⚠️ No form from scraper for ${teamName}, using mock`);
    return getMockTeamForm(teamName);
  }

  return data.map((match, i) => ({
    id: i,
    date: match.date || new Date().toISOString(),
    home: match.home,
    away: match.away,
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    result: match.result || "D",
  }));
}

/**
 * Get lineup for a fixture (not available via scraper yet)
 */
export async function getLineup(fixtureId) {
  // Lineups require real-time data closer to match - use mock for now
  return getMockLineup();
}

/**
 * Get head-to-head history (use mock for now)
 */
export async function getH2H(team1Name, team2Name) {
  // H2H requires specific match history scraping - use mock for now
  return getMockH2H(team1Name, team2Name);
}

/**
 * Get team injuries (not easily available via scraper)
 */
export async function getInjuries(teamName) {
  // Injuries are hard to scrape reliably - return empty (no injuries)
  return [];
}

/**
 * Get league standings
 */
export async function getStandings(league) {
  if (!LEAGUE_IDS[league]) {
    console.log(`⚠️ Unknown league: ${league}, using mock standings`);
    return getMockStandings(league);
  }

  const data = await callScraper("standings", { league });
  
  if (!data || data.length === 0) {
    console.log(`⚠️ No standings from scraper for ${league}, using mock`);
    return getMockStandings(league);
  }

  return data.slice(0, 20).map(team => ({
    rank: team.rank,
    name: team.name,
    logo: null,
    played: team.played,
    won: team.won,
    drawn: team.drawn,
    lost: team.lost,
    gf: team.gf,
    ga: team.ga,
    gd: team.gd,
    points: team.points,
    form: "",
  }));
}

// ==================== MOCK DATA ====================

function getMockNextFixture(teamName) {
  const opponents = {
    "Liverpool": "Manchester City",
    "Arsenal": "Chelsea", 
    "Manchester City": "Liverpool",
    "Real Madrid": "Barcelona",
    "Barcelona": "Real Madrid",
    "Inter Miami": "LA Galaxy",
  };
  
  const opponent = opponents[teamName] || "TBD";
  const isHome = Math.random() > 0.5;
  
  return {
    id: Math.floor(Math.random() * 100000),
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    venue: isHome ? `${teamName} Stadium` : `${opponent} Stadium`,
    home: { name: isHome ? teamName : opponent, logo: null },
    away: { name: isHome ? opponent : teamName, logo: null },
    league: "Premier League",
    round: "Round 22",
  };
}

function getMockTeamForm(teamName) {
  const results = ["W", "W", "D", "W", "L"];
  return results.map((result, i) => ({
    id: i,
    date: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    home: i % 2 === 0 ? teamName : "Opponent FC",
    away: i % 2 === 0 ? "Opponent FC" : teamName,
    homeGoals: result === "W" ? 2 : result === "D" ? 1 : 0,
    awayGoals: result === "W" ? 0 : result === "D" ? 1 : 2,
    result,
  }));
}

function getMockLineup() {
  return [
    {
      team: "Home Team",
      formation: "4-3-3",
      startXI: [
        { name: "Alisson", number: 1, pos: "G" },
        { name: "Alexander-Arnold", number: 66, pos: "D" },
        { name: "Van Dijk", number: 4, pos: "D" },
        { name: "Konaté", number: 5, pos: "D" },
        { name: "Robertson", number: 26, pos: "D" },
        { name: "Mac Allister", number: 10, pos: "M" },
        { name: "Gravenberch", number: 38, pos: "M" },
        { name: "Szoboszlai", number: 8, pos: "M" },
        { name: "Salah", number: 11, pos: "F" },
        { name: "Núñez", number: 9, pos: "F" },
        { name: "Díaz", number: 7, pos: "F" },
      ],
      substitutes: [
        { name: "Kelleher", number: 62, pos: "G" },
        { name: "Gómez", number: 2, pos: "D" },
        { name: "Jones", number: 17, pos: "M" },
      ],
      coach: "Arne Slot",
    }
  ];
}

function getMockH2H(team1, team2) {
  return {
    matches: [
      { date: "2024-12-01", home: team1, away: team2, homeGoals: 2, awayGoals: 1 },
      { date: "2024-05-15", home: team2, away: team1, homeGoals: 1, awayGoals: 1 },
      { date: "2023-12-10", home: team1, away: team2, homeGoals: 3, awayGoals: 0 },
      { date: "2023-04-22", home: team2, away: team1, homeGoals: 0, awayGoals: 2 },
      { date: "2022-11-05", home: team1, away: team2, homeGoals: 1, awayGoals: 2 },
    ],
    stats: { wins: 3, draws: 1, losses: 1, total: 5 },
  };
}

function getMockStandings(league) {
  const teams = [
    { name: "Liverpool", points: 50, gd: 32 },
    { name: "Arsenal", points: 44, gd: 25 },
    { name: "Nottingham Forest", points: 41, gd: 9 },
    { name: "Chelsea", points: 39, gd: 14 },
    { name: "Manchester City", points: 38, gd: 17 },
  ];
  
  return teams.map((t, i) => ({
    rank: i + 1,
    name: t.name,
    logo: null,
    played: 21,
    won: Math.floor(t.points / 3),
    drawn: (t.points % 3),
    lost: 21 - Math.floor(t.points / 3) - (t.points % 3),
    gf: 40 + t.gd,
    ga: 40,
    gd: t.gd,
    points: t.points,
    form: "WWDWL",
  }));
}
