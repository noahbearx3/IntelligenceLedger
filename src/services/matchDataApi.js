/**
 * Match Data API Service
 * Uses ESPN public API via serverless function for all sports
 */

// API endpoint (Vercel serverless function)
const API_URL = "/api/scrape";

// API is always available (ESPN is public)
export const hasApiKey = true;

// ==================== CACHING LAYER ====================
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

let apiCallsThisSession = 0;
export function getApiCallCount() {
  return apiCallsThisSession;
}

// All supported teams (must match api/scrape.js ESPN_TEAM_IDS)
export const TEAM_IDS = {
  // NFL
  "Buffalo Bills": true,
  "Miami Dolphins": true,
  "New England Patriots": true,
  "New York Jets": true,
  "Baltimore Ravens": true,
  "Cincinnati Bengals": true,
  "Cleveland Browns": true,
  "Pittsburgh Steelers": true,
  "Houston Texans": true,
  "Indianapolis Colts": true,
  "Jacksonville Jaguars": true,
  "Tennessee Titans": true,
  "Denver Broncos": true,
  "Kansas City Chiefs": true,
  "Las Vegas Raiders": true,
  "Los Angeles Chargers": true,
  "Dallas Cowboys": true,
  "New York Giants": true,
  "Philadelphia Eagles": true,
  "Washington Commanders": true,
  "Chicago Bears": true,
  "Detroit Lions": true,
  "Green Bay Packers": true,
  "Minnesota Vikings": true,
  "Atlanta Falcons": true,
  "Carolina Panthers": true,
  "New Orleans Saints": true,
  "Tampa Bay Buccaneers": true,
  "Arizona Cardinals": true,
  "Los Angeles Rams": true,
  "San Francisco 49ers": true,
  "Seattle Seahawks": true,
  
  // NBA
  "Atlanta Hawks": true,
  "Boston Celtics": true,
  "Brooklyn Nets": true,
  "Charlotte Hornets": true,
  "Chicago Bulls": true,
  "Cleveland Cavaliers": true,
  "Dallas Mavericks": true,
  "Denver Nuggets": true,
  "Detroit Pistons": true,
  "Golden State Warriors": true,
  "Houston Rockets": true,
  "Indiana Pacers": true,
  "LA Clippers": true,
  "Los Angeles Lakers": true,
  "Memphis Grizzlies": true,
  "Miami Heat": true,
  "Milwaukee Bucks": true,
  "Minnesota Timberwolves": true,
  "New Orleans Pelicans": true,
  "New York Knicks": true,
  "Oklahoma City Thunder": true,
  "Orlando Magic": true,
  "Philadelphia 76ers": true,
  "Phoenix Suns": true,
  "Portland Trail Blazers": true,
  "Sacramento Kings": true,
  "San Antonio Spurs": true,
  "Toronto Raptors": true,
  "Utah Jazz": true,
  "Washington Wizards": true,
  
  // Soccer - EPL
  "Liverpool": true,
  "Arsenal": true,
  "Manchester City": true,
  "Manchester United": true,
  "Chelsea": true,
  "Tottenham": true,
  "Newcastle United": true,
  "Aston Villa": true,
  "Brighton": true,
  "West Ham": true,
  "Everton": true,
  "Nottingham Forest": true,
  "Fulham": true,
  "Brentford": true,
  "Crystal Palace": true,
  "Bournemouth": true,
  "Wolves": true,
  "Leicester City": true,
  "Ipswich Town": true,
  "Southampton": true,
  
  // Soccer - La Liga
  "Real Madrid": true,
  "Barcelona": true,
  "Atlético Madrid": true,
  "Athletic Bilbao": true,
  "Real Sociedad": true,
  "Villarreal": true,
  "Real Betis": true,
  "Sevilla": true,
  "Valencia": true,
  "Girona": true,
  
  // Soccer - MLS
  "Inter Miami": true,
  "LA Galaxy": true,
  "LAFC": true,
  "Atlanta United": true,
  "Seattle Sounders": true,
  "Columbus Crew": true,
};

// League mappings
export const LEAGUE_IDS = {
  "NFL": true,
  "NBA": true,
  "MLB": true,
  "NHL": true,
  "EPL": true,
  "La Liga": true,
  "Bundesliga": true,
  "Serie A": true,
  "Ligue 1": true,
  "MLS": true,
  "Champions League": true,
};

/**
 * Call the ESPN API
 */
async function callApi(type, params) {
  const cacheKey = `${type}:${JSON.stringify(params)}`;
  
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`📦 Cache hit: ${cacheKey}`);
    return cached;
  }

  try {
    console.log(`🏈 API call #${++apiCallsThisSession}: ${type}`, params);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...params }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error:", response.status, errorText);
      return null;
    }

    const result = await response.json();
    
    if (!result.success) {
      console.error("❌ API returned error:", result.error);
      return null;
    }

    console.log(`✅ API response:`, result.data);
    setCache(cacheKey, result.data);
    
    return result.data;
  } catch (error) {
    console.error("❌ API fetch error:", error);
    return null;
  }
}

/**
 * Get team's next fixture
 */
export async function getNextFixture(teamName) {
  if (!TEAM_IDS[teamName]) {
    console.log(`⚠️ Unknown team: ${teamName}`);
    return null; // Return null instead of mock - let UI handle it
  }

  const data = await callApi("team", { teamName });
  
  if (!data || !data.nextFixture) {
    console.log(`ℹ️ No upcoming games scheduled for ${teamName}`);
    return null; // Return null - no mock data
  }

  const fixture = data.nextFixture;
  return {
    id: fixture.id || Date.now(),
    name: fixture.name || `${fixture.home} vs ${fixture.away}`,
    date: fixture.date,
    venue: fixture.venue || "TBD",
    home: { name: fixture.home, logo: fixture.homeLogo },
    away: { name: fixture.away, logo: fixture.awayLogo },
    league: data.league || "League",
    broadcast: fixture.broadcast || "",
    status: fixture.status || "Scheduled",
  };
}

/**
 * Get team's recent results (last 5)
 */
export async function getTeamForm(teamName) {
  if (!TEAM_IDS[teamName]) {
    console.log(`⚠️ Unknown team: ${teamName}`);
    return []; // Return empty - let UI handle it
  }

  const data = await callApi("team", { teamName });
  
  if (!data || !data.form || data.form.length === 0) {
    console.log(`ℹ️ No recent results for ${teamName}`);
    return []; // Return empty - no mock data
  }

  return data.form.map((match, i) => ({
    id: match.id || i,
    date: match.date || new Date().toISOString(),
    home: match.home,
    homeLogo: match.homeLogo,
    away: match.away,
    awayLogo: match.awayLogo,
    homeGoals: match.homeGoals || 0,
    awayGoals: match.awayGoals || 0,
    result: match.result || "D",
    status: match.status || "Final",
  }));
}

/**
 * Get lineup for a fixture (mock - ESPN doesn't provide this)
 */
export async function getLineup(fixtureId) {
  return getMockLineup();
}

/**
 * Get head-to-head history
 */
export async function getH2H(team1Name, team2Name) {
  if (!TEAM_IDS[team1Name] || !TEAM_IDS[team2Name]) {
    console.log(`⚠️ Unknown team for H2H: ${team1Name} or ${team2Name}`);
    return { matches: [], stats: { wins: 0, draws: 0, losses: 0, total: 0 } };
  }

  const data = await callApi("h2h", { teamName: team1Name, team2Name });
  
  if (!data || !data.matches) {
    console.log(`ℹ️ No H2H data for ${team1Name} vs ${team2Name}`);
    return { matches: [], stats: { wins: 0, draws: 0, losses: 0, total: 0 } };
  }

  return data;
}

/**
 * Get team injuries
 */
export async function getInjuries(teamName) {
  if (!TEAM_IDS[teamName]) {
    console.log(`⚠️ Unknown team: ${teamName}`);
    return [];
  }

  const data = await callApi("injuries", { teamName });
  
  if (!data || !Array.isArray(data)) {
    console.log(`ℹ️ No injuries for ${teamName}`);
    return [];
  }

  return data.map((injury, i) => ({
    id: i,
    player: injury.player || "Unknown",
    position: injury.position || "",
    type: injury.status || "Out",
    reason: injury.injury || "Undisclosed",
    returnDate: injury.returnDate || null,
  }));
}

/**
 * Get team roster
 */
export async function getRoster(teamName) {
  if (!TEAM_IDS[teamName]) {
    console.log(`⚠️ Unknown team: ${teamName}`);
    return [];
  }

  const data = await callApi("roster", { teamName });
  
  if (!data || !Array.isArray(data)) {
    console.log(`ℹ️ No roster for ${teamName}`);
    return [];
  }

  return data;
}

/**
 * Get live scoreboard for a league
 */
export async function getScoreboard(league) {
  if (!LEAGUE_IDS[league]) {
    console.log(`⚠️ Unknown league: ${league}`);
    return [];
  }

  const data = await callApi("scoreboard", { league });
  
  if (!data || !Array.isArray(data) || data.error) {
    console.log(`ℹ️ No scoreboard data for ${league}`);
    return [];
  }

  return data;
}

/**
 * Get league standings
 */
export async function getStandings(league) {
  if (!LEAGUE_IDS[league]) {
    console.log(`⚠️ Unknown league: ${league}`);
    return []; // Return empty - let UI handle it
  }

  const data = await callApi("standings", { league });
  
  if (!data || data.length === 0 || data.error) {
    console.log(`ℹ️ Standings unavailable for ${league}`);
    return []; // Return empty - no mock data
  }

  return data.slice(0, 20).map(team => ({
    rank: team.rank,
    name: team.name,
    abbreviation: team.abbreviation || "",
    logo: team.logo || null,
    played: team.played || 0,
    won: team.won || 0,
    drawn: team.drawn || 0,
    lost: team.lost || 0,
    gf: team.gf || 0,
    ga: team.ga || 0,
    gd: team.gd || 0,
    points: team.points || 0,
    winPct: team.winPct || 0,
    streak: team.streak || 0,
    form: team.form || "",
    division: team.division || "",
  }));
}

// ==================== MOCK DATA ====================

function getMockNextFixture(teamName) {
  return {
    id: Math.floor(Math.random() * 100000),
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    venue: "TBD Stadium",
    home: { name: teamName, logo: null },
    away: { name: "Opponent", logo: null },
    league: "League",
  };
}

function getMockTeamForm(teamName) {
  const results = ["W", "W", "D", "W", "L"];
  return results.map((result, i) => ({
    id: i,
    date: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    home: i % 2 === 0 ? teamName : "Opponent",
    away: i % 2 === 0 ? "Opponent" : teamName,
    homeGoals: result === "W" ? 2 : result === "D" ? 1 : 0,
    awayGoals: result === "W" ? 0 : result === "D" ? 1 : 2,
    result,
  }));
}

function getMockLineup() {
  return [{
    team: "Home Team",
    formation: "4-3-3",
    startXI: [
      { name: "Goalkeeper", number: 1, pos: "G" },
      { name: "Defender 1", number: 2, pos: "D" },
      { name: "Defender 2", number: 4, pos: "D" },
      { name: "Defender 3", number: 5, pos: "D" },
      { name: "Defender 4", number: 3, pos: "D" },
      { name: "Midfielder 1", number: 6, pos: "M" },
      { name: "Midfielder 2", number: 8, pos: "M" },
      { name: "Midfielder 3", number: 10, pos: "M" },
      { name: "Forward 1", number: 7, pos: "F" },
      { name: "Forward 2", number: 9, pos: "F" },
      { name: "Forward 3", number: 11, pos: "F" },
    ],
    substitutes: [],
    coach: "Manager",
  }];
}

function getMockH2H(team1, team2) {
  return {
    matches: [
      { date: "2024-12-01", home: team1, away: team2, homeGoals: 2, awayGoals: 1 },
      { date: "2024-05-15", home: team2, away: team1, homeGoals: 1, awayGoals: 1 },
    ],
    stats: { wins: 1, draws: 1, losses: 0, total: 2 },
  };
}

function getMockStandings(league) {
  return [
    { rank: 1, name: "Team 1", points: 50, gd: 25, played: 20, won: 15, drawn: 5, lost: 0 },
    { rank: 2, name: "Team 2", points: 45, gd: 20, played: 20, won: 13, drawn: 6, lost: 1 },
    { rank: 3, name: "Team 3", points: 40, gd: 15, played: 20, won: 12, drawn: 4, lost: 4 },
  ].map(t => ({ ...t, logo: null, gf: 40 + t.gd, ga: 40, winPct: 0, form: "" }));
}
