# PRD: SofaScore Widgets Integration

## Introduction/Overview

Integrate SofaScore widgets and data into The Intelligence Ledger to provide bettors with comprehensive match intelligence including lineups, head-to-head history, live match events, injuries, and team form. This enhances the platform's value proposition by giving users all the data they need to make informed betting decisions in one place.

SofaScore provides embeddable widgets that can be quickly integrated, offering rich sports data across football (soccer), NFL, NBA, NHL, MLB, and other sports we support.

## Goals

- Provide live and pre-match data for all supported sports
- Display lineups, formations, and predicted lineups
- Show head-to-head history and recent form
- Surface injury and suspension information
- Enable live match tracking with events and stats
- Integrate seamlessly with existing Team/Player DNA section
- Inform betting decisions in the Post Pick flow

## User Stories

### US-001: Research SofaScore Widget Options
**Description:** As a developer, I need to understand available SofaScore widget types and integration methods so I can plan the implementation.

**Acceptance Criteria:**
- [ ] Document available SofaScore embed widgets (match, team, player, league)
- [ ] Identify widget URLs and parameters
- [ ] Note any rate limits or usage restrictions
- [ ] Determine which widgets work for each sport (football, NFL, NBA, NHL, MLB)
- [ ] Create a brief technical spec in this file or a separate doc

### US-002: Add Match Widget to Team DNA Section
**Description:** As a user, I want to see upcoming/live matches for a selected team so I can quickly assess their schedule and current games.

**Acceptance Criteria:**
- [ ] When a team is selected, display SofaScore match widget
- [ ] Show next upcoming match or current live match
- [ ] Widget displays: teams, time/score, venue
- [ ] Fallback message if no widget available for sport/team
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-003: Add Lineup Widget
**Description:** As a user, I want to see team lineups and formations so I can assess team strength before betting.

**Acceptance Criteria:**
- [ ] Display lineup widget when viewing a specific match
- [ ] Show starting XI with formation (football)
- [ ] Show projected/confirmed lineups for other sports where applicable
- [ ] Include player positions and jersey numbers
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-004: Add Head-to-Head Widget
**Description:** As a user, I want to see head-to-head history between two teams so I can identify patterns and trends.

**Acceptance Criteria:**
- [ ] Display H2H widget showing last 5-10 meetings
- [ ] Show win/draw/loss record for each team
- [ ] Display scores from previous matches
- [ ] Accessible from Team DNA section when a match is selected
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-005: Add Team Form Widget
**Description:** As a user, I want to see a team's recent form (last 5 games) so I can assess momentum.

**Acceptance Criteria:**
- [ ] Display form indicator (W/D/L icons for last 5 games)
- [ ] Show in Team DNA section for selected team
- [ ] Include home/away form breakdown if available
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-006: Add Injuries & Suspensions Display
**Description:** As a user, I want to see injured and suspended players so I know about key absences.

**Acceptance Criteria:**
- [ ] Display list of injured/suspended players for selected team
- [ ] Show injury type and expected return date if available
- [ ] Highlight key players (starters) who are out
- [ ] Update in real-time or on refresh
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-007: Create Match Center Page
**Description:** As a user, I want a dedicated page to view comprehensive match data so I can deep-dive into a specific game.

**Acceptance Criteria:**
- [ ] New route: `/match/:matchId` or modal view
- [ ] Display all widgets: lineups, H2H, form, stats, events
- [ ] Show match info: date, time, venue, competition
- [ ] Link to Match Center from Team DNA and Following Feed
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-008: Integrate Widgets in Post Pick Modal
**Description:** As a user, I want to see relevant match data when posting a pick so I can make informed decisions.

**Acceptance Criteria:**
- [ ] When selecting a game in Post Pick, show mini match preview
- [ ] Display: H2H summary, form for both teams, key injuries
- [ ] Collapsible section to not overwhelm the UI
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-009: Add Live Match Events Widget
**Description:** As a user, I want to see live match events (goals, cards, subs) so I can track games in real-time.

**Acceptance Criteria:**
- [ ] Display live event feed for in-progress matches
- [ ] Show: goals, assists, cards, substitutions, key events
- [ ] Auto-update or easy refresh mechanism
- [ ] Visual indicators for event types (goal icon, card icon, etc.)
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-010: Add Player Stats Widget
**Description:** As a user, I want to see individual player stats so I can evaluate player props.

**Acceptance Criteria:**
- [ ] Display player stats widget when a player is selected
- [ ] Show season stats: goals, assists, appearances (football)
- [ ] Sport-appropriate stats for NFL/NBA/NHL/MLB
- [ ] Useful for evaluating player prop bets
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Integrate SofaScore embed widgets using iframes or their embed codes
- FR-2: Create reusable `<SofaScoreWidget />` component with type prop (match, lineup, h2h, etc.)
- FR-3: Handle loading and error states gracefully
- FR-4: Support all current sports: NFL, NBA, NHL, MLB, EPL, La Liga, MLS
- FR-5: Map our team/player data to SofaScore IDs where needed
- FR-6: Widgets should be responsive and fit mobile layouts
- FR-7: Cache widget data where possible to reduce load times
- FR-8: Provide fallback UI when SofaScore doesn't support a team/match

## Non-Goals (Out of Scope)

- Building our own stats database (we're leveraging SofaScore)
- Live betting odds within widgets (we have The Odds API for that)
- Full SofaScore account integration or user auth
- Historical stats beyond what widgets provide
- Custom visualizations (using SofaScore's existing UI)

## Design Considerations

- **Widget Styling:** SofaScore widgets have their own styling; ensure they don't clash with our dark theme
- **Dark Mode:** Check if SofaScore offers dark theme widgets or use CSS filters if needed
- **Placement:** Widgets should feel native, not like foreign embeds
- **Loading:** Show skeleton loaders while widgets load
- **Mobile:** Ensure widgets are responsive or provide mobile-specific layouts

## Technical Considerations

- **Integration Method:** SofaScore provides embed widgets via iframe. Check their [widget documentation](https://www.sofascore.com/widgets)
- **Team/Player ID Mapping:** May need to map our ESPN-based team data to SofaScore IDs
- **Rate Limits:** Monitor usage if using API; iframes typically have no limits
- **Bundle Size:** Iframes don't affect bundle; API integration would need a service file
- **Caching:** Consider caching match data to reduce widget reloads

## Success Metrics

- Users spend more time on Team/Player DNA section
- Increase in picks posted (users have more confidence with data)
- Positive user feedback on data availability
- Widget load time < 2 seconds
- Works across all supported sports

## Open Questions

- Does SofaScore offer a dark theme for widgets?
- What SofaScore team/player IDs do we need to map?
- Are there any sports where SofaScore coverage is limited?
- Should we cache any data server-side for faster loads?
- Do we need a SofaScore API key, or are embeds free?

---

## Implementation Priority

**Phase 1 (MVP):**
- US-001: Research
- US-002: Match Widget
- US-005: Team Form

**Phase 2:**
- US-003: Lineups
- US-004: H2H
- US-006: Injuries

**Phase 3:**
- US-007: Match Center
- US-008: Post Pick Integration
- US-009: Live Events
- US-010: Player Stats
