/**
 * Sports Data API
 * Uses ESPN's public API (no auth required) for all sports
 * Falls back to Scrape.do + SofaScore for soccer if needed
 * 
 * ESPN Docs: https://github.com/pseudo-r/public-espn-api
 */

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";
const SCRAPE_DO_TOKEN = process.env.SCRAPE_DO_TOKEN;

// ESPN league codes
const ESPN_LEAGUES = {
  // American Sports
  "NFL": { sport: "football", league: "nfl" },
  "NBA": { sport: "basketball", league: "nba" },
  "MLB": { sport: "baseball", league: "mlb" },
  "NHL": { sport: "hockey", league: "nhl" },
  "NCAAF": { sport: "football", league: "college-football" },
  "NCAAB": { sport: "basketball", league: "mens-college-basketball" },
  
  // Soccer
  "EPL": { sport: "soccer", league: "eng.1" },
  "La Liga": { sport: "soccer", league: "esp.1" },
  "Bundesliga": { sport: "soccer", league: "ger.1" },
  "Serie A": { sport: "soccer", league: "ita.1" },
  "Ligue 1": { sport: "soccer", league: "fra.1" },
  "MLS": { sport: "soccer", league: "usa.1" },
  "Champions League": { sport: "soccer", league: "uefa.champions" },
};

// ESPN team IDs (for schedule lookups)
const ESPN_TEAM_IDS = {
  // NFL
  "Buffalo Bills": { league: "NFL", id: 2 },
  "Miami Dolphins": { league: "NFL", id: 15 },
  "New England Patriots": { league: "NFL", id: 17 },
  "New York Jets": { league: "NFL", id: 20 },
  "Baltimore Ravens": { league: "NFL", id: 33 },
  "Cincinnati Bengals": { league: "NFL", id: 4 },
  "Cleveland Browns": { league: "NFL", id: 5 },
  "Pittsburgh Steelers": { league: "NFL", id: 23 },
  "Houston Texans": { league: "NFL", id: 34 },
  "Indianapolis Colts": { league: "NFL", id: 11 },
  "Jacksonville Jaguars": { league: "NFL", id: 30 },
  "Tennessee Titans": { league: "NFL", id: 10 },
  "Denver Broncos": { league: "NFL", id: 7 },
  "Kansas City Chiefs": { league: "NFL", id: 12 },
  "Las Vegas Raiders": { league: "NFL", id: 13 },
  "Los Angeles Chargers": { league: "NFL", id: 24 },
  "Dallas Cowboys": { league: "NFL", id: 6 },
  "New York Giants": { league: "NFL", id: 19 },
  "Philadelphia Eagles": { league: "NFL", id: 21 },
  "Washington Commanders": { league: "NFL", id: 28 },
  "Chicago Bears": { league: "NFL", id: 3 },
  "Detroit Lions": { league: "NFL", id: 8 },
  "Green Bay Packers": { league: "NFL", id: 9 },
  "Minnesota Vikings": { league: "NFL", id: 16 },
  "Atlanta Falcons": { league: "NFL", id: 1 },
  "Carolina Panthers": { league: "NFL", id: 29 },
  "New Orleans Saints": { league: "NFL", id: 18 },
  "Tampa Bay Buccaneers": { league: "NFL", id: 27 },
  "Arizona Cardinals": { league: "NFL", id: 22 },
  "Los Angeles Rams": { league: "NFL", id: 14 },
  "San Francisco 49ers": { league: "NFL", id: 25 },
  "Seattle Seahawks": { league: "NFL", id: 26 },
  
  // NBA
  "Atlanta Hawks": { league: "NBA", id: 1 },
  "Boston Celtics": { league: "NBA", id: 2 },
  "Brooklyn Nets": { league: "NBA", id: 17 },
  "Charlotte Hornets": { league: "NBA", id: 30 },
  "Chicago Bulls": { league: "NBA", id: 4 },
  "Cleveland Cavaliers": { league: "NBA", id: 5 },
  "Dallas Mavericks": { league: "NBA", id: 6 },
  "Denver Nuggets": { league: "NBA", id: 7 },
  "Detroit Pistons": { league: "NBA", id: 8 },
  "Golden State Warriors": { league: "NBA", id: 9 },
  "Houston Rockets": { league: "NBA", id: 10 },
  "Indiana Pacers": { league: "NBA", id: 11 },
  "LA Clippers": { league: "NBA", id: 12 },
  "Los Angeles Lakers": { league: "NBA", id: 13 },
  "Memphis Grizzlies": { league: "NBA", id: 29 },
  "Miami Heat": { league: "NBA", id: 14 },
  "Milwaukee Bucks": { league: "NBA", id: 15 },
  "Minnesota Timberwolves": { league: "NBA", id: 16 },
  "New Orleans Pelicans": { league: "NBA", id: 3 },
  "New York Knicks": { league: "NBA", id: 18 },
  "Oklahoma City Thunder": { league: "NBA", id: 25 },
  "Orlando Magic": { league: "NBA", id: 19 },
  "Philadelphia 76ers": { league: "NBA", id: 20 },
  "Phoenix Suns": { league: "NBA", id: 21 },
  "Portland Trail Blazers": { league: "NBA", id: 22 },
  "Sacramento Kings": { league: "NBA", id: 23 },
  "San Antonio Spurs": { league: "NBA", id: 24 },
  "Toronto Raptors": { league: "NBA", id: 28 },
  "Utah Jazz": { league: "NBA", id: 26 },
  "Washington Wizards": { league: "NBA", id: 27 },
  
  // Soccer - EPL
  "Liverpool": { league: "EPL", id: 364 },
  "Arsenal": { league: "EPL", id: 359 },
  "Manchester City": { league: "EPL", id: 382 },
  "Manchester United": { league: "EPL", id: 360 },
  "Chelsea": { league: "EPL", id: 363 },
  "Tottenham": { league: "EPL", id: 367 },
  "Newcastle United": { league: "EPL", id: 361 },
  "Aston Villa": { league: "EPL", id: 362 },
  "Brighton": { league: "EPL", id: 331 },
  "West Ham": { league: "EPL", id: 371 },
  "Everton": { league: "EPL", id: 368 },
  "Nottingham Forest": { league: "EPL", id: 393 },
  "Fulham": { league: "EPL", id: 370 },
  "Brentford": { league: "EPL", id: 337 },
  "Crystal Palace": { league: "EPL", id: 384 },
  "Bournemouth": { league: "EPL", id: 349 },
  "Wolves": { league: "EPL", id: 380 },
  "Leicester City": { league: "EPL", id: 375 },
  "Ipswich Town": { league: "EPL", id: 373 },
  "Southampton": { league: "EPL", id: 376 },
  
  // Soccer - La Liga
  "Real Madrid": { league: "La Liga", id: 86 },
  "Barcelona": { league: "La Liga", id: 83 },
  "Atlético Madrid": { league: "La Liga", id: 1068 },
  "Athletic Bilbao": { league: "La Liga", id: 93 },
  "Real Sociedad": { league: "La Liga", id: 89 },
  "Villarreal": { league: "La Liga", id: 102 },
  "Real Betis": { league: "La Liga", id: 244 },
  "Sevilla": { league: "La Liga", id: 243 },
  "Valencia": { league: "La Liga", id: 94 },
  "Girona": { league: "La Liga", id: 9812 },
  
  // Soccer - MLS
  "Inter Miami": { league: "MLS", id: 10739 },
  "LA Galaxy": { league: "MLS", id: 96 },
  "LAFC": { league: "MLS", id: 6977 },
  "Atlanta United": { league: "MLS", id: 6461 },
  "Seattle Sounders": { league: "MLS", id: 242 },
  "Columbus Crew": { league: "MLS", id: 8036 },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, teamName, league } = req.body;

  try {
    let data;

    switch (type) {
      case "team":
        data = await getTeamData(teamName);
        break;
      case "form":
        data = await getTeamForm(teamName);
        break;
      case "fixtures":
        data = await getTeamFixtures(teamName);
        break;
      case "standings":
        data = await getStandings(league);
        break;
      case "scoreboard":
        data = await getScoreboard(league);
        break;
      default:
        return res.status(400).json({ error: "Invalid type" });
    }

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Fetch from ESPN API (no auth needed)
 */
async function fetchESPN(url) {
  console.log(`🏈 ESPN request: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`ESPN API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get team data (next match + recent form)
 */
async function getTeamData(teamName) {
  const teamInfo = ESPN_TEAM_IDS[teamName];
  if (!teamInfo) {
    return { error: `Unknown team: ${teamName}`, nextFixture: null, form: [] };
  }

  const leagueInfo = ESPN_LEAGUES[teamInfo.league];
  if (!leagueInfo) {
    return { error: `Unknown league: ${teamInfo.league}`, nextFixture: null, form: [] };
  }

  // Get team schedule
  const url = `${ESPN_BASE}/${leagueInfo.sport}/${leagueInfo.league}/teams/${teamInfo.id}/schedule`;
  const data = await fetchESPN(url);

  // Parse events
  const events = data.events || [];
  const now = new Date();

  // Find next fixture (first future event)
  let nextFixture = null;
  const futureEvents = events.filter(e => new Date(e.date) > now);
  if (futureEvents.length > 0) {
    const event = futureEvents[0];
    const competition = event.competitions?.[0];
    const homeTeam = competition?.competitors?.find(c => c.homeAway === "home");
    const awayTeam = competition?.competitors?.find(c => c.homeAway === "away");
    
    nextFixture = {
      id: event.id,
      home: homeTeam?.team?.displayName || "Home",
      away: awayTeam?.team?.displayName || "Away",
      date: event.date,
      venue: competition?.venue?.fullName || "TBD",
      broadcast: event.competitions?.[0]?.broadcasts?.[0]?.names?.[0] || "",
    };
  }

  // Get recent results (past events with scores)
  const pastEvents = events.filter(e => new Date(e.date) < now && e.competitions?.[0]?.status?.type?.completed);
  const form = pastEvents.slice(0, 5).map(event => {
    const competition = event.competitions?.[0];
    const homeTeam = competition?.competitors?.find(c => c.homeAway === "home");
    const awayTeam = competition?.competitors?.find(c => c.homeAway === "away");
    const homeScore = parseInt(homeTeam?.score) || 0;
    const awayScore = parseInt(awayTeam?.score) || 0;
    
    // Determine result for the selected team
    const isHome = homeTeam?.team?.displayName === teamName;
    let result;
    if (homeScore === awayScore) result = "D";
    else if (isHome) result = homeScore > awayScore ? "W" : "L";
    else result = awayScore > homeScore ? "W" : "L";

    return {
      id: event.id,
      home: homeTeam?.team?.displayName || "Home",
      away: awayTeam?.team?.displayName || "Away",
      homeGoals: homeScore,
      awayGoals: awayScore,
      date: event.date,
      result,
    };
  });

  return { nextFixture, form, league: teamInfo.league };
}

/**
 * Get team's recent results
 */
async function getTeamForm(teamName) {
  const data = await getTeamData(teamName);
  return data.form || [];
}

/**
 * Get team's upcoming fixtures
 */
async function getTeamFixtures(teamName) {
  const teamInfo = ESPN_TEAM_IDS[teamName];
  if (!teamInfo) return [];

  const leagueInfo = ESPN_LEAGUES[teamInfo.league];
  if (!leagueInfo) return [];

  const url = `${ESPN_BASE}/${leagueInfo.sport}/${leagueInfo.league}/teams/${teamInfo.id}/schedule`;
  const data = await fetchESPN(url);

  const events = data.events || [];
  const now = new Date();

  return events
    .filter(e => new Date(e.date) > now)
    .slice(0, 5)
    .map(event => {
      const competition = event.competitions?.[0];
      const homeTeam = competition?.competitors?.find(c => c.homeAway === "home");
      const awayTeam = competition?.competitors?.find(c => c.homeAway === "away");
      
      return {
        id: event.id,
        home: homeTeam?.team?.displayName || "Home",
        away: awayTeam?.team?.displayName || "Away",
        date: event.date,
        venue: competition?.venue?.fullName || "TBD",
      };
    });
}

/**
 * Get league standings
 */
async function getStandings(league) {
  const leagueInfo = ESPN_LEAGUES[league];
  if (!leagueInfo) {
    return { error: `Unknown league: ${league}` };
  }

  const url = `${ESPN_BASE}/${leagueInfo.sport}/${leagueInfo.league}/standings`;
  const data = await fetchESPN(url);

  // Parse standings
  const standings = [];
  const groups = data.children || [];
  
  for (const group of groups) {
    const entries = group.standings?.entries || [];
    for (const entry of entries) {
      const team = entry.team;
      const stats = entry.stats || [];
      
      const getStat = (name) => stats.find(s => s.name === name)?.value || 0;
      
      standings.push({
        rank: getStat("rank") || getStat("playoffSeed") || standings.length + 1,
        name: team?.displayName || "Unknown",
        logo: team?.logos?.[0]?.href || null,
        played: getStat("gamesPlayed") || getStat("games"),
        won: getStat("wins"),
        drawn: getStat("ties") || getStat("draws") || 0,
        lost: getStat("losses"),
        gf: getStat("pointsFor") || getStat("goalsFor") || 0,
        ga: getStat("pointsAgainst") || getStat("goalsAgainst") || 0,
        gd: getStat("pointDifferential") || getStat("goalDifference") || 0,
        points: getStat("points") || 0,
        winPct: getStat("winPercent") || 0,
        streak: getStat("streak") || "",
      });
    }
  }

  // Sort by rank or points
  standings.sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    return (b.points || b.winPct || 0) - (a.points || a.winPct || 0);
  });

  return standings.slice(0, 20);
}

/**
 * Get live/today's scoreboard
 */
async function getScoreboard(league) {
  const leagueInfo = ESPN_LEAGUES[league];
  if (!leagueInfo) {
    return { error: `Unknown league: ${league}` };
  }

  const url = `${ESPN_BASE}/${leagueInfo.sport}/${leagueInfo.league}/scoreboard`;
  const data = await fetchESPN(url);

  const events = data.events || [];
  
  return events.map(event => {
    const competition = event.competitions?.[0];
    const homeTeam = competition?.competitors?.find(c => c.homeAway === "home");
    const awayTeam = competition?.competitors?.find(c => c.homeAway === "away");
    
    return {
      id: event.id,
      name: event.name,
      date: event.date,
      status: competition?.status?.type?.description || "Scheduled",
      home: {
        name: homeTeam?.team?.displayName || "Home",
        logo: homeTeam?.team?.logo || null,
        score: homeTeam?.score || "0",
      },
      away: {
        name: awayTeam?.team?.displayName || "Away",
        logo: awayTeam?.team?.logo || null,
        score: awayTeam?.score || "0",
      },
      venue: competition?.venue?.fullName || "TBD",
      broadcast: competition?.broadcasts?.[0]?.names?.[0] || "",
    };
  });
}
