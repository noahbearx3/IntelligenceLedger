// Player data with team associations and headshot URLs
// Headshots from ESPN CDN

export const NFL_PLAYERS = [
  // Quarterbacks
  { name: "Josh Allen", team: "Buffalo Bills", position: "QB", id: "3918298" },
  { name: "Patrick Mahomes", team: "Kansas City Chiefs", position: "QB", id: "3139477" },
  { name: "Jalen Hurts", team: "Philadelphia Eagles", position: "QB", id: "4040715" },
  { name: "Lamar Jackson", team: "Baltimore Ravens", position: "QB", id: "3916387" },
  { name: "Joe Burrow", team: "Cincinnati Bengals", position: "QB", id: "3915511" },
  { name: "Justin Herbert", team: "Los Angeles Chargers", position: "QB", id: "4038941" },
  { name: "Tua Tagovailoa", team: "Miami Dolphins", position: "QB", id: "4241479" },
  { name: "Dak Prescott", team: "Dallas Cowboys", position: "QB", id: "2577417" },
  { name: "Trevor Lawrence", team: "Jacksonville Jaguars", position: "QB", id: "4360310" },
  { name: "C.J. Stroud", team: "Houston Texans", position: "QB", id: "4432577" },
  { name: "Brock Purdy", team: "San Francisco 49ers", position: "QB", id: "4361741" },
  { name: "Jordan Love", team: "Green Bay Packers", position: "QB", id: "4036378" },
  // Running Backs
  { name: "Christian McCaffrey", team: "San Francisco 49ers", position: "RB", id: "3117251" },
  { name: "Derrick Henry", team: "Baltimore Ravens", position: "RB", id: "3043078" },
  { name: "Saquon Barkley", team: "Philadelphia Eagles", position: "RB", id: "3929630" },
  { name: "Jonathan Taylor", team: "Indianapolis Colts", position: "RB", id: "4242335" },
  { name: "Nick Chubb", team: "Cleveland Browns", position: "RB", id: "3128720" },
  { name: "Breece Hall", team: "New York Jets", position: "RB", id: "4362628" },
  { name: "Travis Etienne", team: "Jacksonville Jaguars", position: "RB", id: "4239996" },
  { name: "Josh Jacobs", team: "Green Bay Packers", position: "RB", id: "4047365" },
  // Wide Receivers
  { name: "Tyreek Hill", team: "Miami Dolphins", position: "WR", id: "3116406" },
  { name: "CeeDee Lamb", team: "Dallas Cowboys", position: "WR", id: "4241389" },
  { name: "Ja'Marr Chase", team: "Cincinnati Bengals", position: "WR", id: "4362628" },
  { name: "A.J. Brown", team: "Philadelphia Eagles", position: "WR", id: "4047650" },
  { name: "Justin Jefferson", team: "Minnesota Vikings", position: "WR", id: "4262921" },
  { name: "Davante Adams", team: "New York Jets", position: "WR", id: "2976212" },
  { name: "Stefon Diggs", team: "Houston Texans", position: "WR", id: "2976592" },
  { name: "Amon-Ra St. Brown", team: "Detroit Lions", position: "WR", id: "4360939" },
  // Tight Ends
  { name: "Travis Kelce", team: "Kansas City Chiefs", position: "TE", id: "2976212" },
  { name: "George Kittle", team: "San Francisco 49ers", position: "TE", id: "3040151" },
  { name: "Mark Andrews", team: "Baltimore Ravens", position: "TE", id: "3051889" },
  { name: "T.J. Hockenson", team: "Minnesota Vikings", position: "TE", id: "4035538" },
];

export const NBA_PLAYERS = [
  // Guards
  { name: "Stephen Curry", team: "Golden State Warriors", position: "PG", id: "3975" },
  { name: "Luka Doncic", team: "Dallas Mavericks", position: "PG", id: "3945274" },
  { name: "Shai Gilgeous-Alexander", team: "Oklahoma City Thunder", position: "PG", id: "4278073" },
  { name: "Ja Morant", team: "Memphis Grizzlies", position: "PG", id: "4279888" },
  { name: "Tyrese Haliburton", team: "Indiana Pacers", position: "PG", id: "4395725" },
  { name: "Trae Young", team: "Atlanta Hawks", position: "PG", id: "4277905" },
  { name: "Devin Booker", team: "Phoenix Suns", position: "SG", id: "3136193" },
  { name: "Donovan Mitchell", team: "Cleveland Cavaliers", position: "SG", id: "3908809" },
  { name: "Anthony Edwards", team: "Minnesota Timberwolves", position: "SG", id: "4594268" },
  // Forwards
  { name: "LeBron James", team: "Los Angeles Lakers", position: "SF", id: "1966" },
  { name: "Kevin Durant", team: "Phoenix Suns", position: "SF", id: "3202" },
  { name: "Jayson Tatum", team: "Boston Celtics", position: "SF", id: "4065648" },
  { name: "Giannis Antetokounmpo", team: "Milwaukee Bucks", position: "PF", id: "3032977" },
  { name: "Kawhi Leonard", team: "LA Clippers", position: "SF", id: "6450" },
  { name: "Jimmy Butler", team: "Miami Heat", position: "SF", id: "6430" },
  { name: "Jaylen Brown", team: "Boston Celtics", position: "SG", id: "3917376" },
  { name: "Paolo Banchero", team: "Orlando Magic", position: "PF", id: "4706378" },
  { name: "Zion Williamson", team: "New Orleans Pelicans", position: "PF", id: "4395628" },
  // Centers
  { name: "Nikola Jokic", team: "Denver Nuggets", position: "C", id: "3112335" },
  { name: "Joel Embiid", team: "Philadelphia 76ers", position: "C", id: "3059318" },
  { name: "Anthony Davis", team: "Los Angeles Lakers", position: "C", id: "6583" },
  { name: "Victor Wembanyama", team: "San Antonio Spurs", position: "C", id: "4867032" },
  { name: "Bam Adebayo", team: "Miami Heat", position: "C", id: "4066261" },
];

export const NHL_PLAYERS = [
  // Centers
  { name: "Connor McDavid", team: "Edmonton Oilers", position: "C", id: "3895074" },
  { name: "Nathan MacKinnon", team: "Colorado Avalanche", position: "C", id: "3041969" },
  { name: "Auston Matthews", team: "Toronto Maple Leafs", position: "C", id: "4024123" },
  { name: "Leon Draisaitl", team: "Edmonton Oilers", position: "C", id: "3114727" },
  { name: "Sidney Crosby", team: "Pittsburgh Penguins", position: "C", id: "3114" },
  { name: "Jack Eichel", team: "Vegas Golden Knights", position: "C", id: "3904173" },
  // Wingers
  { name: "David Pastrnak", team: "Boston Bruins", position: "RW", id: "3899937" },
  { name: "Nikita Kucherov", team: "Tampa Bay Lightning", position: "RW", id: "2563039" },
  { name: "Artemi Panarin", team: "New York Rangers", position: "LW", id: "2562602" },
  { name: "Kirill Kaprizov", team: "Minnesota Wild", position: "LW", id: "4024845" },
  { name: "Alex Ovechkin", team: "Washington Capitals", position: "LW", id: "3101" },
  { name: "Matthew Tkachuk", team: "Florida Panthers", position: "LW", id: "4024122" },
  // Defensemen
  { name: "Cale Makar", team: "Colorado Avalanche", position: "D", id: "4352768" },
  { name: "Adam Fox", team: "New York Rangers", position: "D", id: "4233708" },
  { name: "Quinn Hughes", team: "Vancouver Canucks", position: "D", id: "4352756" },
  { name: "Victor Hedman", team: "Tampa Bay Lightning", position: "D", id: "2562610" },
  // Goalies
  { name: "Connor Hellebuyck", team: "Winnipeg Jets", position: "G", id: "3042010" },
  { name: "Igor Shesterkin", team: "New York Rangers", position: "G", id: "4233637" },
  { name: "Andrei Vasilevskiy", team: "Tampa Bay Lightning", position: "G", id: "3042024" },
];

export const MLB_PLAYERS = [
  // Pitchers
  { name: "Shohei Ohtani", team: "Los Angeles Dodgers", position: "DH/P", id: "39832" },
  { name: "Gerrit Cole", team: "New York Yankees", position: "SP", id: "32081" },
  { name: "Spencer Strider", team: "Atlanta Braves", position: "SP", id: "40479" },
  { name: "Corbin Burnes", team: "Baltimore Orioles", position: "SP", id: "40325" },
  { name: "Zack Wheeler", team: "Philadelphia Phillies", position: "SP", id: "33316" },
  // Catchers
  { name: "J.T. Realmuto", team: "Philadelphia Phillies", position: "C", id: "33157" },
  { name: "William Contreras", team: "Milwaukee Brewers", position: "C", id: "41200" },
  // Infielders
  { name: "Mookie Betts", team: "Los Angeles Dodgers", position: "SS", id: "33912" },
  { name: "Freddie Freeman", team: "Los Angeles Dodgers", position: "1B", id: "31101" },
  { name: "Corey Seager", team: "Texas Rangers", position: "SS", id: "35983" },
  { name: "Trea Turner", team: "Philadelphia Phillies", position: "SS", id: "34963" },
  { name: "Marcus Semien", team: "Texas Rangers", position: "2B", id: "33004" },
  { name: "Matt Olson", team: "Atlanta Braves", position: "1B", id: "36027" },
  { name: "Jose Ramirez", team: "Cleveland Guardians", position: "3B", id: "32801" },
  { name: "Bobby Witt Jr.", team: "Kansas City Royals", position: "SS", id: "41276" },
  // Outfielders
  { name: "Mike Trout", team: "Los Angeles Angels", position: "CF", id: "33260" },
  { name: "Ronald Acuña Jr.", team: "Atlanta Braves", position: "RF", id: "36185" },
  { name: "Aaron Judge", team: "New York Yankees", position: "RF", id: "36185" },
  { name: "Juan Soto", team: "New York Yankees", position: "RF", id: "40300" },
  { name: "Fernando Tatis Jr.", team: "San Diego Padres", position: "RF", id: "40346" },
  { name: "Julio Rodriguez", team: "Seattle Mariners", position: "CF", id: "41215" },
];

// Get headshot URL for a player
export function getHeadshotUrl(playerId, league) {
  const leaguePath = league.toLowerCase();
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/${leaguePath}/players/full/${playerId}.png&h=80&w=80`;
}

// Fallback silhouette
export const FALLBACK_HEADSHOT = "https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=80&h=80";

// All players by league
export const PLAYERS_BY_LEAGUE = {
  NFL: NFL_PLAYERS,
  NBA: NBA_PLAYERS,
  NHL: NHL_PLAYERS,
  MLB: MLB_PLAYERS,
};

// All players flattened
export const ALL_PLAYERS = [...NFL_PLAYERS, ...NBA_PLAYERS, ...NHL_PLAYERS, ...MLB_PLAYERS];

// Featured players
export const FEATURED_PLAYERS = [
  { ...NFL_PLAYERS.find(p => p.name === "Patrick Mahomes"), league: "NFL", trending: "🏈 MVP candidate" },
  { ...NBA_PLAYERS.find(p => p.name === "Nikola Jokic"), league: "NBA", trending: "🏀 Triple-double machine" },
  { ...NHL_PLAYERS.find(p => p.name === "Connor McDavid"), league: "NHL", trending: "🏒 Point leader" },
  { ...MLB_PLAYERS.find(p => p.name === "Shohei Ohtani"), league: "MLB", trending: "⚾ Historic season" },
];

// Find player by name
export function findPlayer(name) {
  return ALL_PLAYERS.find(p => p.name === name);
}

// Get league for player
export function getLeagueForPlayer(name) {
  for (const [league, players] of Object.entries(PLAYERS_BY_LEAGUE)) {
    if (players.find(p => p.name === name)) return league;
  }
  return "NFL";
}

// Position color coding
export const POSITION_COLORS = {
  // NFL
  QB: { bg: "bg-red-500/20", text: "text-red-400" },
  RB: { bg: "bg-green-500/20", text: "text-green-400" },
  WR: { bg: "bg-blue-500/20", text: "text-blue-400" },
  TE: { bg: "bg-purple-500/20", text: "text-purple-400" },
  // NBA
  PG: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  SG: { bg: "bg-orange-500/20", text: "text-orange-400" },
  SF: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  PF: { bg: "bg-pink-500/20", text: "text-pink-400" },
  C: { bg: "bg-indigo-500/20", text: "text-indigo-400" },
  // NHL
  LW: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  RW: { bg: "bg-teal-500/20", text: "text-teal-400" },
  D: { bg: "bg-slate-500/20", text: "text-slate-400" },
  G: { bg: "bg-amber-500/20", text: "text-amber-400" },
  // MLB
  SP: { bg: "bg-rose-500/20", text: "text-rose-400" },
  "DH/P": { bg: "bg-violet-500/20", text: "text-violet-400" },
  "1B": { bg: "bg-lime-500/20", text: "text-lime-400" },
  "2B": { bg: "bg-sky-500/20", text: "text-sky-400" },
  "3B": { bg: "bg-fuchsia-500/20", text: "text-fuchsia-400" },
  SS: { bg: "bg-amber-500/20", text: "text-amber-400" },
  CF: { bg: "bg-green-500/20", text: "text-green-400" },
  RF: { bg: "bg-blue-500/20", text: "text-blue-400" },
  LF: { bg: "bg-purple-500/20", text: "text-purple-400" },
};
