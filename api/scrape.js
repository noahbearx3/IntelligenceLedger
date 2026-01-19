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

  // Helper to extract score (handles both string and object formats)
  const getScore = (competitor) => {
    if (!competitor?.score) return 0;
    // ESPN returns score as object: { value: 109, displayValue: "109" }
    if (typeof competitor.score === 'object') {
      return parseInt(competitor.score.displayValue || competitor.score.value) || 0;
    }
    return parseInt(competitor.score) || 0;
  };

  // Helper to get team display name
  const getTeamName = (competitor) => {
    if (!competitor?.team) return "Unknown";
    if (typeof competitor.team === 'object') {
      return competitor.team.displayName || competitor.team.name || "Unknown";
    }
    return String(competitor.team);
  };

  // Helper to get team logo
  const getTeamLogo = (competitor) => {
    if (!competitor?.team?.logos) return null;
    const logos = competitor.team.logos;
    if (Array.isArray(logos) && logos.length > 0) {
      return logos[0]?.href || null;
    }
    return null;
  };

  // Find next fixture (first future event that's not completed)
  let nextFixture = null;
  const futureEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    const isCompleted = e.competitions?.[0]?.status?.type?.completed;
    return eventDate > now || !isCompleted;
  });
  
  if (futureEvents.length > 0) {
    const event = futureEvents[0];
    const competition = event.competitions?.[0];
    const homeTeam = competition?.competitors?.find(c => c.homeAway === "home");
    const awayTeam = competition?.competitors?.find(c => c.homeAway === "away");
    const broadcast = competition?.broadcasts?.[0];
    
    nextFixture = {
      id: event.id,
      name: event.name || event.shortName,
      home: getTeamName(homeTeam),
      homeLogo: getTeamLogo(homeTeam),
      away: getTeamName(awayTeam),
      awayLogo: getTeamLogo(awayTeam),
      date: event.date,
      venue: competition?.venue?.fullName || "TBD",
      broadcast: broadcast?.media?.shortName || "",
      status: competition?.status?.type?.description || "Scheduled",
    };
  }

  // Get recent results (completed events)
  const pastEvents = events.filter(e => e.competitions?.[0]?.status?.type?.completed === true);
  
  // Sort by date descending to get most recent first
  pastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const form = pastEvents.slice(0, 5).map(event => {
    const competition = event.competitions?.[0];
    const homeTeam = competition?.competitors?.find(c => c.homeAway === "home");
    const awayTeam = competition?.competitors?.find(c => c.homeAway === "away");
    const homeScore = getScore(homeTeam);
    const awayScore = getScore(awayTeam);
    const homeName = getTeamName(homeTeam);
    const awayName = getTeamName(awayTeam);
    
    // Determine result for the selected team
    // Check if selected team is home or away
    const isHome = homeName === teamName || homeTeam?.team?.id === String(teamInfo.id);
    const teamScore = isHome ? homeScore : awayScore;
    const oppScore = isHome ? awayScore : homeScore;
    
    let result;
    if (teamScore === oppScore) result = "D";
    else if (teamScore > oppScore) result = "W";
    else result = "L";

    return {
      id: event.id,
      home: homeName,
      homeLogo: getTeamLogo(homeTeam),
      away: awayName,
      awayLogo: getTeamLogo(awayTeam),
      homeGoals: homeScore,
      awayGoals: awayScore,
      date: event.date,
      result,
      status: competition?.status?.type?.shortDetail || "Final",
    };
  });

  return { nextFixture, form, league: teamInfo.league, teamId: teamInfo.id };
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

  // Use the v2 API endpoint which has full standings data
  const url = `https://site.api.espn.com/apis/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/standings`;
  const data = await fetchESPN(url);

  // Parse standings from nested structure
  const standings = [];
  const groups = data.children || [];
  
  for (const group of groups) {
    // Get entries from the standings object within each group
    const entries = group.standings?.entries || [];
    
    for (const entry of entries) {
      const team = entry.team;
      const stats = entry.stats || [];
      
      // Helper to find stat by name or abbreviation
      const getStat = (names) => {
        if (!Array.isArray(names)) names = [names];
        for (const name of names) {
          const stat = stats.find(s => 
            s.name === name || 
            s.abbreviation === name ||
            s.displayName?.toLowerCase() === name.toLowerCase()
          );
          if (stat?.value !== undefined) return stat.value;
        }
        return 0;
      };
      
      standings.push({
        rank: getStat(["rank", "playoffSeed", "clincher"]) || standings.length + 1,
        name: team?.displayName || "Unknown",
        abbreviation: team?.abbreviation || "",
        logo: team?.logos?.[0]?.href || null,
        played: getStat(["gamesPlayed", "GP", "games"]),
        won: getStat(["wins", "W"]),
        drawn: getStat(["ties", "T", "draws", "D"]),
        lost: getStat(["losses", "L"]),
        gf: getStat(["pointsFor", "PF", "goalsFor", "GF"]),
        ga: getStat(["pointsAgainst", "PA", "goalsAgainst", "GA"]),
        gd: getStat(["pointDifferential", "DIFF", "goalDifference", "GD"]),
        points: getStat(["points", "PTS"]),
        winPct: getStat(["winPercent", "PCT", "leagueWinPercent"]),
        streak: getStat(["streak", "STRK"]),
        division: group.name || "",
      });
    }
  }

  // Sort by win percentage (for US sports) or points (for soccer)
  standings.sort((a, b) => {
    // For soccer, sort by points
    if (a.points > 0 || b.points > 0) {
      return b.points - a.points;
    }
    // For US sports, sort by win percentage
    return b.winPct - a.winPct;
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
