# PRD: Match Intel Feature Overhaul

## Introduction

Complete overhaul of the Match Intel feature to provide reliable, production-ready sports data across all ESPN-supported sports. The current implementation is semi-functional with issues including null fixtures, broken logos, inconsistent data parsing, and missing features. This PRD addresses all gaps to create a fully functional, polished sports intelligence section.

## Goals

- Get all ESPN data sources working reliably (fixtures, form, standings, injuries, H2H, lineups)
- Support all ESPN sports (NFL, NBA, MLB, NHL, Soccer, College, UFC, Golf, F1, Tennis)
- Implement proper error handling, loading states, and caching
- Display team logos correctly with fallbacks for missing images
- Show "No data available" messages for missing data instead of mock data
- Create a polished, production-ready UI with better data visualization

## User Stories

### Phase 1: Core Data Reliability

#### US-001: Fix ESPN API Response Parsing
**Description:** As a user, I want to see accurate data from ESPN so that I can trust the information displayed.

**Acceptance Criteria:**
- [ ] Parse `nextFixture` correctly - handle null when no games scheduled
- [ ] Parse `form` (recent results) with actual scores, not 0-0
- [ ] Parse `standings` correctly for all league types (US sports vs Soccer)
- [ ] Handle different data structures between sports (winPct for US, points for soccer)
- [ ] Add comprehensive console logging for debugging
- [ ] Typecheck passes

#### US-002: Implement Proper Error States
**Description:** As a user, I want to see clear messages when data is unavailable so I'm not confused by empty sections.

**Acceptance Criteria:**
- [ ] Show "No upcoming games scheduled" when nextFixture is null
- [ ] Show "No recent results" when form array is empty
- [ ] Show "Standings unavailable" when standings fail to load
- [ ] Display error messages with appropriate styling (not red/alarming, just informative)
- [ ] Remove all mock data fallbacks - show real state instead
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-003: Fix Team Logo Loading
**Description:** As a user, I want to see team logos without broken image errors.

**Acceptance Criteria:**
- [ ] Use ESPN logo URLs directly from API response
- [ ] Implement `onError` fallback to placeholder/initials
- [ ] Add CSS to hide broken images gracefully
- [ ] Test logos for NFL, NBA, MLB, NHL, and Soccer teams
- [ ] No 404 errors in console for team logos
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-004: Implement Request Caching
**Description:** As a developer, I want API responses cached to reduce load and improve performance.

**Acceptance Criteria:**
- [ ] Cache all API responses for 5 minutes
- [ ] Show cache hit/miss in console logs
- [ ] Invalidate cache on manual refresh
- [ ] Store cache in memory (Map) with TTL
- [ ] Display "Last updated: X minutes ago" in UI
- [ ] Typecheck passes

### Phase 2: Expand Sports Coverage

#### US-005: Add All ESPN Sports Support
**Description:** As a user, I want to see data for any ESPN-supported sport, not just NFL/NBA/Soccer.

**Acceptance Criteria:**
- [ ] Add MLB teams and league mappings
- [ ] Add NHL teams and league mappings
- [ ] Add College Football (Top 25 teams)
- [ ] Add College Basketball (Top 25 teams)
- [ ] Add UFC event support
- [ ] Add F1 standings support
- [ ] Update `TEAM_IDS` in both API and frontend
- [ ] Typecheck passes

#### US-006: Sport-Specific Data Formatting
**Description:** As a user, I want data displayed appropriately for each sport's conventions.

**Acceptance Criteria:**
- [ ] NFL: Show W-L record, division standings, playoff picture
- [ ] NBA: Show W-L record, conference standings, streak
- [ ] MLB: Show W-L record, division standings, GB (games back)
- [ ] NHL: Show W-L-OTL record, points, conference standings
- [ ] Soccer: Show W-D-L, points, goal difference, form string
- [ ] UFC: Show upcoming fight cards, rankings
- [ ] F1: Show driver standings, constructor standings
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Phase 3: Enhanced Data Features

#### US-007: Add Live Scoreboard
**Description:** As a user, I want to see live/today's games for any league.

**Acceptance Criteria:**
- [ ] Create `/api/scrape` endpoint for `type: "scoreboard"`
- [ ] Display today's games with scores and status
- [ ] Show game time, venue, and broadcast info
- [ ] Auto-refresh every 60 seconds for live games
- [ ] Indicate game status: Scheduled, In Progress, Final
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-008: Add Head-to-Head Data
**Description:** As a user, I want to see historical matchup data between two teams.

**Acceptance Criteria:**
- [ ] Create `/api/scrape` endpoint for `type: "h2h"`
- [ ] Show last 5 meetings between teams
- [ ] Display win/loss/draw record for selected team
- [ ] Show venue and scores for each meeting
- [ ] Load H2H when fixture opponent is known
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-009: Add Injury Reports
**Description:** As a user, I want to see current team injuries to inform betting decisions.

**Acceptance Criteria:**
- [ ] Create `/api/scrape` endpoint for `type: "injuries"`
- [ ] Fetch from ESPN injury report endpoint
- [ ] Display player name, injury type, status (Out/Doubtful/Questionable)
- [ ] Show "No injuries reported" when list is empty
- [ ] Update injury data with team data fetch
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-010: Add Team Roster/Lineup
**Description:** As a user, I want to see team rosters and projected lineups.

**Acceptance Criteria:**
- [ ] Create `/api/scrape` endpoint for `type: "roster"`
- [ ] Fetch team roster from ESPN
- [ ] Display key players by position
- [ ] For soccer: Show probable starting XI when available
- [ ] For NFL: Show depth chart positions
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Phase 4: UI Polish

#### US-011: Redesign Match Intel Section
**Description:** As a user, I want a visually polished Match Intel section that's easy to scan.

**Acceptance Criteria:**
- [ ] Create tabbed interface: Overview | Form | Standings | H2H | Injuries
- [ ] Add team logos next to team names
- [ ] Use consistent color coding for W/D/L
- [ ] Add loading skeletons during data fetch
- [ ] Responsive design for mobile
- [ ] Smooth tab transitions
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-012: Add Loading States
**Description:** As a user, I want visual feedback while data is loading.

**Acceptance Criteria:**
- [ ] Show skeleton loaders for each data section
- [ ] Display spinner for initial load
- [ ] Show "Refreshing..." indicator for background updates
- [ ] Disable interactions while loading
- [ ] Animate transitions between loading and loaded states
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-013: Improve Standings Display
**Description:** As a user, I want standings that are easy to read and highlight my selected team.

**Acceptance Criteria:**
- [ ] Display full league table (top 20 teams)
- [ ] Highlight selected team row with accent color
- [ ] Show team logos in standings table
- [ ] Add form column (last 5 results as W/D/L badges)
- [ ] Show promotion/relegation zones for soccer
- [ ] Show playoff line for US sports
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: All API calls must go through `/api/scrape` serverless function
- FR-2: ESPN API responses must be parsed consistently across all sports
- FR-3: All team/league data must be fetched from ESPN, not hardcoded
- FR-4: Cache TTL must be configurable (default 5 minutes)
- FR-5: Error states must be user-friendly, not technical
- FR-6: Loading states must appear within 100ms of request start
- FR-7: Team logos must have fallback to team initials/placeholder
- FR-8: Form results must show actual scores, not placeholders
- FR-9: Standings must be sorted correctly for each sport type
- FR-10: Live scores must auto-refresh without full page reload

## Non-Goals

- No user accounts or personalization
- No push notifications for game updates
- No betting integration (odds display is separate feature)
- No historical data beyond current season
- No fantasy sports integration
- No video highlights or media embeds

## Technical Considerations

### ESPN API Endpoints to Use
```
# Scoreboard (live/today's games)
https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/scoreboard

# Team Schedule
https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/teams/{id}/schedule

# Standings
https://site.api.espn.com/apis/v2/sports/{sport}/{league}/standings

# Team Roster
https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/teams/{id}/roster

# News
https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/news
```

### League Codes
| Sport | League Code |
|-------|-------------|
| NFL | `football/nfl` |
| NBA | `basketball/nba` |
| MLB | `baseball/mlb` |
| NHL | `hockey/nhl` |
| College Football | `football/college-football` |
| College Basketball | `basketball/mens-college-basketball` |
| Premier League | `soccer/eng.1` |
| La Liga | `soccer/esp.1` |
| MLS | `soccer/usa.1` |
| Champions League | `soccer/uefa.champions` |
| UFC | `mma/ufc` |
| F1 | `racing/f1` |

### Caching Strategy
- In-memory cache with Map()
- 5-minute TTL for most data
- 1-minute TTL for live scoreboards
- Cache key format: `{type}:{sport}:{league}:{teamId}`

### Error Handling
- Network errors: Show "Unable to load data. Check connection."
- API errors: Show "Data temporarily unavailable."
- Empty responses: Show sport-specific "No data" message
- Never show raw error messages to users

## Success Metrics

- All ESPN sports return valid data (no null/empty when data exists)
- Zero 404 errors for team logos in console
- Data loads within 2 seconds (cached: <100ms)
- All loading states appear within 100ms
- No mock data shown to users
- Works on mobile viewports

## Open Questions

- Should we add team news/headlines to Match Intel?
- Should standings show full league or just top/bottom 10?
- Should we add a "Refresh" button or rely on auto-refresh only?
- Should H2H show all-time or just recent seasons?
