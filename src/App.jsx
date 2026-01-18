import { useEffect, useState } from "react";
import { getIntelligence, canUseRealApi } from "./services/newsApi";
import { getOdds, SPORTS, BOOKMAKERS, formatOdds, findBestOdds } from "./services/oddsApi";
import { TEAMS_BY_LEAGUE, FEATURED_TEAMS, ALL_TEAMS, findTeam, getLeagueForTeam, getLogoUrl } from "./data/teams";
import { PLAYERS_BY_LEAGUE, FEATURED_PLAYERS, ALL_PLAYERS, findPlayer, getLeagueForPlayer, getHeadshotUrl, FALLBACK_HEADSHOT, POSITION_COLORS } from "./data/players";

const rssItems = [
  {
    label: "Injury Wire",
    detail: "TE status upgraded to limited practice.",
  },
  {
    label: "Local Beat",
    detail: "Defensive scheme shift expected in cold weather.",
  },
  {
    label: "Official Team",
    detail: "Travel schedule adjusted for weather risk.",
  },
];

const initialTidbits = [
  { text: "Josh Allen is 10-2 in games under 30°F.", votes: 214 },
  { text: "Bills are 6-1 ATS when favored by 3+ after a loss.", votes: 128 },
  { text: "Dolphins allow 4.8 YPC vs zone-heavy offenses.", votes: 96 },
];

const ledgerRows = [
  {
    date: "Jan 17",
    pick: "Bills -3.5",
    units: "1.0",
    anchor: "Cold weather edge",
    status: "Loss",
  },
  {
    date: "Jan 16",
    pick: "Chiefs ML",
    units: "1.5",
    anchor: "Travel fatigue data",
    status: "Win",
  },
  {
    date: "Jan 15",
    pick: "Eagles O24.5",
    units: "0.75",
    anchor: "Injury mismatch",
    status: "Pending",
  },
];

const statusClasses = {
  Win: "text-accent-2",
  Loss: "text-danger",
  Pending: "text-warning",
};

// US-002: Mock news data for beta
const mockNewsData = [
  {
    id: 1,
    headline: "Josh Allen leads Bills to dominant victory in frigid conditions",
    snippet: "The Bills QB threw for 3 TDs in sub-20°F weather, continuing his impressive cold-weather streak.",
    source: "ESPN",
    url: "https://espn.com/nfl/bills-victory",
    timestamp: "2026-01-18T14:30:00Z",
    relatedTeams: ["Buffalo Bills"],
  },
  {
    id: 2,
    headline: "Bills defense ranks #1 in red zone efficiency this season",
    snippet: "Buffalo's defense has allowed just 42% red zone conversions, the best mark in the NFL.",
    source: "RSS",
    url: "https://buffalobills.com/news/defense-stats",
    timestamp: "2026-01-18T12:00:00Z",
    relatedTeams: ["Buffalo Bills"],
  },
  {
    id: 3,
    headline: "Tua questionable for Sunday's matchup vs Jets",
    snippet: "Dolphins QB Tua Tagovailoa limited in practice with ankle issue. Game-time decision expected.",
    source: "Twitter",
    url: "https://twitter.com/dolphins/status/123",
    timestamp: "2026-01-18T10:15:00Z",
    relatedTeams: ["Miami Dolphins"],
  },
  {
    id: 4,
    headline: "Dolphins WR Tyreek Hill back at full practice",
    snippet: "Hill returned to full participation after missing last week with a hip flexor strain.",
    source: "RSS",
    url: "https://miamidolphins.com/news/hill-practice",
    timestamp: "2026-01-17T16:45:00Z",
    relatedTeams: ["Miami Dolphins"],
  },
  {
    id: 5,
    headline: "Chiefs clinch #1 seed with win over Raiders",
    snippet: "Kansas City secures home-field advantage throughout the playoffs with their 13th win.",
    source: "ESPN",
    url: "https://espn.com/nfl/chiefs-clinch",
    timestamp: "2026-01-17T23:30:00Z",
    relatedTeams: ["Kansas City Chiefs"],
  },
  {
    id: 6,
    headline: "Mahomes admits to playing through toe injury",
    snippet: "Chiefs QB Patrick Mahomes reveals he's been managing turf toe for the past 3 weeks.",
    source: "Reddit",
    url: "https://reddit.com/r/nfl/mahomes-injury",
    timestamp: "2026-01-17T14:00:00Z",
    relatedTeams: ["Kansas City Chiefs"],
  },
  {
    id: 7,
    headline: "Eagles OL shuffle: Kelce moving to guard?",
    snippet: "Philadelphia considering position switch for Jason Kelce amid offensive line injuries.",
    source: "Twitter",
    url: "https://twitter.com/eagles/status/456",
    timestamp: "2026-01-18T09:00:00Z",
    relatedTeams: ["Philadelphia Eagles"],
  },
  {
    id: 8,
    headline: "Hurts throws 4 TDs in Eagles blowout win",
    snippet: "Jalen Hurts looked sharp with 4 passing touchdowns as Philadelphia dominated the Giants.",
    source: "ESPN",
    url: "https://espn.com/nfl/eagles-win",
    timestamp: "2026-01-16T22:00:00Z",
    relatedTeams: ["Philadelphia Eagles"],
  },
  {
    id: 9,
    headline: "Bills vs Dolphins: Key matchup preview",
    snippet: "AFC East rivalry heats up as Buffalo and Miami prepare for a crucial divisional showdown.",
    source: "RSS",
    url: "https://nfl.com/news/bills-dolphins-preview",
    timestamp: "2026-01-18T08:00:00Z",
    relatedTeams: ["Buffalo Bills", "Miami Dolphins"],
  },
  {
    id: 10,
    headline: "Chiefs RB room dealing with injuries ahead of playoffs",
    snippet: "Kansas City's backfield depth tested with Pacheco and Edwards both questionable.",
    source: "Reddit",
    url: "https://reddit.com/r/kansascitychiefs/rb-injuries",
    timestamp: "2026-01-17T11:30:00Z",
    relatedTeams: ["Kansas City Chiefs"],
  },
  {
    id: 11,
    headline: "Snow expected for Bills home playoff game",
    snippet: "Lake effect snow forecasted for Highmark Stadium, potentially impacting passing game.",
    source: "Twitter",
    url: "https://twitter.com/weatherchannel/buffalo",
    timestamp: "2026-01-18T07:00:00Z",
    relatedTeams: ["Buffalo Bills"],
  },
  {
    id: 12,
    headline: "Eagles secondary gets boost with Slay return",
    snippet: "CB Darius Slay cleared from concussion protocol, will play Sunday against Cowboys.",
    source: "ESPN",
    url: "https://espn.com/nfl/slay-return",
    timestamp: "2026-01-17T18:00:00Z",
    relatedTeams: ["Philadelphia Eagles"],
  },
];

// Source tag color mapping (expanded for real sources)
const sourceColors = {
  RSS: "bg-blue-500/20 text-blue-400",
  Twitter: "bg-sky-500/20 text-sky-400",
  Reddit: "bg-orange-500/20 text-orange-400",
  ESPN: "bg-emerald-500/20 text-emerald-400",
  "ESPN.com": "bg-emerald-500/20 text-emerald-400",
  "NFL.com": "bg-blue-600/20 text-blue-400",
  "Yahoo Sports": "bg-purple-500/20 text-purple-400",
  "CBS Sports": "bg-blue-500/20 text-blue-400",
  "Bleacher Report": "bg-amber-500/20 text-amber-400",
  "Pro Football Talk": "bg-sky-500/20 text-sky-400",
  "The Athletic": "bg-rose-500/20 text-rose-400",
};

// Helper to format relative time
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const Modal = ({ open, onClose, children, tone = "default" }) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-fade-in-up ${
          tone === "alert" ? "border-l-4 border-l-warning" : ""
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("team");
  const [selectedLeague, setSelectedLeague] = useState("NFL");
  const [teamSearch, setTeamSearch] = useState("");
  const [showAllTeams, setShowAllTeams] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("Buffalo Bills");
  const [selectedPlayer, setSelectedPlayer] = useState("Patrick Mahomes");
  const [playerSearch, setPlayerSearch] = useState("");
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const [newsSearchQuery, setNewsSearchQuery] = useState("Buffalo Bills");
  const [newsSearchActive, setNewsSearchActive] = useState(true);
  const [newsResults, setNewsResults] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [tidbits, setTidbits] = useState(initialTidbits);
  const [tidbitInput, setTidbitInput] = useState("");
  const [sentiment, setSentiment] = useState(45);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginName, setLoginName] = useState("Bob");
  const [pickOpen, setPickOpen] = useState(false);

  // Odds selection state
  const [pickStep, setPickStep] = useState(1); // 1: sport, 2: game, 3: market, 4: confirm
  const [selectedSport, setSelectedSport] = useState(null);
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState("spreads"); // h2h, spreads, totals
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [pickUnits, setPickUnits] = useState(1);
  const [pickAnchor, setPickAnchor] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setSentiment(35 + Math.random() * 50);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // Auto-search when team or player changes
  useEffect(() => {
    if (activeTab === "team" && selectedTeam) {
      performNewsSearch(selectedTeam);
    } else if (activeTab === "player" && selectedPlayer) {
      performNewsSearch(selectedPlayer);
    }
  }, [selectedTeam, selectedPlayer, activeTab]);

  const handleAddTidbit = () => {
    const value = tidbitInput.trim();
    if (!value) {
      return;
    }
    setTidbits((prev) => [{ text: value, votes: 1 }, ...prev]);
    setTidbitInput("");
  };

  const handlePickSubmit = (event) => {
    event.preventDefault();
    
    if (!selectedGame || !selectedOutcome || !selectedBook) {
      alert("Please complete all selections");
      return;
    }

    const bookData = selectedGame.bookmakers[selectedBook];
    const marketData = bookData?.markets[selectedMarket];
    const outcome = marketData?.find(o => o.name === selectedOutcome);
    
    const pickDetails = {
      game: `${selectedGame.awayTeam} @ ${selectedGame.homeTeam}`,
      pick: selectedOutcome,
      market: selectedMarket,
      odds: outcome?.price,
      point: outcome?.point,
      book: BOOKMAKERS[selectedBook]?.name,
      units: pickUnits,
      anchor: pickAnchor,
      timestamp: new Date().toISOString(),
    };

    console.log("Pick locked:", pickDetails);
    alert(`Pick locked!\n\n${pickDetails.pick} ${pickDetails.point ? `(${pickDetails.point})` : ""} @ ${formatOdds(pickDetails.odds)}\nBook: ${pickDetails.book}\nUnits: ${pickDetails.units}`);
    
    // Reset and close
    resetPickModal();
    setPickOpen(false);
  };

  const resetPickModal = () => {
    setPickStep(1);
    setSelectedSport(null);
    setGames([]);
    setSelectedGame(null);
    setSelectedMarket("spreads");
    setSelectedOutcome(null);
    setSelectedBook(null);
    setPickUnits(1);
    setPickAnchor("");
  };

  const handleSportSelect = async (sport) => {
    setSelectedSport(sport);
    setGamesLoading(true);
    setGames([]);
    
    try {
      const fetchedGames = await getOdds(sport.key);
      setGames(fetchedGames);
      setPickStep(2);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      alert("Failed to load games. Please try again.");
    } finally {
      setGamesLoading(false);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setPickStep(3);
  };

  const handleOddsSelect = (outcomeName, bookKey) => {
    setSelectedOutcome(outcomeName);
    setSelectedBook(bookKey);
    setPickStep(4);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  // Generate mock AI summary based on articles (used when real API unavailable)
  const generateMockAiSummary = (articles, teamName) => {
    if (articles.length === 0) return "";
    
    const injuryArticles = articles.filter(a => 
      a.headline.toLowerCase().includes("injury") || 
      a.headline.toLowerCase().includes("questionable") ||
      a.snippet.toLowerCase().includes("injury")
    );
    const performanceArticles = articles.filter(a => 
      a.headline.toLowerCase().includes("win") || 
      a.headline.toLowerCase().includes("victory") ||
      a.headline.toLowerCase().includes("td")
    );
    
    let summary = `📊 **${teamName} Intelligence Brief**\n\n`;
    
    if (injuryArticles.length > 0) {
      summary += `⚠️ **Injury Watch:** ${injuryArticles.length} injury-related update(s). `;
    }
    if (performanceArticles.length > 0) {
      summary += `📈 **Performance:** Recent positive momentum noted. `;
    }
    summary += `\n\n📰 Found ${articles.length} relevant article(s) from the last 48 hours.`;
    
    return summary;
  };

  const performNewsSearch = async (query) => {
    if (!query) return;

    setNewsSearchQuery(query);
    setNewsSearchActive(true);
    setNewsLoading(true);
    setNewsError(null);
    setAiSummary("");
    setNewsResults([]);

    // Use mock data for deployed version (NewsAPI free tier = localhost only)
    if (!canUseRealApi) {
      setTimeout(() => {
        const searchLower = query.toLowerCase();
        const filtered = mockNewsData
          .filter((article) => {
            const inHeadline = article.headline.toLowerCase().includes(searchLower);
            const inSnippet = article.snippet.toLowerCase().includes(searchLower);
            const inTeams = article.relatedTeams.some((team) =>
              team.toLowerCase().includes(searchLower)
            );
            return inHeadline || inSnippet || inTeams;
          })
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setNewsResults(filtered);
        setAiSummary(generateMockAiSummary(filtered, query));
        setNewsLoading(false);
      }, 500);
      return;
    }

    try {
      // Real API call to NewsAPI + OpenAI
      const { articles, summary } = await getIntelligence(query);
      
      setNewsResults(articles);
      setAiSummary(summary);
      setNewsLoading(false);
    } catch (err) {
      console.error("News search error:", err);
      
      // Fallback to mock data if API fails
      const searchLower = query.toLowerCase();
      const filtered = mockNewsData
        .filter((article) => {
          const inHeadline = article.headline.toLowerCase().includes(searchLower);
          const inSnippet = article.snippet.toLowerCase().includes(searchLower);
          const inTeams = article.relatedTeams.some((team) =>
            team.toLowerCase().includes(searchLower)
          );
          return inHeadline || inSnippet || inTeams;
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      if (filtered.length > 0) {
        setNewsResults(filtered);
        setAiSummary(`⚠️ Live API unavailable. Showing cached data.\n\n📰 Found ${filtered.length} cached articles.`);
      } else {
        setNewsError("Unable to load news. Please try again.");
      }
      setNewsLoading(false);
    }
  };

  const handleNewsSearch = () => {
    const query = newsSearchQuery.trim();
    if (!query) return;
    performNewsSearch(query);
  };

  return (
    <div className="min-h-screen bg-ink text-slate-200">
      <header className="sticky top-0 z-20 border-b border-border/50 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-8xl items-center justify-between gap-4 px-6 py-4 md:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent font-display text-lg font-bold text-ink">
              IL
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight text-text-primary">
                Intelligence Ledger
              </h1>
              <p className="text-xs text-text-muted">
                Sports betting intelligence
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {loginName}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setPickOpen(true)}
                >
                  Post Pick
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-ghost"
                  onClick={() => setLoginOpen(true)}
                >
                  Log In
                </button>
                <button className="btn btn-primary">
                  Get Access
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-8xl px-6 py-8 md:px-8 md:py-10">
        {/* Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Team/Player DNA Section */}
            <section className="rounded-2xl border border-border bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
                <h2 className="font-display text-lg font-bold text-text-primary">Research Hub</h2>
                <div className="flex gap-1 rounded-lg bg-ink p-1">
                  {["team", "player"].map((tab) => (
                    <button
                      key={tab}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                        activeTab === tab
                          ? "bg-accent text-ink shadow-sm"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "team" ? "Teams" : "Players"}
                    </button>
                  ))}
                </div>
              </div>
          <div className="space-y-6 px-6 py-6">
            {activeTab === "team" ? (
              <>
                {/* Featured Teams */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Featured</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {FEATURED_TEAMS.map((team) => (
                      <button
                        key={team.name}
                        onClick={() => setSelectedTeam(team.name)}
                        className={`group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200 ${
                          selectedTeam === team.name
                            ? "bg-surface-elevated ring-2 ring-accent shadow-glow-sm"
                            : "bg-ink hover:bg-surface-elevated border border-border hover:border-accent/30"
                        }`}
                      >
                        {/* Subtle team color accent */}
                        <div 
                          className="absolute inset-0 opacity-10"
                          style={{ background: `linear-gradient(135deg, ${team.primary} 0%, transparent 60%)` }}
                        />
                        {/* Background logo */}
                        <img
                          src={getLogoUrl(team.abbr, team.league)}
                          alt=""
                          className="absolute -right-3 -bottom-3 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity"
                        />
                        <div className="relative z-10 flex items-start gap-3">
                          <img
                            src={getLogoUrl(team.abbr, team.league)}
                            alt={team.name}
                            className="w-10 h-10 object-contain"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-text-primary truncate">{team.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span 
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: `${team.primary}30`, color: team.primary }}
                              >
                                {team.league}
                              </span>
                            </div>
                            <p className="text-xs text-text-muted mt-1.5">{team.trending}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* League Filter + Team Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex gap-1 rounded-lg bg-ink p-1">
                    {Object.keys(TEAMS_BY_LEAGUE).map((league) => (
                      <button
                        key={league}
                        onClick={() => { setSelectedLeague(league); setShowAllTeams(true); }}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedLeague === league
                            ? "bg-accent text-ink"
                            : "text-text-muted hover:text-text-primary"
                        }`}
                      >
                        {league}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <input
                      type="text"
                      value={teamSearch}
                      onChange={(e) => { setTeamSearch(e.target.value); setShowAllTeams(true); }}
                      placeholder="Search teams..."
                      className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => setShowAllTeams(!showAllTeams)}
                    className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    {showAllTeams ? "Collapse" : `Browse all →`}
                  </button>
                </div>

                {/* All Teams Grid */}
                {showAllTeams && (
                  <div className="rounded-xl bg-ink p-4 max-h-72 overflow-y-auto animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {(teamSearch
                        ? ALL_TEAMS.filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase()))
                        : TEAMS_BY_LEAGUE[selectedLeague] || []
                      ).map((team) => (
                        <button
                          key={team.name}
                          onClick={() => { setSelectedTeam(team.name); setShowAllTeams(false); setTeamSearch(""); }}
                          className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-all duration-150 ${
                            selectedTeam === team.name
                              ? "bg-accent/15 ring-1 ring-accent"
                              : "hover:bg-surface-elevated"
                          }`}
                        >
                          <img
                            src={getLogoUrl(team.abbr, getLeagueForTeam(team.name))}
                            alt=""
                            className="w-6 h-6 object-contain"
                          />
                          <span className={`text-xs font-medium truncate ${
                            selectedTeam === team.name ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                          }`}>
                            {team.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Team Selection */}
                {(() => {
                  const team = findTeam(selectedTeam);
                  const league = getLeagueForTeam(selectedTeam);
                  if (!team) return null;
                  return (
                    <div className="relative overflow-hidden rounded-xl bg-ink border-l-4 border-accent p-4">
                      {/* Subtle team color overlay */}
                      <div 
                        className="absolute inset-0 opacity-5"
                        style={{ background: `linear-gradient(90deg, ${team.primary} 0%, transparent 50%)` }}
                      />
                      <img
                        src={getLogoUrl(team.abbr, league)}
                        alt=""
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 opacity-10"
                      />
                      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={getLogoUrl(team.abbr, league)}
                            alt={team.name}
                            className="w-12 h-12 object-contain"
                          />
                          <div>
                            <p className="text-xs text-text-muted uppercase tracking-wider">Researching</p>
                            <h3 className="text-lg font-bold text-text-primary">{selectedTeam}</h3>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span 
                            className="rounded-md px-2 py-1 text-xs font-medium"
                            style={{ backgroundColor: `${team.primary}25`, color: team.primary }}
                          >
                            {league}
                          </span>
                          <span className="rounded-md bg-surface-elevated px-2 py-1 text-xs text-text-muted">
                            2025
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <>
                {/* Featured Players */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Featured</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {FEATURED_PLAYERS.map((player) => {
                      const teamData = findTeam(player.team);
                      const posColor = POSITION_COLORS[player.position] || { bg: "bg-gray-500/20", text: "text-gray-400" };
                      return (
                        <button
                          key={player.name}
                          onClick={() => setSelectedPlayer(player.name)}
                          className={`group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200 ${
                            selectedPlayer === player.name
                              ? "bg-surface-elevated ring-2 ring-accent shadow-glow-sm"
                              : "bg-ink hover:bg-surface-elevated border border-border hover:border-accent/30"
                          }`}
                        >
                          {/* Subtle team color accent */}
                          {teamData && (
                            <div 
                              className="absolute inset-0 opacity-10"
                              style={{ background: `linear-gradient(135deg, ${teamData.primary} 0%, transparent 60%)` }}
                            />
                          )}
                          {/* Team logo watermark */}
                          {teamData && (
                            <img
                              src={getLogoUrl(teamData.abbr, player.league)}
                              alt=""
                              className="absolute -right-3 -bottom-3 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity"
                            />
                          )}
                          <div className="relative z-10">
                            <div className="flex items-center gap-3">
                              <img
                                src={getHeadshotUrl(player.id, player.league)}
                                alt={player.name}
                                onError={(e) => { e.target.src = FALLBACK_HEADSHOT; }}
                                className="w-11 h-11 rounded-full object-cover bg-surface border-2 border-border"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-text-primary truncate">{player.name}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${posColor.bg} ${posColor.text}`}>
                                    {player.position}
                                  </span>
                                  <span className="text-xs text-text-muted truncate">{player.team}</span>
                                </div>
                              </div>
                            </div>
                            <p className="mt-2 text-xs text-text-muted">{player.trending}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* League Filter + Player Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex gap-1 rounded-lg bg-ink p-1">
                    {Object.keys(PLAYERS_BY_LEAGUE).map((league) => (
                      <button
                        key={league}
                        onClick={() => { setSelectedLeague(league); setShowAllPlayers(true); }}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedLeague === league
                            ? "bg-accent text-ink"
                            : "text-text-muted hover:text-text-primary"
                        }`}
                      >
                        {league}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <input
                      type="text"
                      value={playerSearch}
                      onChange={(e) => { setPlayerSearch(e.target.value); setShowAllPlayers(true); }}
                      placeholder="Search players..."
                      className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => setShowAllPlayers(!showAllPlayers)}
                    className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    {showAllPlayers ? "Collapse" : "Browse all →"}
                  </button>
                </div>

                {/* All Players Grid */}
                {showAllPlayers && (
                  <div className="rounded-xl bg-ink p-4 max-h-72 overflow-y-auto animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {(playerSearch
                        ? ALL_PLAYERS.filter(p => p.name.toLowerCase().includes(playerSearch.toLowerCase()))
                        : PLAYERS_BY_LEAGUE[selectedLeague] || []
                      ).map((player) => {
                        const posColor = POSITION_COLORS[player.position] || { bg: "bg-gray-500/20", text: "text-gray-400" };
                        return (
                          <button
                            key={player.name}
                            onClick={() => { setSelectedPlayer(player.name); setShowAllPlayers(false); setPlayerSearch(""); }}
                            className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-all duration-150 ${
                              selectedPlayer === player.name
                                ? "bg-accent/15 ring-1 ring-accent"
                                : "hover:bg-surface-elevated"
                            }`}
                          >
                            <img
                              src={getHeadshotUrl(player.id, getLeagueForPlayer(player.name))}
                              alt=""
                              onError={(e) => { e.target.src = FALLBACK_HEADSHOT; }}
                              className="w-8 h-8 rounded-full object-cover bg-surface border border-border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-medium truncate ${
                                selectedPlayer === player.name ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                              }`}>
                                {player.name}
                              </div>
                              <span className={`text-[10px] px-1 rounded ${posColor.bg} ${posColor.text}`}>
                                {player.position}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Current Player Selection */}
                {(() => {
                  const player = findPlayer(selectedPlayer);
                  if (!player) return null;
                  const league = getLeagueForPlayer(selectedPlayer);
                  const teamData = findTeam(player.team);
                  const posColor = POSITION_COLORS[player.position] || { bg: "bg-gray-500/20", text: "text-gray-400" };
                  return (
                    <div className="relative overflow-hidden rounded-xl bg-ink border-l-4 border-accent p-4">
                      {/* Subtle team color overlay */}
                      {teamData && (
                        <div 
                          className="absolute inset-0 opacity-5"
                          style={{ background: `linear-gradient(90deg, ${teamData.primary} 0%, transparent 50%)` }}
                        />
                      )}
                      {/* Team logo watermark */}
                      {teamData && (
                        <img
                          src={getLogoUrl(teamData.abbr, league)}
                          alt=""
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 opacity-10"
                        />
                      )}
                      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={getHeadshotUrl(player.id, league)}
                            alt={player.name}
                            onError={(e) => { e.target.src = FALLBACK_HEADSHOT; }}
                            className="w-12 h-12 rounded-full object-cover bg-surface border-2 border-border"
                          />
                          <div>
                            <p className="text-xs text-text-muted uppercase tracking-wider">Researching</p>
                            <h3 className="text-lg font-bold text-text-primary">{selectedPlayer}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${posColor.bg} ${posColor.text}`}>
                                {player.position}
                              </span>
                              <span className="text-xs text-text-muted">{player.team}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {teamData && (
                            <span 
                              className="rounded-md px-2 py-1 text-xs font-medium"
                              style={{ backgroundColor: `${teamData.primary}25`, color: teamData.primary }}
                            >
                              {league}
                            </span>
                          )}
                          <span className="rounded-md bg-surface-elevated px-2 py-1 text-xs text-text-muted">
                            2025
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

            {/* News Search Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newsSearchQuery}
                onChange={(e) => setNewsSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNewsSearch();
                  }
                }}
                placeholder={`Search news for ${selectedTeam}...`}
                className="flex-1 rounded-xl border border-border bg-ink px-4 py-2 text-sm"
              />
              <button
                onClick={handleNewsSearch}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
              >
                Search
              </button>
            </div>

            {/* News Intelligence Section */}
            {newsSearchActive && (
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Intelligence Feed
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success pulse-live" />
                    <span className="text-xs text-text-muted">Live</span>
                  </div>
                </div>

                {/* Loading State */}
                {newsLoading && (
                  <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-ink">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    <span className="mt-4 text-sm text-text-muted">Scanning sources...</span>
                  </div>
                )}

                {/* Error State */}
                {newsError && !newsLoading && (
                  <div className="rounded-xl bg-danger-muted border-l-4 border-danger px-4 py-3 text-sm text-danger">
                    {newsError}
                  </div>
                )}

                {/* Empty State */}
                {!newsLoading && !newsError && newsResults.length === 0 && (
                  <div className="text-center py-12 rounded-xl bg-ink">
                    <p className="text-text-secondary">No news found for "{newsSearchQuery}"</p>
                    <p className="text-xs text-text-muted mt-1">Try a different search term</p>
                  </div>
                )}

                {/* AI Summary + Results */}
                {!newsLoading && !newsError && newsResults.length > 0 && (
                  <div className="space-y-4">
                    {/* AI Summary Card */}
                    {aiSummary && (
                      <div className="rounded-xl bg-ink border-l-4 border-accent p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-accent">AI Brief</span>
                          <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-accent">Beta</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                          {aiSummary}
                        </p>
                      </div>
                    )}

                    {/* Results List */}
                    <div className="space-y-2">
                      {newsResults.map((article, idx) => (
                        <article
                          key={article.id}
                          className={`group rounded-xl p-4 transition-all duration-150 hover:bg-surface-elevated ${
                            idx % 2 === 0 ? 'bg-ink' : 'bg-surface'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-sm text-text-primary hover:text-accent transition-colors line-clamp-2"
                              >
                                {article.headline}
                              </a>
                              <p className="mt-1.5 text-xs text-text-muted line-clamp-2">
                                {article.snippet.length > 140
                                  ? article.snippet.slice(0, 140) + "..."
                                  : article.snippet}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-md bg-surface-elevated px-2 py-1 text-[10px] font-medium text-text-muted uppercase tracking-wide">
                              {article.source}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-text-muted">
                            <span>{formatRelativeTime(article.timestamp)}</span>
                            {article.relatedTeams?.length > 0 && (
                              <>
                                <span className="text-border">•</span>
                                <span>{article.relatedTeams.join(", ")}</span>
                              </>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-xl bg-ink p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">RSS Feed</h3>
                <ul className="space-y-3">
                  {rssItems.map((item) => (
                    <li key={item.label} className="text-sm">
                      <span className="font-medium text-text-primary">{item.label}</span>
                      <p className="text-text-muted text-xs mt-0.5">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl bg-ink p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Sentiment</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-bold text-accent">{Math.round(sentiment)}%</span>
                    <span className="text-xs text-text-muted">Bullish</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: `${sentiment}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Weighted by verified analyst ROI. Scans X and Reddit every 15 min.
                  </p>
                </div>
              </article>
              <article className="rounded-xl bg-ink p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Tidbits</h3>
                <ul className="space-y-2">
                  {tidbits.map((tidbit) => (
                    <li
                      key={`${tidbit.text}-${tidbit.votes}`}
                      className="flex items-start justify-between gap-3 rounded-lg bg-surface p-3"
                    >
                      <span className="text-sm text-text-secondary">{tidbit.text}</span>
                      <button className="shrink-0 flex items-center gap-1 rounded-md bg-surface-elevated px-2 py-1 text-xs text-text-muted hover:text-accent transition-colors">
                        <span>▲</span>
                        <span className="font-mono">{tidbit.votes}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-2">
                  <input
                    value={tidbitInput}
                    onChange={(event) => setTidbitInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddTidbit();
                      }
                    }}
                    className="input flex-1 bg-surface"
                    placeholder="Add intel..."
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleAddTidbit}
                  >
                    Post
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Ledger Section */}
            <section className="rounded-2xl border border-border bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
                <h2 className="font-display text-lg font-bold text-text-primary">Pick Ledger</h2>
                <span className="flex items-center gap-1.5 rounded-full bg-success-muted px-3 py-1 text-xs font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  100% Transparent
                </span>
              </div>
              <div className="space-y-6 p-6">
                {/* Stats Row */}
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-xl bg-ink p-4">
                    <p className="font-mono text-2xl font-bold text-accent">+18.4</p>
                    <p className="text-xs text-text-muted">Units (90d)</p>
                  </div>
                  <div className="rounded-xl bg-ink p-4">
                    <p className="font-mono text-2xl font-bold text-text-primary">61-47</p>
                    <p className="text-xs text-text-muted">Win/Loss</p>
                  </div>
                  <div className="rounded-xl bg-ink p-4">
                    <p className="font-mono text-2xl font-bold text-text-primary">56.5%</p>
                    <p className="text-xs text-text-muted">Win Rate</p>
                  </div>
                  <div className="flex items-center justify-center rounded-xl border border-border bg-ink p-4">
                    <button className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
                      View Full History →
                    </button>
                  </div>
                </div>

                {/* Ledger Table */}
                <div className="space-y-1">
                  <div className="grid grid-cols-5 gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                    <span>Date</span>
                    <span>Pick</span>
                    <span>Units</span>
                    <span>Anchor</span>
                    <span>Result</span>
                  </div>
                  {ledgerRows.map((row, idx) => (
                    <div
                      key={`${row.date}-${row.pick}`}
                      className={`grid grid-cols-5 gap-4 rounded-lg px-4 py-3 text-sm ${
                        idx % 2 === 0 ? 'bg-ink' : 'bg-surface'
                      }`}
                    >
                      <span className="font-mono text-text-muted">{row.date}</span>
                      <span className="font-medium text-text-primary">{row.pick}</span>
                      <span className="font-mono text-text-secondary">{row.units}</span>
                      <span className="text-text-muted">{row.anchor}</span>
                      <span className={`font-semibold ${
                        row.status === 'W' ? 'text-success' : 
                        row.status === 'L' ? 'text-danger' : 'text-text-muted'
                      }`}>
                        {row.status === 'W' ? '✓ Win' : row.status === 'L' ? '✗ Loss' : row.status}
                      </span>
                    </div>
                  ))}
                </div>
                {!isLoggedIn && (
                  <div className="rounded-lg border border-border bg-ink px-4 py-3 text-center text-xs text-text-muted">
                    Log in to view full ledger history and verified analyst details.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Quick Stats */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="font-display text-sm font-bold text-text-primary mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Today's Record</span>
                  <span className="font-mono text-sm font-semibold text-success">2-1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Week Profit</span>
                  <span className="font-mono text-sm font-semibold text-accent">+4.2u</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Active Picks</span>
                  <span className="font-mono text-sm font-semibold text-text-primary">3</span>
                </div>
              </div>
            </div>

            {/* Trending */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="font-display text-sm font-bold text-text-primary mb-4">🔥 Trending</h3>
              <div className="space-y-3">
                {["Chiefs -3.5", "Lakers ML", "Ohtani Over 1.5 K"].map((pick, i) => (
                  <div key={pick} className="flex items-center justify-between rounded-lg bg-ink px-3 py-2">
                    <span className="text-sm text-text-secondary">{pick}</span>
                    <span className="text-xs text-text-muted">#{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="font-display text-sm font-bold text-text-primary mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="text-success">✓</span>
                  <div>
                    <p className="text-text-secondary">Bills -6.5 hit</p>
                    <p className="text-xs text-text-muted">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-accent">+</span>
                  <div>
                    <p className="text-text-secondary">New pick posted</p>
                    <p className="text-xs text-text-muted">4 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-danger">✗</span>
                  <div>
                    <p className="text-text-secondary">Celtics ML missed</p>
                    <p className="text-xs text-text-muted">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-8xl border-t border-border/50 px-6 py-8 md:px-8">
        <p className="text-center text-xs text-text-muted">
          Intelligence Ledger Beta · Data shown is sample-only · © 2025
        </p>
      </footer>

      <Modal open={pickOpen} onClose={() => { resetPickModal(); setPickOpen(false); }}>
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {pickStep > 1 && (
              <button
                className="text-muted hover:text-slate-200"
                onClick={() => setPickStep(pickStep - 1)}
              >
                ←
              </button>
            )}
            <h3 className="text-lg font-semibold">
              {pickStep === 1 && "Select Sport"}
              {pickStep === 2 && "Select Game"}
              {pickStep === 3 && "Select Odds"}
              {pickStep === 4 && "Confirm Pick"}
            </h3>
          </div>
          <button
            className="text-xl"
            onClick={() => { resetPickModal(); setPickOpen(false); }}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        {/* Step 1: Select Sport */}
        {pickStep === 1 && (
          <div className="grid grid-cols-2 gap-2">
            {SPORTS.map((sport) => (
              <button
                key={sport.key}
                onClick={() => handleSportSelect(sport)}
                className="rounded-lg border border-border bg-ink px-4 py-3 text-sm hover:border-accent hover:bg-accent/10 transition-colors"
              >
                {sport.name}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select Game */}
        {pickStep === 2 && (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {gamesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="ml-3 text-sm text-muted">Loading games...</span>
              </div>
            ) : games.length === 0 ? (
              <p className="text-center py-8 text-muted">No upcoming games found</p>
            ) : (
              games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game)}
                  className="w-full rounded-lg border border-border bg-ink p-3 text-left hover:border-accent transition-colors"
                >
                  <div className="font-semibold text-sm">
                    {game.awayTeam} @ {game.homeTeam}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {new Date(game.commenceTime).toLocaleString()}
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Step 3: Select Market & Odds */}
        {pickStep === 3 && selectedGame && (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted">
              {selectedGame.awayTeam} @ {selectedGame.homeTeam}
            </div>

            {/* Market Tabs */}
            <div className="flex gap-2">
              {["spreads", "h2h", "totals"].map((market) => (
                <button
                  key={market}
                  onClick={() => setSelectedMarket(market)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    selectedMarket === market
                      ? "bg-accent text-ink"
                      : "bg-ink border border-border hover:border-accent"
                  }`}
                >
                  {market === "h2h" ? "Moneyline" : market === "spreads" ? "Spread" : "Total"}
                </button>
              ))}
            </div>

            {/* Odds Grid */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {Object.entries(selectedGame.bookmakers).map(([bookKey, bookData]) => {
                const marketData = bookData.markets[selectedMarket];
                if (!marketData) return null;

                return (
                  <div key={bookKey} className="rounded-lg border border-border bg-ink p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bookData.color}`}>
                        {bookData.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {marketData.map((outcome) => {
                        const { bestOdds, bestBook } = findBestOdds(selectedGame, selectedMarket, outcome.name);
                        const isBest = bestBook === bookKey;

                        return (
                          <button
                            key={outcome.name}
                            onClick={() => handleOddsSelect(outcome.name, bookKey)}
                            className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                              isBest
                                ? "border-accent-2 bg-accent-2/10"
                                : "border-border hover:border-accent"
                            }`}
                          >
                            <div className="text-xs text-muted truncate">{outcome.name}</div>
                            <div className="flex items-center gap-2">
                              {outcome.point !== undefined && (
                                <span className="text-sm font-semibold">
                                  {outcome.point > 0 ? `+${outcome.point}` : outcome.point}
                                </span>
                              )}
                              <span className={`text-sm font-bold ${outcome.price > 0 ? "text-accent-2" : "text-slate-200"}`}>
                                {formatOdds(outcome.price)}
                              </span>
                              {isBest && <span className="text-xs text-accent-2">★</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Confirm Pick */}
        {pickStep === 4 && selectedGame && selectedOutcome && selectedBook && (
          <form className="space-y-4" onSubmit={handlePickSubmit}>
            {/* Pick Summary */}
            <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
              <div className="text-xs text-muted mb-1">Your Pick</div>
              <div className="font-semibold">
                {selectedOutcome}
                {(() => {
                  const bookData = selectedGame.bookmakers[selectedBook];
                  const marketData = bookData?.markets[selectedMarket];
                  const outcome = marketData?.find(o => o.name === selectedOutcome);
                  return outcome?.point !== undefined ? ` (${outcome.point > 0 ? '+' : ''}${outcome.point})` : '';
                })()}
              </div>
              <div className="text-sm text-accent mt-1">
                {formatOdds(
                  selectedGame.bookmakers[selectedBook]?.markets[selectedMarket]?.find(
                    o => o.name === selectedOutcome
                  )?.price
                )} @ {BOOKMAKERS[selectedBook]?.name}
              </div>
              <div className="text-xs text-muted mt-2">
                {selectedGame.awayTeam} @ {selectedGame.homeTeam}
              </div>
            </div>

            {/* Units */}
            <label className="block text-sm">
              Units
              <input
                type="number"
                min="0.25"
                step="0.25"
                value={pickUnits}
                onChange={(e) => setPickUnits(Number(e.target.value))}
                required
                className="input mt-2"
              />
            </label>

            {/* Data Anchor */}
            <label className="block text-sm">
              Data Anchor
              <textarea
                value={pickAnchor}
                onChange={(e) => setPickAnchor(e.target.value)}
                placeholder="What is the data anchor for this pick?"
                required
                className="mt-2 min-h-[70px] w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-ink"
            >
              🔒 Lock Pick
            </button>
          </form>
        )}
      </Modal>

      <Modal open={loginOpen} onClose={() => setLoginOpen(false)}>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Log in</h3>
          <button
            className="text-xl"
            onClick={() => setLoginOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <form className="space-y-3" onSubmit={handleLoginSubmit}>
          <label className="text-sm">
            Name
            <input
              type="text"
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
              required
              className="input mt-2"
            />
          </label>
          <label className="text-sm">
            Email
            <input
              type="email"
              placeholder="bob@email.com"
              required
              className="input mt-2"
            />
          </label>
          <label className="text-sm">
            Password
            <input
              type="password"
              placeholder="••••••••"
              required
              className="input mt-2"
            />
          </label>
          <button className="btn btn-primary w-full">
            Sign in
          </button>
        </form>
      </Modal>


    </div>
  );
}
