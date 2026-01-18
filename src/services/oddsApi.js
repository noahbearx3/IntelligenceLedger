const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY;
const BASE_URL = "https://api.the-odds-api.com/v4";

// Supported sports
export const SPORTS = [
  // American Sports
  { key: "americanfootball_nfl", name: "NFL" },
  { key: "americanfootball_ncaaf", name: "NCAAF" },
  { key: "basketball_nba", name: "NBA" },
  { key: "basketball_ncaab", name: "NCAAB" },
  { key: "icehockey_nhl", name: "NHL" },
  { key: "baseball_mlb", name: "MLB" },
  { key: "mma_mixed_martial_arts", name: "MMA/UFC" },
  // Football (Soccer)
  { key: "soccer_epl", name: "EPL ⚽" },
  { key: "soccer_spain_la_liga", name: "La Liga ⚽" },
  { key: "soccer_germany_bundesliga", name: "Bundesliga ⚽" },
  { key: "soccer_italy_serie_a", name: "Serie A ⚽" },
  { key: "soccer_france_ligue_one", name: "Ligue 1 ⚽" },
  { key: "soccer_uefa_champs_league", name: "UCL ⚽" },
  { key: "soccer_usa_mls", name: "MLS ⚽" },
];

// US + UK + EU Sportsbooks
export const BOOKMAKERS = {
  // US Books
  draftkings: { name: "DraftKings", color: "bg-emerald-500/20 text-emerald-400", region: "US" },
  fanduel: { name: "FanDuel", color: "bg-blue-500/20 text-blue-400", region: "US" },
  betmgm: { name: "BetMGM", color: "bg-amber-500/20 text-amber-400", region: "US" },
  caesars: { name: "Caesars", color: "bg-red-500/20 text-red-400", region: "US" },
  pointsbetus: { name: "PointsBet", color: "bg-purple-500/20 text-purple-400", region: "US" },
  betonlineag: { name: "BetOnline", color: "bg-orange-500/20 text-orange-400", region: "US" },
  bovada: { name: "Bovada", color: "bg-rose-500/20 text-rose-400", region: "US" },
  unibet_us: { name: "Unibet", color: "bg-green-500/20 text-green-400", region: "US" },
  // UK Books
  bet365: { name: "Bet365", color: "bg-yellow-500/20 text-yellow-400", region: "UK" },
  williamhill: { name: "William Hill", color: "bg-blue-600/20 text-blue-300", region: "UK" },
  ladbrokes_uk: { name: "Ladbrokes", color: "bg-red-600/20 text-red-400", region: "UK" },
  paddypower: { name: "Paddy Power", color: "bg-green-600/20 text-green-400", region: "UK" },
  skybet: { name: "Sky Bet", color: "bg-sky-500/20 text-sky-400", region: "UK" },
  // EU Books
  betfair: { name: "Betfair", color: "bg-amber-600/20 text-amber-400", region: "EU" },
  unibet_eu: { name: "Unibet EU", color: "bg-teal-500/20 text-teal-400", region: "EU" },
  betsson: { name: "Betsson", color: "bg-orange-600/20 text-orange-400", region: "EU" },
  // Australia
  sportsbet: { name: "Sportsbet", color: "bg-cyan-500/20 text-cyan-400", region: "AU" },
  tab: { name: "TAB", color: "bg-indigo-500/20 text-indigo-400", region: "AU" },
};

/**
 * Fetch upcoming games with odds for a sport
 * @param {string} sportKey - Sport identifier (e.g., "americanfootball_nfl")
 * @param {string} markets - Markets to fetch (h2h, spreads, totals)
 * @returns {Promise<Array>} Array of games with odds
 */
export async function getOdds(sportKey, markets = "h2h,spreads,totals") {
  const url = new URL(`${BASE_URL}/sports/${sportKey}/odds`);
  url.searchParams.set("apiKey", ODDS_API_KEY);
  url.searchParams.set("regions", "us,uk,eu,au");
  url.searchParams.set("markets", markets);
  url.searchParams.set("oddsFormat", "american");

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch odds");
  }

  const games = await response.json();
  return games.map(transformGame);
}

/**
 * Transform API response to our format
 */
function transformGame(game) {
  const bookmakerOdds = {};

  // Process each bookmaker
  game.bookmakers?.forEach((bookmaker) => {
    const bookKey = bookmaker.key;
    if (!BOOKMAKERS[bookKey]) return;

    bookmakerOdds[bookKey] = {
      name: BOOKMAKERS[bookKey].name,
      color: BOOKMAKERS[bookKey].color,
      markets: {},
    };

    // Process each market (h2h, spreads, totals)
    bookmaker.markets?.forEach((market) => {
      bookmakerOdds[bookKey].markets[market.key] = market.outcomes.map((outcome) => ({
        name: outcome.name,
        price: outcome.price,
        point: outcome.point, // For spreads/totals
      }));
    });
  });

  return {
    id: game.id,
    sportKey: game.sport_key,
    sportTitle: game.sport_title,
    commenceTime: game.commence_time,
    homeTeam: game.home_team,
    awayTeam: game.away_team,
    bookmakers: bookmakerOdds,
  };
}

/**
 * Format American odds with + or - prefix
 */
export function formatOdds(price) {
  if (price >= 0) return `+${price}`;
  return `${price}`;
}

/**
 * Find best odds across all bookmakers for a specific outcome
 */
export function findBestOdds(game, market, outcomeName) {
  let bestOdds = null;
  let bestBook = null;

  Object.entries(game.bookmakers).forEach(([bookKey, bookData]) => {
    const marketData = bookData.markets[market];
    if (!marketData) return;

    const outcome = marketData.find((o) => o.name === outcomeName);
    if (!outcome) return;

    if (bestOdds === null || outcome.price > bestOdds) {
      bestOdds = outcome.price;
      bestBook = bookKey;
    }
  });

  return { bestOdds, bestBook };
}

/**
 * Get all available sports
 */
export async function getSports() {
  const url = new URL(`${BASE_URL}/sports`);
  url.searchParams.set("apiKey", ODDS_API_KEY);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch sports");
  }

  return response.json();
}
