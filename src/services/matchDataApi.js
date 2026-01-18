/**
 * Match Data API Service
 * Uses API-Football (RapidAPI) for lineups, H2H, fixtures, standings
 * Falls back to mock data when API is unavailable
 * 
 * API-Football Free Tier: 100 requests/day
 * Docs: https://www.api-football.com/documentation-v3
 */

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;
// API-Sports direct endpoint (not RapidAPI)
const BASE_URL = "https://v3.football.api-sports.io";

// Check if API is configured
export const hasApiKey = !!API_KEY;

// ==================== CACHING LAYER ====================
// Cache API responses for 10 minutes to minimize requests
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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

// Track API usage for debugging
let apiCallsThisSession = 0;
export function getApiCallCount() {
  return apiCallsThisSession;
}

// Team ID mappings for API-Football
export const TEAM_IDS = {
  // Premier League
  "Liverpool": 40,
  "Arsenal": 42,
  "Manchester City": 50,
  "Manchester United": 33,
  "Chelsea": 49,
  "Tottenham": 47,
  "Newcastle United": 34,
  "Aston Villa": 66,
  "Brighton": 51,
  "West Ham": 48,
  "Everton": 45,
  "Nottingham Forest": 65,
  "Fulham": 36,
  "Brentford": 55,
  "Crystal Palace": 52,
  "Bournemouth": 35,
  "Wolves": 39,
  "Leicester City": 46,
  "Ipswich Town": 57,
  "Southampton": 41,
  
  // La Liga
  "Real Madrid": 541,
  "Barcelona": 529,
  "Atlético Madrid": 530,
  "Athletic Bilbao": 531,
  "Real Sociedad": 548,
  "Villarreal": 533,
  "Real Betis": 543,
  "Sevilla": 536,
  "Valencia": 532,
  "Girona": 547,
  
  // MLS
  "Inter Miami": 9568,
  "LA Galaxy": 1600,
  "LAFC": 1599,
  "Atlanta United": 1596,
  "Seattle Sounders": 1595,
  "Columbus Crew": 1604,
};

// League IDs
export const LEAGUE_IDS = {
  "EPL": 39,
  "La Liga": 140,
  "Bundesliga": 78,
  "Serie A": 135,
  "Ligue 1": 61,
  "MLS": 253,
};

/**
 * Make API request with proper headers + caching
 */
async function apiRequest(endpoint) {
  if (!API_KEY) {
    console.warn("⚠️ VITE_FOOTBALL_API_KEY not configured, using mock data");
    console.warn("Key value:", API_KEY);
    return null;
  }

  // Check cache first
  const cached = getCached(endpoint);
  if (cached) {
    console.log(`📦 Cache hit: ${endpoint}`);
    return cached;
  }

  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`🌐 API call #${++apiCallsThisSession}: ${url}`);
    console.log(`🔑 Using key: ${API_KEY.substring(0, 8)}...`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": API_KEY,
      },
    });

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API-Football error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log(`✅ API response:`, data);
    
    // Check for API errors in response
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error("❌ API returned errors:", data.errors);
      return null;
    }
    
    // Cache the response
    setCache(endpoint, data.response);
    
    return data.response;
  } catch (error) {
    console.error("❌ API-Football fetch error:", error);
    return null;
  }
}

/**
 * Get team's next fixture
 */
export async function getNextFixture(teamName) {
  const teamId = TEAM_IDS[teamName];
  if (!teamId) return getMockNextFixture(teamName);

  const data = await apiRequest(`/fixtures?team=${teamId}&next=1`);
  if (!data || data.length === 0) return getMockNextFixture(teamName);

  const fixture = data[0];
  return {
    id: fixture.fixture.id,
    date: fixture.fixture.date,
    venue: fixture.fixture.venue?.name,
    home: {
      name: fixture.teams.home.name,
      logo: fixture.teams.home.logo,
    },
    away: {
      name: fixture.teams.away.name,
      logo: fixture.teams.away.logo,
    },
    league: fixture.league.name,
    round: fixture.league.round,
  };
}

/**
 * Get team's recent results (last 5)
 */
export async function getTeamForm(teamName) {
  const teamId = TEAM_IDS[teamName];
  if (!teamId) return getMockTeamForm(teamName);

  const data = await apiRequest(`/fixtures?team=${teamId}&last=5`);
  if (!data || data.length === 0) return getMockTeamForm(teamName);

  return data.map(fixture => ({
    id: fixture.fixture.id,
    date: fixture.fixture.date,
    home: fixture.teams.home.name,
    away: fixture.teams.away.name,
    homeGoals: fixture.goals.home,
    awayGoals: fixture.goals.away,
    result: getResultForTeam(teamName, fixture),
  }));
}

/**
 * Get lineup for a fixture
 */
export async function getLineup(fixtureId) {
  if (!fixtureId) return getMockLineup();

  const data = await apiRequest(`/fixtures/lineups?fixture=${fixtureId}`);
  if (!data || data.length === 0) return getMockLineup();

  return data.map(team => ({
    team: team.team.name,
    logo: team.team.logo,
    formation: team.formation,
    startXI: team.startXI.map(p => ({
      name: p.player.name,
      number: p.player.number,
      pos: p.player.pos,
    })),
    substitutes: team.substitutes.slice(0, 7).map(p => ({
      name: p.player.name,
      number: p.player.number,
      pos: p.player.pos,
    })),
    coach: team.coach?.name,
  }));
}

/**
 * Get head-to-head history
 */
export async function getH2H(team1Name, team2Name) {
  const team1Id = TEAM_IDS[team1Name];
  const team2Id = TEAM_IDS[team2Name];
  
  if (!team1Id || !team2Id) return getMockH2H(team1Name, team2Name);

  const data = await apiRequest(`/fixtures/headtohead?h2h=${team1Id}-${team2Id}&last=5`);
  if (!data || data.length === 0) return getMockH2H(team1Name, team2Name);

  return {
    matches: data.map(fixture => ({
      date: fixture.fixture.date,
      home: fixture.teams.home.name,
      away: fixture.teams.away.name,
      homeGoals: fixture.goals.home,
      awayGoals: fixture.goals.away,
    })),
    stats: calculateH2HStats(data, team1Name),
  };
}

/**
 * Get team injuries
 */
export async function getInjuries(teamName) {
  const teamId = TEAM_IDS[teamName];
  if (!teamId) return getMockInjuries(teamName);

  const data = await apiRequest(`/injuries?team=${teamId}&season=2024`);
  if (!data || data.length === 0) return getMockInjuries(teamName);

  return data.slice(0, 8).map(injury => ({
    player: injury.player.name,
    photo: injury.player.photo,
    type: injury.player.type,
    reason: injury.player.reason,
  }));
}

/**
 * Get league standings
 */
export async function getStandings(league) {
  const leagueId = LEAGUE_IDS[league];
  if (!leagueId) return getMockStandings(league);

  const data = await apiRequest(`/standings?league=${leagueId}&season=2024`);
  if (!data || data.length === 0) return getMockStandings(league);

  const standings = data[0]?.league?.standings?.[0];
  if (!standings) return getMockStandings(league);

  return standings.slice(0, 10).map(team => ({
    rank: team.rank,
    name: team.team.name,
    logo: team.team.logo,
    played: team.all.played,
    won: team.all.win,
    drawn: team.all.draw,
    lost: team.all.lose,
    gf: team.all.goals.for,
    ga: team.all.goals.against,
    gd: team.goalsDiff,
    points: team.points,
    form: team.form,
  }));
}

// Helper functions
function getResultForTeam(teamName, fixture) {
  const isHome = fixture.teams.home.name === teamName;
  const teamGoals = isHome ? fixture.goals.home : fixture.goals.away;
  const oppGoals = isHome ? fixture.goals.away : fixture.goals.home;
  
  if (teamGoals > oppGoals) return "W";
  if (teamGoals < oppGoals) return "L";
  return "D";
}

function calculateH2HStats(matches, teamName) {
  let wins = 0, draws = 0, losses = 0;
  
  matches.forEach(m => {
    const result = getResultForTeam(teamName, m);
    if (result === "W") wins++;
    else if (result === "D") draws++;
    else losses++;
  });
  
  return { wins, draws, losses, total: matches.length };
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

function getMockInjuries(teamName) {
  const injuries = [
    { player: "Key Player 1", type: "Missing Fixture", reason: "Hamstring" },
    { player: "Key Player 2", type: "Doubtful", reason: "Knock" },
    { player: "Key Player 3", type: "Missing Fixture", reason: "Red Card Suspension" },
  ];
  return injuries;
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
