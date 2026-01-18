/**
 * SofaScore Scraper API via Scrape.do
 * Uses Scrape.do proxy service to bypass anti-bot measures
 * 
 * Endpoints:
 * POST /api/scrape { type: "team", teamName: "Liverpool" }
 * POST /api/scrape { type: "standings", league: "EPL" }
 */

const SCRAPE_DO_TOKEN = process.env.SCRAPE_DO_TOKEN || "1f427d229fda4c3ca2ef7f12a9d3fc3c8cee402a215";

// SofaScore team IDs
const SOFASCORE_TEAM_IDS = {
  // Premier League
  "Liverpool": 44,
  "Arsenal": 42,
  "Manchester City": 17,
  "Manchester United": 35,
  "Chelsea": 38,
  "Tottenham": 33,
  "Newcastle United": 39,
  "Aston Villa": 40,
  "Brighton": 30,
  "West Ham": 37,
  "Everton": 48,
  "Nottingham Forest": 14,
  "Fulham": 43,
  "Brentford": 50,
  "Crystal Palace": 7,
  "Bournemouth": 60,
  "Wolves": 3,
  "Leicester City": 31,
  "Ipswich Town": 32,
  "Southampton": 45,
  
  // La Liga
  "Real Madrid": 2829,
  "Barcelona": 2817,
  "Atlético Madrid": 2836,
  "Athletic Bilbao": 2825,
  "Real Sociedad": 2824,
  "Villarreal": 2819,
  "Real Betis": 2816,
  "Sevilla": 2833,
  "Valencia": 2828,
  "Girona": 24264,
  
  // MLS
  "Inter Miami": 341422,
  "LA Galaxy": 7450,
  "LAFC": 291604,
  "Atlanta United": 216118,
  "Seattle Sounders": 7451,
  "Columbus Crew": 7446,
};

// SofaScore tournament IDs
const SOFASCORE_TOURNAMENT_IDS = {
  "EPL": 17,
  "La Liga": 8,
  "Bundesliga": 35,
  "Serie A": 23,
  "Ligue 1": 34,
  "MLS": 242,
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
        data = await scrapeTeamData(teamName);
        break;
      case "form":
        data = await scrapeTeamForm(teamName);
        break;
      case "fixtures":
        data = await scrapeTeamFixtures(teamName);
        break;
      case "standings":
        data = await scrapeStandings(league);
        break;
      default:
        return res.status(400).json({ error: "Invalid type" });
    }

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("❌ Scraper error:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Fetch via Scrape.do proxy
 */
async function fetchViaScrapeD(url) {
  const encodedUrl = encodeURIComponent(url);
  const scrapeUrl = `https://api.scrape.do/?token=${SCRAPE_DO_TOKEN}&url=${encodedUrl}`;
  
  console.log(`🔍 Scrape.do request: ${url}`);
  
  const response = await fetch(scrapeUrl, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Scrape.do error: ${response.status}`);
  }

  const text = await response.text();
  
  // Try to parse as JSON
  try {
    return JSON.parse(text);
  } catch {
    // If not JSON, return the text
    return { html: text };
  }
}

/**
 * Get team data (next match + recent form)
 */
async function scrapeTeamData(teamName) {
  const teamId = SOFASCORE_TEAM_IDS[teamName];
  if (!teamId) throw new Error(`Unknown team: ${teamName}`);

  // SofaScore API endpoints
  const nextMatchUrl = `https://api.sofascore.com/api/v1/team/${teamId}/events/next/0`;
  const lastMatchesUrl = `https://api.sofascore.com/api/v1/team/${teamId}/events/last/0`;

  const [nextData, lastData] = await Promise.all([
    fetchViaScrapeD(nextMatchUrl),
    fetchViaScrapeD(lastMatchesUrl),
  ]);

  // Parse next fixture
  let nextFixture = null;
  if (nextData.events && nextData.events.length > 0) {
    const event = nextData.events[0];
    nextFixture = {
      id: event.id,
      home: event.homeTeam?.name || "Home",
      away: event.awayTeam?.name || "Away",
      date: event.startTimestamp ? new Date(event.startTimestamp * 1000).toISOString() : null,
      tournament: event.tournament?.name || "League",
      venue: event.venue?.stadium?.name || "TBD",
    };
  }

  // Parse recent form
  const form = [];
  if (lastData.events) {
    for (const event of lastData.events.slice(0, 5)) {
      const isHome = event.homeTeam?.id === teamId;
      const homeScore = event.homeScore?.current ?? 0;
      const awayScore = event.awayScore?.current ?? 0;
      
      let result;
      if (homeScore === awayScore) result = "D";
      else if (isHome) result = homeScore > awayScore ? "W" : "L";
      else result = awayScore > homeScore ? "W" : "L";

      form.push({
        id: event.id,
        home: event.homeTeam?.name || "Home",
        away: event.awayTeam?.name || "Away",
        homeGoals: homeScore,
        awayGoals: awayScore,
        date: event.startTimestamp ? new Date(event.startTimestamp * 1000).toISOString() : null,
        result,
      });
    }
  }

  return { nextFixture, form };
}

/**
 * Get team's recent results
 */
async function scrapeTeamForm(teamName) {
  const teamId = SOFASCORE_TEAM_IDS[teamName];
  if (!teamId) throw new Error(`Unknown team: ${teamName}`);

  const url = `https://api.sofascore.com/api/v1/team/${teamId}/events/last/0`;
  const data = await fetchViaScrapeD(url);

  if (!data.events) return [];

  return data.events.slice(0, 5).map(event => {
    const isHome = event.homeTeam?.id === teamId;
    const homeScore = event.homeScore?.current ?? 0;
    const awayScore = event.awayScore?.current ?? 0;
    
    let result;
    if (homeScore === awayScore) result = "D";
    else if (isHome) result = homeScore > awayScore ? "W" : "L";
    else result = awayScore > homeScore ? "W" : "L";

    return {
      id: event.id,
      home: event.homeTeam?.name || "Home",
      away: event.awayTeam?.name || "Away",
      homeGoals: homeScore,
      awayGoals: awayScore,
      date: event.startTimestamp ? new Date(event.startTimestamp * 1000).toISOString() : null,
      result,
    };
  });
}

/**
 * Get team's upcoming fixtures
 */
async function scrapeTeamFixtures(teamName) {
  const teamId = SOFASCORE_TEAM_IDS[teamName];
  if (!teamId) throw new Error(`Unknown team: ${teamName}`);

  const url = `https://api.sofascore.com/api/v1/team/${teamId}/events/next/0`;
  const data = await fetchViaScrapeD(url);

  if (!data.events) return [];

  return data.events.slice(0, 5).map(event => ({
    id: event.id,
    home: event.homeTeam?.name || "Home",
    away: event.awayTeam?.name || "Away",
    date: event.startTimestamp ? new Date(event.startTimestamp * 1000).toISOString() : null,
    tournament: event.tournament?.name || "League",
  }));
}

/**
 * Get league standings
 */
async function scrapeStandings(league) {
  const tournamentId = SOFASCORE_TOURNAMENT_IDS[league];
  if (!tournamentId) throw new Error(`Unknown league: ${league}`);

  // Get current season
  const seasonsUrl = `https://api.sofascore.com/api/v1/unique-tournament/${tournamentId}/seasons`;
  const seasonsData = await fetchViaScrapeD(seasonsUrl);
  
  if (!seasonsData.seasons || seasonsData.seasons.length === 0) {
    throw new Error("No seasons found");
  }
  
  const currentSeason = seasonsData.seasons[0];
  
  // Get standings
  const standingsUrl = `https://api.sofascore.com/api/v1/unique-tournament/${tournamentId}/season/${currentSeason.id}/standings/total`;
  const standingsData = await fetchViaScrapeD(standingsUrl);

  if (!standingsData.standings || standingsData.standings.length === 0) {
    return [];
  }

  const rows = standingsData.standings[0]?.rows || [];
  
  return rows.slice(0, 20).map(row => ({
    rank: row.position,
    name: row.team?.name || "Unknown",
    logo: row.team?.id ? `https://api.sofascore.app/api/v1/team/${row.team.id}/image` : null,
    played: row.matches || 0,
    won: row.wins || 0,
    drawn: row.draws || 0,
    lost: row.losses || 0,
    gf: row.scoresFor || 0,
    ga: row.scoresAgainst || 0,
    gd: (row.scoresFor || 0) - (row.scoresAgainst || 0),
    points: row.points || 0,
    form: row.form?.slice(-5) || "",
  }));
}
