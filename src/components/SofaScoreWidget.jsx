import { useState } from "react";

/**
 * SofaScore Widget Component
 * Embeds SofaScore widgets via iframe for live sports data
 * 
 * Widget types available:
 * - match: Match details, lineups, stats
 * - team: Team info, form, squad
 * - player: Player stats and info
 * - standings: League table
 * 
 * @see https://corporate.sofascore.com/widgets
 */

// SofaScore team IDs for common teams (we'll expand this)
export const SOFASCORE_TEAM_IDS = {
  // EPL
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
  "Inter Miami": 321748,
  "LA Galaxy": 7247,
  "LAFC": 298025,
  "Atlanta United": 232532,
  "Seattle Sounders": 7240,
  "Columbus Crew": 7244,
  
  // NFL (SofaScore has limited NFL coverage)
  "Buffalo Bills": 4356,
  "Kansas City Chiefs": 4346,
  "Philadelphia Eagles": 4366,
  "San Francisco 49ers": 4367,
  "Dallas Cowboys": 4352,
  "Miami Dolphins": 4357,
  
  // NBA
  "Los Angeles Lakers": 3433,
  "Boston Celtics": 3422,
  "Golden State Warriors": 3428,
  "Milwaukee Bucks": 3430,
  "Denver Nuggets": 3417,
  "Phoenix Suns": 3416,
};

// League IDs for standings
export const SOFASCORE_LEAGUE_IDS = {
  "EPL": 17,
  "La Liga": 8,
  "Bundesliga": 35,
  "Serie A": 23,
  "Ligue 1": 34,
  "MLS": 242,
  "NFL": 9464,
  "NBA": 132,
  "NHL": 234,
  "MLB": 11205,
};

/**
 * Get SofaScore widget URL
 */
export function getSofaScoreUrl(type, id, options = {}) {
  const baseUrl = "https://www.sofascore.com";
  const { theme = "dark", height = 400 } = options;
  
  switch (type) {
    case "team":
      return `${baseUrl}/team/football/${id}`;
    case "match":
      return `${baseUrl}/match/${id}`;
    case "player":
      return `${baseUrl}/player/${id}`;
    case "standings":
      return `${baseUrl}/tournament/football/${id}`;
    default:
      return baseUrl;
  }
}

/**
 * SofaScore Widget Embed Component
 */
export default function SofaScoreWidget({ 
  type = "team", 
  teamName,
  teamId,
  leagueId,
  matchId,
  playerId,
  height = 400,
  className = ""
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Resolve ID from team name if not provided
  const resolvedId = teamId || SOFASCORE_TEAM_IDS[teamName] || leagueId || matchId || playerId;

  if (!resolvedId) {
    return (
      <div className={`rounded-xl bg-ink border border-border p-4 ${className}`}>
        <p className="text-sm text-text-muted text-center">
          ⚽ SofaScore data not available for this team
        </p>
      </div>
    );
  }

  // Build the embed URL based on type
  let embedUrl = "";
  switch (type) {
    case "team":
      embedUrl = `https://widgets.sofascore.com/embed/team/${resolvedId}?theme=dark&widgetType=teamOverview`;
      break;
    case "standings":
      embedUrl = `https://widgets.sofascore.com/embed/tournament/${resolvedId}/standings?theme=dark`;
      break;
    case "match":
      embedUrl = `https://widgets.sofascore.com/embed/match/${resolvedId}?theme=dark`;
      break;
    case "player":
      embedUrl = `https://widgets.sofascore.com/embed/player/${resolvedId}?theme=dark`;
      break;
    case "teamMatches":
      embedUrl = `https://widgets.sofascore.com/embed/team/${resolvedId}/matches?theme=dark`;
      break;
    case "teamForm":
      embedUrl = `https://widgets.sofascore.com/embed/team/${resolvedId}?theme=dark&widgetType=form`;
      break;
    default:
      embedUrl = `https://widgets.sofascore.com/embed/team/${resolvedId}?theme=dark`;
  }

  return (
    <div className={`rounded-xl overflow-hidden bg-ink border border-border ${className}`}>
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-text-muted">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm">Loading SofaScore data...</span>
          </div>
        </div>
      )}
      
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        scrolling="no"
        style={{ 
          display: loading ? 'none' : 'block',
          background: 'transparent',
          borderRadius: '12px'
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        title={`SofaScore ${type} widget`}
        allow="autoplay; encrypted-media"
      />
      
      {error && (
        <div className="p-4 text-center">
          <p className="text-sm text-text-muted">
            ⚠️ Unable to load SofaScore widget
          </p>
          <a 
            href={getSofaScoreUrl(type, resolvedId)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline mt-2 inline-block"
          >
            View on SofaScore →
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Team Form Component - Shows last 5 results
 */
export function TeamFormWidget({ teamName, className = "" }) {
  const teamId = SOFASCORE_TEAM_IDS[teamName];
  
  if (!teamId) {
    return null;
  }

  return (
    <SofaScoreWidget 
      type="teamForm" 
      teamId={teamId} 
      height={200}
      className={className}
    />
  );
}

/**
 * Team Matches Widget - Shows upcoming/recent matches
 */
export function TeamMatchesWidget({ teamName, className = "" }) {
  const teamId = SOFASCORE_TEAM_IDS[teamName];
  
  if (!teamId) {
    return null;
  }

  return (
    <SofaScoreWidget 
      type="teamMatches" 
      teamId={teamId} 
      height={350}
      className={className}
    />
  );
}

/**
 * League Standings Widget
 */
export function StandingsWidget({ league, className = "" }) {
  const leagueId = SOFASCORE_LEAGUE_IDS[league];
  
  if (!leagueId) {
    return null;
  }

  return (
    <SofaScoreWidget 
      type="standings" 
      leagueId={leagueId} 
      height={500}
      className={className}
    />
  );
}
