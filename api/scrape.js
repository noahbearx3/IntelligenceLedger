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
    console.log("🚀 Launching browser...");
    
    browser = await playwright.chromium.launch({
      args: [...chromium.args, "--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    console.log("✅ Browser launched");

    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      locale: "en-GB",
      timezoneId: "Europe/London",
    });
    
    // Accept cookies by default
    await context.addCookies([{
      name: "euconsent-v2-done",
      value: "1",
      domain: ".flashscore.com",
      path: "/",
    }]);

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
 * Using selectors from working Flashscore scraper
 */
async function scrapeTeamData(context, teamName) {
  const slug = TEAM_SLUGS[teamName];
  if (!slug) throw new Error(`Unknown team: ${teamName}`);

  const page = await context.newPage();
  
  // Go to team's fixtures page
  const url = `${BASE_URL}/team/${slug}/fixtures/`;
  console.log(`📍 Navigating to: ${url}`);
  
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000); // Wait for dynamic content

  // Debug: Get page content
  const pageContent = await page.content();
  console.log(`📄 Page length: ${pageContent.length} chars`);

  const data = await page.evaluate(() => {
    // Use the working selectors from the Flashscore scraper
    const MATCH_SELECTOR = ".event__match";
    
    // Get all matches on the page
    const allMatches = Array.from(document.querySelectorAll(MATCH_SELECTOR));
    console.log(`Found ${allMatches.length} matches on page`);
    
    // Find next fixture (scheduled match)
    let nextFixture = null;
    const scheduledMatch = allMatches.find(m => !m.querySelector(".event__score--home"));
    
    if (scheduledMatch) {
      const homeEl = scheduledMatch.querySelector("[class*='homeParticipant']") || 
                     scheduledMatch.querySelector(".event__participant--home");
      const awayEl = scheduledMatch.querySelector("[class*='awayParticipant']") ||
                     scheduledMatch.querySelector(".event__participant--away");
      const timeEl = scheduledMatch.querySelector("[class*='time']") ||
                     scheduledMatch.querySelector(".event__time");
      
      nextFixture = {
        home: homeEl?.innerText?.trim() || "Home",
        away: awayEl?.innerText?.trim() || "Away", 
        time: timeEl?.innerText?.trim() || "TBD",
      };
    }

    // Get recent results (matches with scores)
    const completedMatches = allMatches.filter(m => m.querySelector(".event__score--home"));
    const form = completedMatches.slice(0, 5).map(match => {
      const homeEl = match.querySelector("[class*='homeParticipant']") ||
                     match.querySelector(".event__participant--home");
      const awayEl = match.querySelector("[class*='awayParticipant']") ||
                     match.querySelector(".event__participant--away");
      const homeScoreEl = match.querySelector(".event__score--home");
      const awayScoreEl = match.querySelector(".event__score--away");
      const timeEl = match.querySelector("[class*='time']") ||
                     match.querySelector(".event__time");
      
      return {
        home: homeEl?.innerText?.trim() || "Home",
        away: awayEl?.innerText?.trim() || "Away",
        homeGoals: parseInt(homeScoreEl?.innerText) || 0,
        awayGoals: parseInt(awayScoreEl?.innerText) || 0,
        date: timeEl?.innerText?.trim() || "",
      };
    });

    return { 
      nextFixture, 
      form,
      debug: {
        totalMatches: allMatches.length,
        scheduled: scheduledMatch ? true : false,
        completed: completedMatches.length,
      }
    };
  });

  console.log(`📊 Scraped data:`, JSON.stringify(data));
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
  const url = `${BASE_URL}/team/${slug}/fixtures/`;
  console.log(`📍 Fixtures URL: ${url}`);
  
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  // Try to dismiss cookie banner if present
  try {
    const acceptBtn = await page.$('[id*="accept"], [class*="accept"], button:has-text("Accept")');
    if (acceptBtn) await acceptBtn.click();
  } catch (e) {
    console.log("No cookie banner to dismiss");
  }

  const fixtures = await page.evaluate(() => {
    const matches = Array.from(document.querySelectorAll(".event__match"));
    console.log(`Found ${matches.length} fixture elements`);
    
    return matches.slice(0, 5).map(match => {
      const homeEl = match.querySelector("[class*='home']");
      const awayEl = match.querySelector("[class*='away']");
      const timeEl = match.querySelector("[class*='time']");
      
      return { 
        home: homeEl?.innerText?.trim() || "TBD", 
        away: awayEl?.innerText?.trim() || "TBD", 
        time: timeEl?.innerText?.trim() || "TBD",
      };
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
  const url = `${BASE_URL}/team/${slug}/results/`;
  console.log(`📍 Results URL: ${url}`);
  
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  // Debug: screenshot
  const pageTitle = await page.title();
  console.log(`📄 Page title: ${pageTitle}`);

  const results = await page.evaluate((teamSlug) => {
    // Try multiple selectors
    let matches = Array.from(document.querySelectorAll(".event__match--static"));
    if (matches.length === 0) {
      matches = Array.from(document.querySelectorAll(".event__match"));
    }
    if (matches.length === 0) {
      matches = Array.from(document.querySelectorAll("[class*='event'][class*='match']"));
    }
    
    console.log(`Found ${matches.length} result matches`);
    
    // Filter to only completed matches (have scores)
    const completedMatches = matches.filter(m => {
      const scoreEl = m.querySelector("[class*='score']");
      return scoreEl && scoreEl.innerText.trim() !== "";
    });
    
    console.log(`Found ${completedMatches.length} completed matches`);

    return completedMatches.slice(0, 5).map(match => {
      // Try various selector patterns
      const homeTeam = (
        match.querySelector(".event__participant--home")?.innerText ||
        match.querySelector("[class*='homeParticipant']")?.innerText ||
        match.querySelector("[class*='home'][class*='participant']")?.innerText ||
        "Home"
      ).trim();
      
      const awayTeam = (
        match.querySelector(".event__participant--away")?.innerText ||
        match.querySelector("[class*='awayParticipant']")?.innerText ||
        match.querySelector("[class*='away'][class*='participant']")?.innerText ||
        "Away"
      ).trim();
      
      const homeScore = parseInt(
        match.querySelector(".event__score--home")?.innerText ||
        match.querySelector("[class*='score'][class*='home']")?.innerText ||
        "0"
      ) || 0;
      
      const awayScore = parseInt(
        match.querySelector(".event__score--away")?.innerText ||
        match.querySelector("[class*='score'][class*='away']")?.innerText ||
        "0"
      ) || 0;
      
      const date = (
        match.querySelector(".event__time")?.innerText ||
        match.querySelector("[class*='time']")?.innerText ||
        ""
      ).trim();
      
      // Determine result for the team
      const teamNameLower = teamSlug.replace(/-/g, " ").toLowerCase();
      const isHome = homeTeam.toLowerCase().includes(teamNameLower);
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
