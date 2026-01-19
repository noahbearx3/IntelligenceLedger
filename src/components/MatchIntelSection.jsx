import { useState, useEffect } from "react";
import {
  getNextFixture,
  getTeamForm,
  getLineup,
  getH2H,
  getInjuries,
  getStandings,
  getRoster,
  getScoreboard,
  TEAM_IDS,
  LEAGUE_IDS,
} from "../services/matchDataApi";
import { getLeagueForTeam } from "../data/teams";

/**
 * Match Intel Section
 * Displays fixture, form, standings, H2H, injuries, roster, live scores
 */
export default function MatchIntelSection({ teamName, league }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [data, setData] = useState({
    fixture: null,
    form: [],
    lineup: [],
    h2h: null,
    injuries: [],
    standings: [],
    roster: [],
    scoreboard: [],
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const teamLeague = getLeagueForTeam(teamName) || league;
  const isSoccer = ["EPL", "La Liga", "MLS", "Bundesliga", "Serie A", "Ligue 1", "Champions League"].includes(teamLeague);

  useEffect(() => {
    if (!teamName) return;
    
    setLoading(true);
    setActiveTab("overview");
    setError(null);
    setData({
      fixture: null,
      form: [],
      lineup: [],
      h2h: null,
      injuries: [],
      standings: [],
      roster: [],
      scoreboard: [],
    });
    
    loadData();
  }, [teamName]);

  const loadData = async () => {
    try {
      console.log(`🏟️ Loading data for ${teamName} (${teamLeague})`);
      
      const [fixture, form, injuries] = await Promise.all([
        getNextFixture(teamName),
        getTeamForm(teamName),
        getInjuries(teamName),
      ]);
      
      setData(prev => ({ ...prev, fixture, form, injuries }));
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error loading match data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Lazy load H2H
  const loadH2H = async () => {
    if (data.h2h !== null) return;
    if (!data.fixture) {
      setData(prev => ({ ...prev, h2h: { matches: [], stats: { wins: 0, draws: 0, losses: 0, total: 0 } } }));
      return;
    }
    
    setTabLoading(true);
    const opponent = data.fixture.home.name === teamName 
      ? data.fixture.away.name 
      : data.fixture.home.name;
    
    const h2h = await getH2H(teamName, opponent);
    setData(prev => ({ ...prev, h2h }));
    setTabLoading(false);
  };

  // Lazy load lineup
  const loadLineup = async () => {
    if (data.lineup.length > 0) return;
    if (!data.fixture) return;
    
    setTabLoading(true);
    const lineup = await getLineup(data.fixture.id);
    setData(prev => ({ ...prev, lineup }));
    setTabLoading(false);
  };

  // Lazy load standings
  const loadStandings = async () => {
    if (data.standings.length > 0) return;
    
    setTabLoading(true);
    console.log(`📊 Loading standings for ${teamLeague}`);
    const standings = await getStandings(teamLeague);
    setData(prev => ({ ...prev, standings }));
    setTabLoading(false);
  };

  // Lazy load roster
  const loadRoster = async () => {
    if (data.roster.length > 0) return;
    
    setTabLoading(true);
    const roster = await getRoster(teamName);
    setData(prev => ({ ...prev, roster }));
    setTabLoading(false);
  };

  // Lazy load scoreboard
  const loadScoreboard = async () => {
    if (data.scoreboard.length > 0) return;
    
    setTabLoading(true);
    const scoreboard = await getScoreboard(teamLeague);
    setData(prev => ({ ...prev, scoreboard }));
    setTabLoading(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "live", label: "Live", icon: "🔴" },
    { id: "form", label: "Form", icon: "📈" },
    { id: "roster", label: "Roster", icon: "👥" },
    { id: "h2h", label: "H2H", icon: "⚔️" },
    { id: "injuries", label: "Injuries", icon: "🏥", badge: data.injuries.length > 0 ? data.injuries.length : null },
    { id: "table", label: "Table", icon: "🏆" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "h2h") loadH2H();
    if (tabId === "lineup") loadLineup();
    if (tabId === "table") loadStandings();
    if (tabId === "roster") loadRoster();
    if (tabId === "live") loadScoreboard();
  };

  if (!teamName) {
    return (
      <div className="rounded-xl bg-ink border border-border p-8 text-center">
        <div className="text-4xl mb-3">🏟️</div>
        <p className="text-text-muted">Select a team to see match intel</p>
      </div>
    );
  }

  const sportEmoji = teamLeague === "NFL" ? "🏈" : teamLeague === "NBA" ? "🏀" : teamLeague === "MLB" ? "⚾" : teamLeague === "NHL" ? "🏒" : "⚽";

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="label flex items-center gap-2">
          <span className="text-accent text-sm">{sportEmoji}</span>
          <span className="font-display text-sm font-semibold tracking-normal normal-case text-text-primary">Match Intel</span>
          <span className="text-2xs bg-accent/20 text-accent px-1.5 py-0.5 rounded font-semibold">
            {teamLeague}
          </span>
          {lastUpdated && (
            <span className="text-2xs text-text-muted/70 font-normal normal-case tracking-normal">
              • {Math.round((Date.now() - lastUpdated.getTime()) / 60000)}m ago
            </span>
          )}
        </h3>
        <button
          onClick={loadData}
          className="text-xs text-text-muted hover:text-accent transition-colors font-medium"
          title="Refresh data"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-ink p-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-accent text-ink"
                : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? "bg-ink/20 text-ink" : "bg-danger/20 text-danger"
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[250px]">
        {loading ? (
          <SkeletonLoader type="overview" />
        ) : tabLoading ? (
          <SkeletonLoader type={activeTab} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : (
          <>
            {activeTab === "overview" && (
              <OverviewTab fixture={data.fixture} form={data.form} injuries={data.injuries} teamName={teamName} />
            )}
            {activeTab === "live" && <ScoreboardTab games={data.scoreboard} league={teamLeague} />}
            {activeTab === "form" && <FormTab form={data.form} teamName={teamName} />}
            {activeTab === "roster" && <RosterTab roster={data.roster} teamName={teamName} isSoccer={isSoccer} />}
            {activeTab === "h2h" && <H2HTab h2h={data.h2h} teamName={teamName} fixture={data.fixture} />}
            {activeTab === "injuries" && <InjuriesTab injuries={data.injuries} />}
            {activeTab === "table" && <StandingsTab standings={data.standings} teamName={teamName} isSoccer={isSoccer} />}
          </>
        )}
      </div>
    </div>
  );
}

// ==================== SKELETON LOADERS ====================

function SkeletonLoader({ type }) {
  if (type === "overview") {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="rounded-xl bg-ink border border-border p-4">
          <div className="h-4 w-24 bg-surface rounded mb-3"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-surface rounded-full"></div>
                <div className="h-4 w-24 bg-surface rounded"></div>
              </div>
              <div className="h-6 w-8 bg-surface rounded"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-surface rounded"></div>
                <div className="w-8 h-8 bg-surface rounded-full"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-4 w-20 bg-surface rounded mb-1"></div>
              <div className="h-3 w-16 bg-surface rounded"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl bg-ink border border-border p-3">
              <div className="h-3 w-12 bg-surface rounded mx-auto mb-2"></div>
              <div className="h-6 w-16 bg-surface rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "table" || type === "form") {
    return (
      <div className="rounded-xl bg-ink border border-border p-4 animate-pulse">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-6 h-4 bg-surface rounded"></div>
              <div className="w-6 h-6 bg-surface rounded-full"></div>
              <div className="flex-1 h-4 bg-surface rounded"></div>
              <div className="w-12 h-4 bg-surface rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2 text-text-muted">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}

// ==================== COMMON COMPONENTS ====================

function EmptyState({ icon, message, submessage }) {
  return (
    <div className="rounded-xl bg-ink border border-border p-8 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-text-primary font-medium">{message}</p>
      {submessage && <p className="text-xs text-text-muted mt-1">{submessage}</p>}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl bg-ink border border-danger/30 p-8 text-center">
      <div className="text-3xl mb-2">⚠️</div>
      <p className="text-text-primary font-medium">{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 px-4 py-1.5 bg-accent text-ink rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

function TeamLogo({ logo, name, size = "w-8 h-8" }) {
  const [hasError, setHasError] = useState(false);
  
  if (!logo || hasError) {
    const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "?";
    return (
      <div className={`${size} rounded-full bg-surface flex items-center justify-center text-xs font-bold text-text-muted`}>
        {initials}
      </div>
    );
  }
  
  return (
    <img 
      src={logo} 
      alt={name} 
      className={`${size} object-contain`}
      onError={() => setHasError(true)}
    />
  );
}

function FormBadges({ form, count = 5 }) {
  const results = form.slice(0, count).map(m => m.result).join("");
  if (!results) return <span className="text-text-muted text-xs">—</span>;
  
  return (
    <div className="flex gap-0.5">
      {results.split("").map((r, i) => (
        <span
          key={i}
          className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
            r === "W" ? "bg-success/20 text-success" :
            r === "D" ? "bg-warning/20 text-warning" :
            "bg-danger/20 text-danger"
          }`}
        >
          {r}
        </span>
      ))}
    </div>
  );
}

// ==================== TAB COMPONENTS ====================

function OverviewTab({ fixture, form, injuries, teamName }) {
  return (
    <div className="space-y-4">
      {/* Next Match */}
      {fixture ? (
        <div className="rounded-xl bg-gradient-to-br from-ink to-surface border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-text-muted font-medium">NEXT MATCH</span>
            {fixture.broadcast && (
              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                📺 {fixture.broadcast}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <TeamLogo logo={fixture.home.logo} name={fixture.home.name} size="w-10 h-10" />
              <div className="text-left">
                <div className="font-semibold text-text-primary">{fixture.home.name}</div>
                <div className="text-xs text-text-muted">Home</div>
              </div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl font-bold text-accent">VS</div>
              <div className="text-xs text-text-muted mt-1">
                {new Date(fixture.date).toLocaleDateString("en-GB", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="text-right">
                <div className="font-semibold text-text-primary">{fixture.away.name}</div>
                <div className="text-xs text-text-muted">Away</div>
              </div>
              <TeamLogo logo={fixture.away.logo} name={fixture.away.name} size="w-10 h-10" />
            </div>
          </div>
          {fixture.venue && (
            <div className="text-center text-xs text-text-muted mt-3 pt-3 border-t border-border/50">
              📍 {fixture.venue}
            </div>
          )}
        </div>
      ) : (
        <EmptyState icon="📅" message="No upcoming games scheduled" submessage="Check back later for fixture updates" />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-ink border border-border p-3 text-center">
          <div className="text-xs text-text-muted mb-2">Recent Form</div>
          <div className="flex justify-center">
            <FormBadges form={form} />
          </div>
        </div>
        <div className="rounded-xl bg-ink border border-border p-3 text-center">
          <div className="text-xs text-text-muted mb-2">Injuries</div>
          <div className={`text-xl font-bold ${injuries.length > 0 ? "text-danger" : "text-success"}`}>
            {injuries.length > 0 ? injuries.length : "✓"}
          </div>
          <div className="text-[10px] text-text-muted">
            {injuries.length > 0 ? "players out" : "full squad"}
          </div>
        </div>
        <div className="rounded-xl bg-ink border border-border p-3 text-center">
          <div className="text-xs text-text-muted mb-2">Last Result</div>
          {form[0] ? (
            <>
              <div className="text-xl font-bold font-mono">
                {form[0].homeGoals} - {form[0].awayGoals}
              </div>
              <div className={`text-[10px] font-medium ${
                form[0].result === "W" ? "text-success" : form[0].result === "D" ? "text-warning" : "text-danger"
              }`}>
                {form[0].result === "W" ? "WIN" : form[0].result === "D" ? "DRAW" : "LOSS"}
              </div>
            </>
          ) : (
            <div className="text-text-muted text-sm">—</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreboardTab({ games, league }) {
  if (!games || games.length === 0) {
    return <EmptyState icon="📺" message="No games today" submessage={`Check back on game day for live ${league} scores`} />;
  }

  return (
    <div className="space-y-2">
      {games.map((game) => (
        <div 
          key={game.id} 
          className={`rounded-xl bg-ink border ${game.isLive ? "border-accent" : "border-border"} p-3`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
              game.isLive ? "bg-danger text-white animate-pulse" : 
              game.isComplete ? "bg-surface text-text-muted" : 
              "bg-accent/10 text-accent"
            }`}>
              {game.isLive ? `🔴 ${game.statusDetail || game.status}` : game.status}
            </span>
            {game.broadcast && (
              <span className="text-[10px] text-text-muted">{game.broadcast}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <TeamLogo logo={game.away.logo} name={game.away.name} size="w-6 h-6" />
              <div>
                <div className="text-sm font-medium text-text-primary">{game.away.abbreviation || game.away.name}</div>
                {game.away.record && <div className="text-[10px] text-text-muted">{game.away.record}</div>}
              </div>
            </div>
            <div className="text-center px-4 font-mono">
              <span className={`text-lg font-bold ${game.isComplete || game.isLive ? "text-text-primary" : "text-text-muted"}`}>
                {game.away.score}
              </span>
              <span className="text-text-muted mx-2">-</span>
              <span className={`text-lg font-bold ${game.isComplete || game.isLive ? "text-text-primary" : "text-text-muted"}`}>
                {game.home.score}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">{game.home.abbreviation || game.home.name}</div>
                {game.home.record && <div className="text-[10px] text-text-muted">{game.home.record}</div>}
              </div>
              <TeamLogo logo={game.home.logo} name={game.home.name} size="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FormTab({ form, teamName }) {
  if (!form || form.length === 0) {
    return <EmptyState icon="📈" message="No recent results" submessage="Results will appear after games are played" />;
  }

  return (
    <div className="rounded-xl bg-ink border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/50">
            <th className="text-left p-3 text-xs text-text-muted font-medium">Date</th>
            <th className="text-left p-3 text-xs text-text-muted font-medium">Match</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">Score</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">Result</th>
          </tr>
        </thead>
        <tbody>
          {form.map((match, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-surface/30 transition-colors">
              <td className="p-3 text-text-muted text-xs">
                {new Date(match.date).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <TeamLogo logo={match.homeLogo} name={match.home} size="w-5 h-5" />
                  <span className={match.home === teamName ? "text-accent font-medium" : "text-text-primary"}>
                    {match.home}
                  </span>
                  <span className="text-text-muted">vs</span>
                  <span className={match.away === teamName ? "text-accent font-medium" : "text-text-primary"}>
                    {match.away}
                  </span>
                  <TeamLogo logo={match.awayLogo} name={match.away} size="w-5 h-5" />
                </div>
              </td>
              <td className="p-3 text-center font-mono font-semibold">
                {match.homeGoals} - {match.awayGoals}
              </td>
              <td className="p-3 text-center">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  match.result === "W" ? "bg-success/20 text-success" :
                  match.result === "D" ? "bg-warning/20 text-warning" :
                  "bg-danger/20 text-danger"
                }`}>
                  {match.result === "W" ? "WIN" : match.result === "D" ? "DRAW" : "LOSS"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RosterTab({ roster, teamName, isSoccer }) {
  if (!roster || roster.length === 0) {
    return <EmptyState icon="👥" message="Roster unavailable" submessage="Unable to load roster data" />;
  }

  // Group by position
  const positions = {};
  roster.forEach(player => {
    const pos = player.positionName || player.position || "Other";
    if (!positions[pos]) positions[pos] = [];
    positions[pos].push(player);
  });

  return (
    <div className="space-y-4">
      {Object.entries(positions).map(([position, players]) => (
        <div key={position}>
          <div className="text-xs text-text-muted font-medium uppercase tracking-wider mb-2">
            {position} ({players.length})
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {players.map((player) => (
              <div 
                key={player.id || player.name}
                className="flex items-center gap-2 bg-ink border border-border rounded-lg p-2 hover:border-accent/50 transition-colors"
              >
                {player.headshot ? (
                  <img src={player.headshot} alt={player.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-xs font-bold text-text-muted">
                    {player.jersey || player.name?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{player.name}</div>
                  <div className="text-[10px] text-text-muted">
                    {player.jersey && `#${player.jersey}`} {player.position}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function H2HTab({ h2h, teamName, fixture }) {
  if (!h2h) {
    return <SkeletonLoader type="h2h" />;
  }

  if (h2h.matches.length === 0) {
    const opponent = fixture 
      ? (fixture.home.name === teamName ? fixture.away.name : fixture.home.name)
      : "opponent";
    return <EmptyState icon="⚔️" message="No head-to-head data" submessage={`No recent meetings between ${teamName} and ${opponent}`} />;
  }

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl bg-ink border border-border p-3 text-center">
          <div className="text-2xl font-bold text-success">{h2h.stats.wins}</div>
          <div className="text-xs text-text-muted">Wins</div>
        </div>
        <div className="rounded-xl bg-ink border border-border p-3 text-center">
          <div className="text-2xl font-bold text-warning">{h2h.stats.draws}</div>
          <div className="text-xs text-text-muted">Draws</div>
        </div>
        <div className="rounded-xl bg-ink border border-border p-3 text-center">
          <div className="text-2xl font-bold text-danger">{h2h.stats.losses}</div>
          <div className="text-xs text-text-muted">Losses</div>
        </div>
        <div className="rounded-xl bg-ink border border-border p-3 text-center">
          <div className="text-2xl font-bold text-accent">{h2h.stats.total}</div>
          <div className="text-xs text-text-muted">Total</div>
        </div>
      </div>

      {/* Match History */}
      <div className="rounded-xl bg-ink border border-border overflow-hidden">
        <div className="px-3 py-2 bg-surface/50 border-b border-border">
          <span className="text-xs text-text-muted font-medium">Recent Meetings</span>
        </div>
        <div className="divide-y divide-border/50">
          {h2h.matches.map((match, i) => (
            <div key={i} className="p-3 flex items-center justify-between hover:bg-surface/30 transition-colors">
              <div className="text-xs text-text-muted">
                {new Date(match.date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}
              </div>
              <div className="flex items-center gap-3">
                <span className={match.home === teamName ? "text-accent font-medium" : "text-text-primary"}>
                  {match.home}
                </span>
                <span className="font-mono font-bold px-2 py-0.5 bg-surface rounded">
                  {match.homeGoals} - {match.awayGoals}
                </span>
                <span className={match.away === teamName ? "text-accent font-medium" : "text-text-primary"}>
                  {match.away}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InjuriesTab({ injuries }) {
  if (!injuries || injuries.length === 0) {
    return (
      <EmptyState 
        icon="✅" 
        message="No injuries reported" 
        submessage="Full squad available for selection"
      />
    );
  }

  const statusColors = {
    "Out": "bg-danger/20 text-danger",
    "Doubtful": "bg-warning/20 text-warning",
    "Questionable": "bg-yellow-500/20 text-yellow-500",
    "Probable": "bg-success/20 text-success",
    "Day-To-Day": "bg-orange-500/20 text-orange-500",
  };

  return (
    <div className="rounded-xl bg-ink border border-border overflow-hidden">
      <div className="px-3 py-2 bg-danger/10 border-b border-border flex items-center gap-2">
        <span className="text-danger">🏥</span>
        <span className="text-xs text-danger font-medium">{injuries.length} player(s) injured</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/50">
            <th className="text-left p-3 text-xs text-text-muted font-medium">Player</th>
            <th className="text-left p-3 text-xs text-text-muted font-medium">Position</th>
            <th className="text-left p-3 text-xs text-text-muted font-medium">Status</th>
            <th className="text-left p-3 text-xs text-text-muted font-medium">Injury</th>
          </tr>
        </thead>
        <tbody>
          {injuries.map((injury, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-surface/30 transition-colors">
              <td className="p-3 font-medium text-text-primary">{injury.player}</td>
              <td className="p-3 text-text-muted text-xs">{injury.position || "—"}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[injury.type] || "bg-surface text-text-muted"}`}>
                  {injury.type}
                </span>
              </td>
              <td className="p-3 text-text-muted text-sm">{injury.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StandingsTab({ standings, teamName, isSoccer }) {
  if (!standings || standings.length === 0) {
    return <EmptyState icon="🏆" message="Standings unavailable" submessage="Unable to load league standings" />;
  }

  // Check if this is US sports (no draws, has win percentage)
  const hasDraws = standings.some(t => t.drawn > 0);
  const hasPoints = standings.some(t => t.points > 0);

  // Group by division for US sports
  const divisions = [...new Set(standings.map(t => t.division).filter(Boolean))];
  const hasDivisions = divisions.length > 1;

  if (isSoccer || hasDraws || hasPoints) {
    // Soccer-style standings
    return (
      <div className="rounded-xl bg-ink border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="text-center p-2 text-xs text-text-muted font-medium w-8">#</th>
              <th className="text-left p-2 text-xs text-text-muted font-medium">Team</th>
              <th className="text-center p-2 text-xs text-text-muted font-medium">P</th>
              <th className="text-center p-2 text-xs text-text-muted font-medium">W</th>
              <th className="text-center p-2 text-xs text-text-muted font-medium">D</th>
              <th className="text-center p-2 text-xs text-text-muted font-medium">L</th>
              <th className="text-center p-2 text-xs text-text-muted font-medium">GD</th>
              <th className="text-center p-2 text-xs text-text-muted font-medium font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, i) => (
              <tr 
                key={i} 
                className={`border-b border-border/50 last:border-0 transition-colors ${
                  team.name === teamName ? "bg-accent/10" : "hover:bg-surface/30"
                }`}
              >
                <td className="p-2 text-center">
                  <span className={`text-xs font-medium ${
                    team.rank <= 4 ? "text-success" : 
                    team.rank >= 18 ? "text-danger" : "text-text-muted"
                  }`}>
                    {team.rank || i + 1}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <TeamLogo logo={team.logo} name={team.name} size="w-5 h-5" />
                    <span className={`text-sm ${team.name === teamName ? "text-accent font-medium" : "text-text-primary"}`}>
                      {team.name}
                    </span>
                  </div>
                </td>
                <td className="p-2 text-center text-text-muted text-xs">{team.played}</td>
                <td className="p-2 text-center text-success text-xs font-medium">{team.won}</td>
                <td className="p-2 text-center text-warning text-xs">{team.drawn}</td>
                <td className="p-2 text-center text-danger text-xs">{team.lost}</td>
                <td className="p-2 text-center text-text-muted text-xs">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                <td className="p-2 text-center font-bold text-text-primary">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // US Sports standings (W-L, PCT)
  if (hasDivisions) {
    return (
      <div className="space-y-4">
        {divisions.map(division => {
          const divTeams = standings.filter(t => t.division === division);
          return (
            <div key={division} className="rounded-xl bg-ink border border-border overflow-hidden">
              <div className="px-3 py-2 bg-surface border-b border-border">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{division}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 text-xs text-text-muted font-medium">Team</th>
                    <th className="text-center p-2 text-xs text-text-muted font-medium">W</th>
                    <th className="text-center p-2 text-xs text-text-muted font-medium">L</th>
                    <th className="text-center p-2 text-xs text-text-muted font-medium">PCT</th>
                    <th className="text-center p-2 text-xs text-text-muted font-medium">STRK</th>
                  </tr>
                </thead>
                <tbody>
                  {divTeams.map((team, i) => (
                    <tr 
                      key={i} 
                      className={`border-b border-border/50 last:border-0 ${
                        team.name === teamName ? "bg-accent/10" : "hover:bg-surface/30"
                      }`}
                    >
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <TeamLogo logo={team.logo} name={team.name} size="w-5 h-5" />
                          <span className={team.name === teamName ? "text-accent font-medium" : "text-text-primary"}>
                            {team.abbreviation || team.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-center text-success font-medium">{team.won}</td>
                      <td className="p-2 text-center text-danger">{team.lost}</td>
                      <td className="p-2 text-center font-mono font-medium">
                        {team.winPct ? (team.winPct * 1).toFixed(3).replace(/^0/, '') : '.000'}
                      </td>
                      <td className="p-2 text-center">
                        {team.streak ? (
                          <span className={`text-xs font-medium ${
                            String(team.streak).startsWith('W') ? 'text-success' : 
                            String(team.streak).startsWith('L') ? 'text-danger' : 'text-text-muted'
                          }`}>
                            {team.streak}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  }

  // Single conference/league standings
  return (
    <div className="rounded-xl bg-ink border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/50">
            <th className="text-center p-2 text-xs text-text-muted font-medium w-8">#</th>
            <th className="text-left p-2 text-xs text-text-muted font-medium">Team</th>
            <th className="text-center p-2 text-xs text-text-muted font-medium">W</th>
            <th className="text-center p-2 text-xs text-text-muted font-medium">L</th>
            <th className="text-center p-2 text-xs text-text-muted font-medium">PCT</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, i) => (
            <tr 
              key={i} 
              className={`border-b border-border/50 last:border-0 ${
                team.name === teamName ? "bg-accent/10" : "hover:bg-surface/30"
              }`}
            >
              <td className="p-2 text-center text-text-muted text-xs">{i + 1}</td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <TeamLogo logo={team.logo} name={team.name} size="w-5 h-5" />
                  <span className={team.name === teamName ? "text-accent font-medium" : "text-text-primary"}>
                    {team.name}
                  </span>
                </div>
              </td>
              <td className="p-2 text-center text-success font-medium">{team.won}</td>
              <td className="p-2 text-center text-danger">{team.lost}</td>
              <td className="p-2 text-center font-mono font-medium">
                {team.winPct ? (team.winPct * 1).toFixed(3).replace(/^0/, '') : '.000'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
