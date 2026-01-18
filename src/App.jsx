import { useEffect, useState } from "react";

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

const flowSteps = [
  {
    title: "Research",
    detail: "Open a team to see RSS and tidbits in one view.",
  },
  {
    title: "Validate",
    detail: "Audit a pro by reviewing every pick, wins and losses.",
  },
  {
    title: "Commit",
    detail: "Post a 1-unit pick with a data anchor before lock.",
  },
  {
    title: "Review",
    detail: "Loss prompts encourage cool-downs and reflection.",
  },
];

const personaFeatures = [
  {
    title: "Aggregated Intelligence Terminal",
    points: [
      "Unified feed mixer with source tags and recency scoring.",
      "Change tracker for odds, injury, and sentiment deltas.",
      "First-to-market alerts on verified tidbits.",
    ],
  },
  {
    title: "Credibility & Verification",
    points: [
      "Verified analyst weighting for sentiment heat maps.",
      "Tipster audit view with full, immutable pick history.",
      "Tidbit validator badges with evidence links.",
    ],
  },
  {
    title: "Anti-Chase Controls",
    points: [
      "Configurable cooldowns after loss streaks.",
      "Loss-streak guardrails requiring data anchors.",
      "Daily unit-cap mode until next day.",
    ],
  },
  {
    title: "Research Efficiency Toolkit",
    points: [
      "Source credibility scores based on accuracy.",
      "Stat snapshot cards for verified data anchors.",
      "Noise filter to hide unverified content.",
    ],
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

// Source tag color mapping
const sourceColors = {
  RSS: "bg-blue-500/20 text-blue-400",
  Twitter: "bg-sky-500/20 text-sky-400",
  Reddit: "bg-orange-500/20 text-orange-400",
  ESPN: "bg-emerald-500/20 text-emerald-400",
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

const teams = ["Buffalo Bills", "Miami Dolphins", "Kansas City Chiefs", "Philadelphia Eagles"];

export default function App() {
  const [activeTab, setActiveTab] = useState("team");
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [newsSearchQuery, setNewsSearchQuery] = useState(teams[0]);
  const [newsSearchActive, setNewsSearchActive] = useState(true);
  const [newsResults, setNewsResults] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [tidbits, setTidbits] = useState(initialTidbits);
  const [tidbitInput, setTidbitInput] = useState("");
  const [vault, setVault] = useState(25);
  const [sentiment, setSentiment] = useState(45);
  const [stopLoss, setStopLoss] = useState(5);
  const [lossToday, setLossToday] = useState(3);
  const [cooldown, setCooldown] = useState(30);
  const [unitCap, setUnitCap] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginName, setLoginName] = useState("Bob");
  const [pickOpen, setPickOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [blurOpen, setBlurOpen] = useState(false);

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
    alert("Pick locked. Backend verification is required for immutable storage.");
    setPickOpen(false);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  const handleKillSwitch = () => {
    if (lossToday >= stopLoss && stopLoss > 0) {
      alert(
        "Kill-Switch active. Posting and feed viewing are disabled until tomorrow."
      );
    } else {
      alert("Kill-Switch set. You are within your stop-loss range.");
    }
  };

  // Generate mock AI summary based on articles
  const generateAiSummary = (articles, teamName) => {
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

  const performNewsSearch = (query) => {
    if (!query) return;

    setNewsSearchQuery(query);
    setNewsSearchActive(true);
    setNewsLoading(true);
    setNewsError(null);
    setAiSummary("");

    // Simulate API delay (would be real web search + AI in production)
    setTimeout(() => {
      try {
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
        
        // Generate AI summary
        const summary = generateAiSummary(filtered, query);
        setAiSummary(summary);
        
        setNewsLoading(false);
      } catch (err) {
        setNewsError("Unable to load news. Please try again.");
        setNewsLoading(false);
      }
    }, 500); // Slightly longer delay to simulate AI processing
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
                  className="rounded-xl border border-border px-4 py-2 text-sm"
                  onClick={() => setSettingsOpen(true)}
                >
                  Logic Filter
                </button>
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex flex-col gap-2 text-sm text-muted">
                Entity
                <select
                  className="w-60 rounded-xl border border-border bg-card px-4 py-2 text-sm text-slate-200"
                  value={selectedTeam}
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    // useEffect will auto-trigger search
                  }}
                >
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {["NFL", "AFC East", "2025 Season"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-accent/15 px-3 py-1 text-accent"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

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

        <section className="rounded-xl border border-border bg-panel">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Logic Filter</h2>
          </div>
          <div className="grid gap-5 px-6 py-6 lg:grid-cols-4">
            <article className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold">The Blur Alert</h3>
              <p className="mt-3 text-sm text-slate-300">
                Triggers after 3 picks in 30 minutes following a loss. Offers a
                cool-down and forces review of data anchors.
              </p>
              <button
                className="mt-4 rounded-xl border border-border px-4 py-2 text-sm"
                onClick={() => setBlurOpen(true)}
              >
                Simulate Blur
              </button>
            </article>
            <article className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold">Kill-Switch</h3>
              <p className="mt-3 text-sm text-slate-300">
                Stops posting and feed access after a daily stop-loss is hit.
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <label>Stop-loss (Units)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={stopLoss}
                  onChange={(event) => setStopLoss(Number(event.target.value))}
                  className="w-20 rounded-lg border border-border bg-ink px-2 py-1"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <label>Losses today</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={lossToday}
                  onChange={(event) => setLossToday(Number(event.target.value))}
                  className="w-20 rounded-lg border border-border bg-ink px-2 py-1"
                />
              </div>
              <button
                className="mt-4 w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
                onClick={handleKillSwitch}
              >
                Apply Kill-Switch
              </button>
            </article>
            <article className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold">Anti-Chase Guardrails</h3>
              <p className="mt-3 text-sm text-slate-300">
                Adds friction after loss streaks and enforces unit caps.
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <label>Cooldown (minutes)</label>
                <select
                  className="rounded-lg border border-border bg-ink px-2 py-1"
                  value={cooldown}
                  onChange={(event) => setCooldown(Number(event.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={30}>30</option>
                  <option value={60}>60</option>
                </select>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <label>Daily unit cap</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={unitCap}
                  onChange={(event) => setUnitCap(Number(event.target.value))}
                  className="w-20 rounded-lg border border-border bg-ink px-2 py-1"
                />
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" defaultChecked className="accent-accent" />
                Require data anchor after 2 losses
              </div>
            </article>
            <article className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold">Recovery Fund Vault</h3>
              <p className="mt-3 text-sm text-slate-300">
                Protect survival funds by marking them as off-limits during
                staking.
              </p>
              <div className="mt-4">
                <label className="text-sm">Vaulted %</label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={vault}
                  onChange={(event) => setVault(Number(event.target.value))}
                  className="mt-2 w-full"
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>{vault}%</span>
                  <span className="text-muted">Off-limits bankroll</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-panel">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Persona-Driven Additions</h2>
            <p className="text-sm text-muted">
              Built for Bob: reduce research friction and prevent chase behavior.
            </p>
          </div>
          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            {personaFeatures.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {feature.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-panel">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Analyst Flow</h2>
          </div>
          <div className="grid gap-5 px-6 py-6 md:grid-cols-2 lg:grid-cols-4">
            {flowSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h4 className="text-base font-semibold">{step.title}</h4>
                <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 pb-12 text-center text-xs text-muted md:px-12">
        Beta build prototype. Data shown is sample-only. Ledger immutability and
        verified picks require backend integration.
      </footer>

      <Modal open={pickOpen} onClose={() => setPickOpen(false)}>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Post a Verified Pick</h3>
          <button
            className="text-xl"
            onClick={() => setPickOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <form className="space-y-3" onSubmit={handlePickSubmit}>
          <label className="text-sm">
            Pick
            <input
              type="text"
              placeholder="Bills -3.5"
              required
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Units
            <input
              type="number"
              min="0.25"
              step="0.25"
              defaultValue="1"
              required
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Data Anchor
            <textarea
              placeholder="What is the data anchor for this pick?"
              required
              className="mt-2 min-h-[90px] w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <button className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink">
            Lock Pick
          </button>
        </form>
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

      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Logic Filter Settings</h3>
          <button
            className="text-xl"
            onClick={() => setSettingsOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <div className="space-y-3 text-sm">
          {[
            "Blur Alert enabled",
            "Kill-Switch enabled",
            "Loss-streak guardrails enabled",
            "Recovery Fund Vault enabled",
            "Noise filter for unverified tidbits",
          ].map((label) => (
            <label key={label} className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="accent-accent" />
              {label}
            </label>
          ))}
        </div>
        <button
          className="mt-5 w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
          onClick={() => setSettingsOpen(false)}
        >
          Save
        </button>
      </Modal>

      <Modal open={blurOpen} onClose={() => setBlurOpen(false)} tone="alert">
        <header className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-warning">
            Detecting Potential Chase
          </h3>
          <button
            className="text-xl"
            onClick={() => setBlurOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <p className="text-sm text-slate-300">
          You've placed 3 picks in the last 30 minutes after a loss. Review your
          tidbit data before proceeding.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="rounded-xl border border-border px-4 py-2 text-sm"
            onClick={() => setBlurOpen(false)}
          >
            Review Tidbits
          </button>
          <button
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
            onClick={() => setBlurOpen(false)}
          >
            Bench Me 4 Hours
          </button>
        </div>
      </Modal>
    </div>
  );
}
