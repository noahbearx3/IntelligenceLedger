/**
 * Flashscore Scraper API
 * Vercel Serverless Function using Playwright
 * 
 * Endpoints:
 * POST /api/scrape { type: "team", slug: "liverpool" }
 * POST /api/scrape { type: "fixtures", slug: "liverpool" }
 * POST /api/scrape { type: "standings", league: "england/premier-league" }
 */

import chromium from "@sparticuz/chromium";
import playwright from "playwright-core";

const BASE_URL = "https://www.flashscore.com";

// Team slug mappings for Flashscore URLs
const TEAM_SLUGS = {
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

const LEAGUE_PATHS = {
  "EPL": "england/premier-league",
  "La Liga": "spain/laliga",
  "Bundesliga": "germany/bundesliga",
  "Serie A": "italy/serie-a",
  "Ligue 1": "france/ligue-1",
  "MLS": "usa/mls",
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

  let browser = null;

  try {
    console.log(`🔍 Scraping: ${type} for ${teamName || league}`);

    // Launch browser with serverless-optimized Chromium
    browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    let data;

    switch (type) {
      case "team":
        data = await scrapeTeamData(context, teamName);
        break;
      case "fixtures":
        data = await scrapeFixtures(context, teamName);
        break;
      case "form":
        data = await scrapeForm(context, teamName);
        break;
      case "standings":
        data = await scrapeStandings(context, league);
        break;
      default:
        return res.status(400).json({ error: "Invalid type" });
    }

    await browser.close();

    console.log(`✅ Scraped successfully:`, data);
    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("❌ Scraper error:", error);
    if (browser) await browser.close();
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Scrape team overview (next fixture, form, injuries)
 */
async function scrapeTeamData(context, teamName) {
  const slug = TEAM_SLUGS[teamName];
  if (!slug) throw new Error(`Unknown team: ${teamName}`);

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/team/${slug}/`, { waitUntil: "domcontentloaded", timeout: 15000 });

  // Wait for content to load
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    // Get next fixture
    const nextMatch = document.querySelector(".event__match--scheduled");
    let nextFixture = null;
    
    if (nextMatch) {
      const homeTeam = nextMatch.querySelector(".event__homeParticipant")?.innerText.trim();
      const awayTeam = nextMatch.querySelector(".event__awayParticipant")?.innerText.trim();
      const time = nextMatch.querySelector(".event__time")?.innerText.trim();
      
      nextFixture = { home: homeTeam, away: awayTeam, time };
    }

    // Get recent form from results
    const results = Array.from(document.querySelectorAll(".event__match--static")).slice(0, 5);
    const form = results.map(match => {
      const homeTeam = match.querySelector(".event__homeParticipant")?.innerText.trim();
      const awayTeam = match.querySelector(".event__awayParticipant")?.innerText.trim();
      const homeScore = match.querySelector(".event__score--home")?.innerText.trim();
      const awayScore = match.querySelector(".event__score--away")?.innerText.trim();
      const date = match.querySelector(".event__time")?.innerText.trim();
      
      return {
        home: homeTeam,
        away: awayTeam,
        homeGoals: parseInt(homeScore) || 0,
        awayGoals: parseInt(awayScore) || 0,
        date,
      };
    });

    return { nextFixture, form };
  });

  await page.close();
  return data;
}

/**
 * Scrape upcoming fixtures
 */
async function scrapeFixtures(context, teamName) {
  const slug = TEAM_SLUGS[teamName];
  if (!slug) throw new Error(`Unknown team: ${teamName}`);

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/team/${slug}/fixtures/`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(2000);

  const fixtures = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".event__match")).slice(0, 5).map(match => {
      const homeTeam = match.querySelector(".event__homeParticipant")?.innerText.trim();
      const awayTeam = match.querySelector(".event__awayParticipant")?.innerText.trim();
      const time = match.querySelector(".event__time")?.innerText.trim();
      const competition = match.closest(".sportName")?.querySelector(".event__title--name")?.innerText.trim();
      
      return { home: homeTeam, away: awayTeam, time, competition };
    });
  });

  await page.close();
  return fixtures;
}

/**
 * Scrape recent results (form)
 */
async function scrapeForm(context, teamName) {
  const slug = TEAM_SLUGS[teamName];
  if (!slug) throw new Error(`Unknown team: ${teamName}`);

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/team/${slug}/results/`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(2000);

  const results = await page.evaluate((teamSlug) => {
    return Array.from(document.querySelectorAll(".event__match--static")).slice(0, 5).map(match => {
      const homeTeam = match.querySelector(".event__homeParticipant")?.innerText.trim();
      const awayTeam = match.querySelector(".event__awayParticipant")?.innerText.trim();
      const homeScore = parseInt(match.querySelector(".event__score--home")?.innerText.trim()) || 0;
      const awayScore = parseInt(match.querySelector(".event__score--away")?.innerText.trim()) || 0;
      const date = match.querySelector(".event__time")?.innerText.trim();
      
      // Determine result for the team
      const isHome = homeTeam?.toLowerCase().includes(teamSlug.replace("-", " "));
      let result;
      if (homeScore === awayScore) result = "D";
      else if (isHome) result = homeScore > awayScore ? "W" : "L";
      else result = awayScore > homeScore ? "W" : "L";
      
      return {
        home: homeTeam,
        away: awayTeam,
        homeGoals: homeScore,
        awayGoals: awayScore,
        date,
        result,
      };
    });
  }, slug);

  await page.close();
  return results;
}

/**
 * Scrape league standings
 */
async function scrapeStandings(context, league) {
  const leaguePath = LEAGUE_PATHS[league];
  if (!leaguePath) throw new Error(`Unknown league: ${league}`);

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/football/${leaguePath}/standings/`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(2000);

  const standings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".ui-table__row")).slice(0, 20).map(row => {
      const cells = row.querySelectorAll(".table__cell");
      const rank = row.querySelector(".tableCellRank")?.innerText.trim();
      const teamEl = row.querySelector(".tableCellParticipant__name");
      const name = teamEl?.innerText.trim();
      
      // Table columns: Rank, Team, P, W, D, L, Goals, +/-, Pts
      return {
        rank: parseInt(rank) || 0,
        name: name,
        played: parseInt(cells[2]?.innerText) || 0,
        won: parseInt(cells[3]?.innerText) || 0,
        drawn: parseInt(cells[4]?.innerText) || 0,
        lost: parseInt(cells[5]?.innerText) || 0,
        gf: parseInt(cells[6]?.innerText?.split(":")[0]) || 0,
        ga: parseInt(cells[6]?.innerText?.split(":")[1]) || 0,
        gd: parseInt(cells[7]?.innerText) || 0,
        points: parseInt(cells[8]?.innerText) || 0,
      };
    }).filter(t => t.name);
  });

  await page.close();
  return standings;
}
