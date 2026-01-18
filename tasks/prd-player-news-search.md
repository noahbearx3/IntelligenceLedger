# PRD: Player News Search

## Introduction

Add a contextual news search feature within the Team/Player DNA tab that aggregates news from multiple sources (RSS, X/Twitter, Reddit, sports APIs) and displays results as a searchable, chronological feed. This helps users like Bob quickly find all relevant news about a specific player without jumping between platforms.

## Goals

- Aggregate player-related news from RSS feeds, social media, and sports APIs into one view
- Display results with headlines, snippet previews, and source tags
- Present results chronologically (newest first)
- Keep the feature simple and focused for v1 (no advanced filters)
- Reduce Bob's research time by eliminating multi-platform context switching

## User Stories

### US-001: Create news search input in Player DNA tab
**Description:** As a user, I want a search input in the Player DNA tab so I can search for news about the selected player.

**Acceptance Criteria:**
- [ ] Search input appears in the Team/Player DNA section when a player/team is selected
- [ ] Placeholder text: "Search news for [Player/Team Name]..."
- [ ] Search triggers on Enter key or search button click
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-002: Display news results with headline, snippet, and source
**Description:** As a user, I want to see search results that show the headline, a preview snippet, and the source so I can quickly scan relevant news.

**Acceptance Criteria:**
- [ ] Each result card shows: headline (clickable), snippet (2-3 lines), source tag, timestamp
- [ ] Source tags are color-coded: RSS (blue), Twitter (sky), Reddit (orange), API (green)
- [ ] Clicking headline opens source in new tab
- [ ] Results appear in chronological order (newest first)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: Show loading and empty states
**Description:** As a user, I want clear feedback when searching so I know the system is working.

**Acceptance Criteria:**
- [ ] Loading spinner appears while fetching results
- [ ] Empty state message when no results: "No news found for [query]. Try a different search."
- [ ] Error state if fetch fails: "Unable to load news. Please try again."
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-004: Mock news data for beta
**Description:** As a developer, I need mock news data to demonstrate the feature before real API integration.

**Acceptance Criteria:**
- [ ] Create mock news dataset with 10-15 sample articles for Bills, Dolphins, Chiefs, Eagles
- [ ] Mock data includes variety of sources (RSS, Twitter, Reddit, ESPN)
- [ ] Search filters mock data by player/team name match in headline or snippet
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Add search input component to Team/Player DNA section
- FR-2: Search filters news by player/team name (case-insensitive match in headline or snippet)
- FR-3: Display results as cards with headline, snippet (max 150 chars), source tag, and relative timestamp
- FR-4: Sort results by date descending (newest first)
- FR-5: Source tags use distinct colors for quick visual identification
- FR-6: Headlines link to original source (opens in new tab)
- FR-7: Show appropriate loading, empty, and error states

## Non-Goals (Out of Scope for v1)

- No date range filters
- No source type filters (RSS vs Twitter vs Reddit)
- No sentiment filtering
- No saved searches or search history
- No real API integration (mock data only for beta)
- No infinite scroll or pagination (show top 20 results)

## Design Considerations

- Search input should feel integrated into the existing DNA tab, not a separate page
- Results cards should match the existing card styling (border-border, bg-card, rounded-xl)
- Source tag pills should be small and unobtrusive but clearly distinguishable
- Consider adding a subtle RSS icon, Twitter bird, Reddit alien, etc. to source tags

## Technical Considerations

- Use React state to manage search query and results
- Mock data stored in a constant array for now; structure it for easy API replacement later
- Search is client-side filtering of mock data (no backend needed for beta)
- Future: Replace mock data with real fetch calls to RSS parser, Twitter API, Reddit API

## Success Metrics

- User can find relevant player news in under 10 seconds
- Reduces need to open external apps (target: 0 external apps needed for basic news check)
- Search results feel fast (< 500ms for mock data filtering)

## Open Questions

- Should we add a "Refresh" button to re-fetch latest news?
- Should results highlight the matched search term in the snippet?
- Future: How do we handle rate limits on Twitter/Reddit APIs?
