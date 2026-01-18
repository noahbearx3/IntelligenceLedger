import { useState, useEffect } from "react";
import {
  getNextFixture,
  getTeamForm,
  getLineup,
  getH2H,
  getInjuries,
  getStandings,
  hasApiKey,
  TEAM_IDS,
  getApiCallCount,
} from "../services/matchDataApi";

/**
 * Match Intel Section
 * Displays fixture, form, lineups, H2H, injuries for a team
 */
export default function MatchIntelSection({ teamName, league }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    fixture: null,
    form: [],
    lineup: [],
    h2h: null,
    injuries: [],
    standings: [],
  });

  const hasTeamId = !!TEAM_IDS[teamName];

  useEffect(() => {
    if (!teamName) return;
    
    setLoading(true);
    setActiveTab("overview");
    
    // Load data
    loadData();
  }, [teamName]);

  const loadData = async () => {
    try {
      const [fixture, form, injuries] = await Promise.all([
        getNextFixture(teamName),
        getTeamForm(teamName),
        getInjuries(teamName),
      ]);
      
      setData(prev => ({ ...prev, fixture, form, injuries }));
    } catch (err) {
      console.error("Error loading match data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Lazy load H2H when tab is selected
  const loadH2H = async () => {
    if (data.h2h) return;
    if (!data.fixture) return;
    
    const opponent = data.fixture.home.name === teamName 
      ? data.fixture.away.name 
      : data.fixture.home.name;
    
    const h2h = await getH2H(teamName, opponent);
    setData(prev => ({ ...prev, h2h }));
  };

  // Lazy load lineup when tab is selected
  const loadLineup = async () => {
    if (data.lineup.length > 0) return;
    if (!data.fixture) return;
    
    const lineup = await getLineup(data.fixture.id);
    setData(prev => ({ ...prev, lineup }));
  };

  // Lazy load standings when tab is selected
  const loadStandings = async () => {
    if (data.standings.length > 0) return;
    
    const standings = await getStandings(league);
    setData(prev => ({ ...prev, standings }));
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "form", label: "Form", icon: "📈" },
    { id: "lineup", label: "Lineup", icon: "👥" },
    { id: "h2h", label: "H2H", icon: "⚔️" },
    { id: "injuries", label: "Injuries", icon: "🏥" },
    { id: "table", label: "Table", icon: "🏆" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "h2h") loadH2H();
    if (tabId === "lineup") loadLineup();
    if (tabId === "table") loadStandings();
  };

  if (!teamName) {
    return (
      <div className="rounded-xl bg-ink border border-border p-6 text-center">
        <p className="text-text-muted">Select a team to see match intel</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
          <span className="text-accent">⚽</span> Match Intel
          {!hasApiKey ? (
            <span className="text-[10px] bg-warning/20 text-warning px-1.5 py-0.5 rounded">
              Demo Data
            </span>
          ) : (
            <span className="text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded" title="API calls cached for 10 min">
              Live • {getApiCallCount()} calls
            </span>
          )}
        </h3>
        <a
          href={`https://www.flashscore.com/team/${teamName.toLowerCase().replace(/\s+/g, "-")}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline"
        >
          Flashscore →
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-ink p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-accent text-ink"
                : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {activeTab === "overview" && (
              <OverviewTab fixture={data.fixture} form={data.form} injuries={data.injuries} teamName={teamName} />
            )}
            {activeTab === "form" && <FormTab form={data.form} teamName={teamName} />}
            {activeTab === "lineup" && <LineupTab lineup={data.lineup} />}
            {activeTab === "h2h" && <H2HTab h2h={data.h2h} teamName={teamName} />}
            {activeTab === "injuries" && <InjuriesTab injuries={data.injuries} />}
            {activeTab === "table" && <StandingsTab standings={data.standings} teamName={teamName} />}
          </>
        )}
      </div>
    </div>
  );
}

// Loading Spinner
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2 text-text-muted">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm">Loading intel...</span>
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab({ fixture, form, injuries, teamName }) {
  const formString = form.slice(0, 5).map(m => m.result).join("");
  
  return (
    <div className="space-y-4">
      {/* Next Match Card */}
      {fixture && (
        <div className="rounded-xl bg-ink border border-border p-4">
          <div className="text-xs text-text-muted mb-2">Next Match</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="font-semibold text-text-primary">{fixture.home.name}</div>
              </div>
              <div className="text-xl font-bold text-text-muted">vs</div>
              <div className="text-center">
                <div className="font-semibold text-text-primary">{fixture.away.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-primary">
                {new Date(fixture.date).toLocaleDateString("en-GB", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-xs text-text-muted">{fixture.venue}</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Form */}
        <div className="rounded-xl bg-ink border border-border p-3 text-center">
          <div className="text-xs text-text-muted mb-1">Form</div>
          <div className="flex justify-center gap-1">
            {formString.split("").map((r, i) => (
              <span
                key={i}
                className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                  r === "W" ? "bg-success/20 text-success" :
                  r === "D" ? "bg-warning/20 text-warning" :
                  "bg-danger/20 text-danger"
                }`}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Injuries */}
        <div className="rounded-xl bg-ink border border-border p-3 text-center">
          <div className="text-xs text-text-muted mb-1">Injuries</div>
          <div className="text-xl font-bold text-danger">{injuries.length}</div>
        </div>

        {/* Last Result */}
        {form[0] && (
          <div className="rounded-xl bg-ink border border-border p-3 text-center">
            <div className="text-xs text-text-muted mb-1">Last Result</div>
            <div className="text-sm font-semibold">
              {form[0].homeGoals} - {form[0].awayGoals}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Form Tab
function FormTab({ form, teamName }) {
  return (
    <div className="rounded-xl bg-ink border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-xs text-text-muted font-medium">Date</th>
            <th className="text-left p-3 text-xs text-text-muted font-medium">Match</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">Score</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">Result</th>
          </tr>
        </thead>
        <tbody>
          {form.map((match, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className="p-3 text-text-muted text-xs">
                {new Date(match.date).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
              </td>
              <td className="p-3">
                <span className={match.home === teamName ? "text-accent font-medium" : "text-text-primary"}>
                  {match.home}
                </span>
                <span className="text-text-muted mx-2">vs</span>
                <span className={match.away === teamName ? "text-accent font-medium" : "text-text-primary"}>
                  {match.away}
                </span>
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
                  {match.result}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Lineup Tab
function LineupTab({ lineup }) {
  if (!lineup || lineup.length === 0) {
    return (
      <div className="rounded-xl bg-ink border border-border p-6 text-center">
        <p className="text-text-muted">💡 Lineups available ~1 hour before kickoff</p>
      </div>
    );
  }

  const team = lineup[0];

  return (
    <div className="rounded-xl bg-ink border border-border p-4 space-y-4">
      {/* Formation */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-text-primary">{team.team}</div>
          <div className="text-xs text-text-muted">Coach: {team.coach}</div>
        </div>
        <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-bold">
          {team.formation}
        </div>
      </div>

      {/* Starting XI */}
      <div>
        <div className="text-xs text-text-muted mb-2">Starting XI</div>
        <div className="grid grid-cols-2 gap-2">
          {team.startXI.map((player, i) => (
            <div key={i} className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2">
              <span className="text-xs font-mono text-accent">{player.number}</span>
              <span className="text-sm text-text-primary">{player.name}</span>
              <span className="text-xs text-text-muted ml-auto">{player.pos}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subs */}
      <div>
        <div className="text-xs text-text-muted mb-2">Substitutes</div>
        <div className="flex flex-wrap gap-2">
          {team.substitutes.map((player, i) => (
            <div key={i} className="bg-surface/50 rounded px-2 py-1 text-xs text-text-muted">
              {player.number} {player.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// H2H Tab
function H2HTab({ h2h, teamName }) {
  if (!h2h) {
    return <LoadingSpinner />;
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
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-xs text-text-muted font-medium">Date</th>
              <th className="text-left p-3 text-xs text-text-muted font-medium">Home</th>
              <th className="text-center p-3 text-xs text-text-muted font-medium">Score</th>
              <th className="text-right p-3 text-xs text-text-muted font-medium">Away</th>
            </tr>
          </thead>
          <tbody>
            {h2h.matches.map((match, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="p-3 text-text-muted text-xs">
                  {new Date(match.date).toLocaleDateString("en-GB")}
                </td>
                <td className={`p-3 ${match.home === teamName ? "text-accent font-medium" : "text-text-primary"}`}>
                  {match.home}
                </td>
                <td className="p-3 text-center font-mono font-semibold">
                  {match.homeGoals} - {match.awayGoals}
                </td>
                <td className={`p-3 text-right ${match.away === teamName ? "text-accent font-medium" : "text-text-primary"}`}>
                  {match.away}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Injuries Tab
function InjuriesTab({ injuries }) {
  if (!injuries || injuries.length === 0) {
    return (
      <div className="rounded-xl bg-ink border border-border p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <p className="text-text-primary font-medium">No injuries reported</p>
        <p className="text-xs text-text-muted">Full squad available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-ink border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-xs text-text-muted font-medium">Player</th>
            <th className="text-left p-3 text-xs text-text-muted font-medium">Status</th>
            <th className="text-left p-3 text-xs text-text-muted font-medium">Reason</th>
          </tr>
        </thead>
        <tbody>
          {injuries.map((injury, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className="p-3 font-medium text-text-primary">{injury.player}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  injury.type === "Doubtful" 
                    ? "bg-warning/20 text-warning" 
                    : "bg-danger/20 text-danger"
                }`}>
                  {injury.type}
                </span>
              </td>
              <td className="p-3 text-text-muted">{injury.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Standings Tab
function StandingsTab({ standings, teamName }) {
  if (!standings || standings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="rounded-xl bg-ink border border-border overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-center p-3 text-xs text-text-muted font-medium w-8">#</th>
            <th className="text-left p-3 text-xs text-text-muted font-medium">Team</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">P</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">W</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">D</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">L</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">GD</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium font-bold">Pts</th>
            <th className="text-center p-3 text-xs text-text-muted font-medium">Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, i) => (
            <tr 
              key={i} 
              className={`border-b border-border/50 last:border-0 ${
                team.name === teamName ? "bg-accent/10" : ""
              }`}
            >
              <td className="p-3 text-center">
                <span className={`${
                  team.rank <= 4 ? "text-success" : 
                  team.rank >= 18 ? "text-danger" : "text-text-muted"
                }`}>
                  {team.rank}
                </span>
              </td>
              <td className={`p-3 ${team.name === teamName ? "text-accent font-medium" : "text-text-primary"}`}>
                {team.name}
              </td>
              <td className="p-3 text-center text-text-muted">{team.played}</td>
              <td className="p-3 text-center text-success">{team.won}</td>
              <td className="p-3 text-center text-warning">{team.drawn}</td>
              <td className="p-3 text-center text-danger">{team.lost}</td>
              <td className="p-3 text-center text-text-muted">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
              <td className="p-3 text-center font-bold text-text-primary">{team.points}</td>
              <td className="p-3">
                <div className="flex justify-center gap-0.5">
                  {team.form?.split("").slice(0, 5).map((r, j) => (
                    <span
                      key={j}
                      className={`w-4 h-4 rounded-sm text-[10px] font-bold flex items-center justify-center ${
                        r === "W" ? "bg-success/20 text-success" :
                        r === "D" ? "bg-warning/20 text-warning" :
                        "bg-danger/20 text-danger"
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
