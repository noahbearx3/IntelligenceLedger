import { useEffect, useState } from "react";
import { getIntelligence, canUseRealApi } from "./services/newsApi";
import { getOdds, SPORTS, BOOKMAKERS, formatOdds, findBestOdds } from "./services/oddsApi";
import { TEAMS_BY_LEAGUE, FEATURED_TEAMS, ALL_TEAMS, findTeam, getLeagueForTeam, getLogoUrl } from "./data/teams";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-xl border border-border bg-card p-6 ${
          tone === "alert" ? "shadow-[0_0_0_1px_rgba(245,158,11,0.3)]" : ""
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

  // Auto-search when team changes
  useEffect(() => {
    if (selectedTeam) {
      performNewsSearch(selectedTeam);
    }
  }, [selectedTeam]);

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
      <header className="sticky top-0 z-20 border-b border-border bg-ink/95">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-12">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 font-bold text-ink">
              IL
            </span>
            <div>
              <h1 className="text-xl font-semibold">The Intelligence Ledger</h1>
              <p className="text-sm text-muted">
                Social intelligence for sports betting
              </p>
            </div>
          </div>
          <nav className="flex gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted">
                  <span className="h-2 w-2 rounded-full bg-accent-2" />
                  {loginName}
                </div>
                <button
                  className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
                  onClick={() => setPickOpen(true)}
                >
                  Post Pick
                </button>
              </>
            ) : (
              <>
                <button
                  className="rounded-xl border border-border px-4 py-2 text-sm"
                  onClick={() => setLoginOpen(true)}
                >
                  Log In
                </button>
                <button className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink">
                  Request Access
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-6 py-8 md:px-12 md:py-10">
        <section className="rounded-xl border border-border bg-panel">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Team/Player DNA</h2>
            <div className="flex gap-2">
              {["team", "player"].map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full border px-4 py-1 text-sm ${
                    activeTab === tab
                      ? "border-transparent bg-accent text-ink"
                      : "border-border"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "team" ? "Team" : "Player"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6 px-6 py-6">
            {/* Featured Teams */}
            <div>
              <h3 className="text-sm font-semibold text-muted mb-3">🔥 Featured</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FEATURED_TEAMS.map((team) => (
                  <button
                    key={team.name}
                    onClick={() => setSelectedTeam(team.name)}
                    className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                      selectedTeam === team.name
                        ? "border-white/40 ring-2 ring-white/20"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${team.primary}dd 0%, ${team.secondary}cc 100%)`,
                    }}
                  >
                    {/* Background logo watermark */}
                    <img
                      src={getLogoUrl(team.abbr, team.league)}
                      alt=""
                      className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20 group-hover:opacity-30 transition-opacity"
                    />
                    {/* Content */}
                    <div className="relative z-10 flex items-start gap-2">
                      <img
                        src={getLogoUrl(team.abbr, team.league)}
                        alt={team.name}
                        className="w-8 h-8 object-contain"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate drop-shadow-md">{team.name}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-white/70 font-medium">{team.league}</span>
                          <span className="text-xs text-white/90">{team.trending}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* League Filter + Team Search */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex gap-2">
                {Object.keys(TEAMS_BY_LEAGUE).map((league) => (
                  <button
                    key={league}
                    onClick={() => { setSelectedLeague(league); setShowAllTeams(true); }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedLeague === league
                        ? "bg-accent text-ink"
                        : "bg-card border border-border hover:border-accent"
                    }`}
                  >
                    {league}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={teamSearch}
                  onChange={(e) => { setTeamSearch(e.target.value); setShowAllTeams(true); }}
                  placeholder="Search all teams..."
                  className="w-full rounded-xl border border-border bg-ink px-4 py-2 text-sm"
                />
              </div>
              <button
                onClick={() => setShowAllTeams(!showAllTeams)}
                className="text-xs text-accent hover:underline"
              >
                {showAllTeams ? "Hide all" : `Browse all ${TEAMS_BY_LEAGUE[selectedLeague]?.length || 0} teams`}
              </button>
            </div>

            {/* All Teams Grid (expandable) */}
            {showAllTeams && (
              <div className="rounded-xl border border-border bg-card/50 p-4 max-h-80 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {(teamSearch
                    ? ALL_TEAMS.filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase()))
                    : TEAMS_BY_LEAGUE[selectedLeague] || []
                  ).map((team) => (
                    <button
                      key={team.name}
                      onClick={() => { setSelectedTeam(team.name); setShowAllTeams(false); setTeamSearch(""); }}
                      className={`group relative overflow-hidden rounded-lg p-2 text-left transition-all ${
                        selectedTeam === team.name
                          ? "ring-2 ring-white/40"
                          : "hover:ring-1 hover:ring-white/20"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${team.primary}bb 0%, ${team.secondary}99 100%)`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={getLogoUrl(team.abbr, getLeagueForTeam(team.name))}
                          alt=""
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-xs font-medium text-white truncate drop-shadow-sm">
                          {team.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Selection */}
            {(() => {
              const team = findTeam(selectedTeam);
              const league = getLeagueForTeam(selectedTeam);
              if (!team) return null;
              return (
                <div 
                  className="relative overflow-hidden rounded-xl p-4"
                  style={{
                    background: `linear-gradient(135deg, ${team.primary}40 0%, ${team.secondary}30 100%)`,
                    borderLeft: `4px solid ${team.primary}`,
                  }}
                >
                  {/* Background watermark */}
                  <img
                    src={getLogoUrl(team.abbr, league)}
                    alt=""
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 opacity-15"
                  />
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={getLogoUrl(team.abbr, league)}
                        alt={team.name}
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        <div className="text-xs text-muted">Currently viewing</div>
                        <div className="text-xl font-bold text-white">{selectedTeam}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span 
                        className="rounded-full px-3 py-1 font-semibold"
                        style={{ backgroundColor: team.primary, color: '#fff' }}
                      >
                        {league}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
                        2025 Season
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

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
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">
                    🔍 Intelligence Feed: {selectedTeam}
                  </h3>
                  <span className="text-xs text-muted">Auto-updating</span>
                </div>

                {/* Loading State */}
                {newsLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    <span className="mt-3 text-sm text-muted">Scanning sources & generating insights...</span>
                  </div>
                )}

                {/* Error State */}
                {newsError && !newsLoading && (
                  <div className="rounded-lg bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger">
                    {newsError}
                  </div>
                )}

                {/* Empty State */}
                {!newsLoading && !newsError && newsResults.length === 0 && (
                  <div className="text-center py-8 text-muted">
                    <p>No news found for "{newsSearchQuery}".</p>
                    <p className="text-xs mt-1">Try a different search term.</p>
                  </div>
                )}

                {/* AI Summary + Results */}
                {!newsLoading && !newsError && newsResults.length > 0 && (
                  <div className="space-y-4">
                    {/* AI Summary Card */}
                    {aiSummary && (
                      <div className="rounded-lg bg-gradient-to-r from-accent/10 to-accent-2/10 border border-accent/30 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-accent">AI SUMMARY</span>
                          <span className="text-xs text-muted">• Beta</span>
                        </div>
                        <p className="text-sm text-slate-300 whitespace-pre-line">
                          {aiSummary}
                        </p>
                      </div>
                    )}

                    {/* Results List */}
                    <div className="space-y-3">
                      {newsResults.map((article) => (
                        <article
                          key={article.id}
                          className="rounded-lg border border-border bg-ink p-4 hover:border-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-sm hover:text-accent transition-colors"
                            >
                              {article.headline}
                            </a>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                sourceColors[article.source] || "bg-slate-500/20 text-slate-400"
                              }`}
                            >
                              {article.source}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                            {article.snippet.length > 150
                              ? article.snippet.slice(0, 150) + "..."
                              : article.snippet}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                            <span>{formatRelativeTime(article.timestamp)}</span>
                            <span>•</span>
                            <span>{article.relatedTeams.join(", ")}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-3">
              <article className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">RSS Aggregator</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {rssItems.map((item) => (
                    <li key={item.label}>
                      <span className="font-semibold">{item.label}:</span>{" "}
                      {item.detail}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">Sentiment Heat Map</h3>
                <div className="mt-4 space-y-3">
                  <div className="h-4 overflow-hidden rounded-full border border-border bg-ink">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
                      style={{ width: `${sentiment}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>Bullish</span>
                    <span>Neutral</span>
                    <span>Bearish</span>
                  </div>
                  <p className="text-xs text-muted">
                    Weighted by verified analyst ROI. Scans X and Reddit every 15
                    minutes to estimate public lean.
                  </p>
                </div>
              </article>
              <article className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">Tidbit Feed</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {tidbits.map((tidbit) => (
                    <li
                      key={`${tidbit.text}-${tidbit.votes}`}
                      className="flex items-start justify-between gap-3"
                    >
                      <span>{tidbit.text}</span>
                      <button className="rounded-full border border-border px-3 py-1 text-xs">
                        ▲ {tidbit.votes}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <input
                    value={tidbitInput}
                    onChange={(event) => setTidbitInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddTidbit();
                      }
                    }}
                    className="flex-1 rounded-xl border border-border bg-ink px-4 py-2 text-sm"
                    placeholder="Add a verified tidbit..."
                  />
                  <button
                    className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
                    onClick={handleAddTidbit}
                  >
                    Post
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted">
                  Tidbits marked as verified receive a badge and higher ranking.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-panel">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Immutable Ledger</h2>
            <span className="rounded-full bg-accent-2/15 px-3 py-1 text-xs text-accent-2">
              Verified Analyst: 0% hidden picks
            </span>
          </div>
          <div className="space-y-6 px-6 py-6">
            <div className="grid gap-5 md:grid-cols-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-100">
                  +18.4 Units
                </h3>
                <p className="text-sm text-muted">Past 90 days</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted">Win/Loss</h4>
                <p className="text-base">61 - 47</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted">Last 7 Picks</h4>
                <p className="text-base">4W / 3L</p>
              </div>
              <div className="flex items-center">
                <button className="rounded-xl border border-border px-4 py-2 text-sm">
                  View Full History
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-5 gap-4 rounded-xl bg-ink px-4 py-2 text-xs uppercase tracking-widest text-muted">
                <span>Date</span>
                <span>Pick</span>
                <span>Units</span>
                <span>Anchor</span>
                <span>Status</span>
              </div>
              {ledgerRows.map((row) => (
                <div
                  key={`${row.date}-${row.pick}`}
                  className="grid grid-cols-5 gap-4 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <span>{row.date}</span>
                  <span>{row.pick}</span>
                  <span>{row.units}</span>
                  <span>{row.anchor}</span>
                  <span className={statusClasses[row.status]}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
            {!isLoggedIn && (
              <div className="rounded-xl border border-border bg-ink px-4 py-3 text-xs text-muted">
                Log in to view full ledger history and verified analyst details.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="px-6 pb-12 text-center text-xs text-muted md:px-12">
        Beta build prototype. Data shown is sample-only. Ledger immutability and
        verified picks require backend integration.
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
                className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
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
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Email
            <input
              type="email"
              placeholder="bob@email.com"
              required
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Password
            <input
              type="password"
              placeholder="••••••••"
              required
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <button className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink">
            Sign in
          </button>
        </form>
      </Modal>


    </div>
  );
}
