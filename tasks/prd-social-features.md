# PRD: Social Features — Follow Analysts & Comments

## Introduction

Add a comprehensive social layer to Intelligence Ledger enabling users to follow analysts, engage with picks through comments and reactions, and build community trust. This transforms the platform from a solo research tool into a social intelligence network where verified analysts can build followings and users can discover winning strategies through social proof.

## Goals

- Enable users to discover and follow high-performing analysts
- Create engagement through discussions on picks
- Build trust via community validation and social proof
- Lay foundation for future monetization (analyst subscriptions/tips)
- Increase retention through social stickiness (following, notifications)

## Design Direction

### Social Philosophy
**"Followers only" commenting** — Users must follow an analyst to comment on their picks. This creates:
- Intentional communities around each analyst
- Reduced spam/trolling
- Incentive to follow (access to discussion)
- Analysts can build engaged audiences

### Key Metrics to Display
- Follower count
- Win rate (last 30/90 days)
- ROI percentage
- Current streak
- Specialty tags (NFL, NBA, Props, etc.)
- Endorsements from other verified analysts

---

## User Stories

### US-001: Analyst profile page
**Description:** As a user, I want to view an analyst's full profile so I can decide whether to follow them.

**Acceptance Criteria:**
- [ ] Profile page at `/analyst/[username]`
- [ ] Display: avatar, name, bio, join date
- [ ] Stats card: follower count, win rate, ROI, total picks, current streak
- [ ] Specialty tags (auto-generated from pick history)
- [ ] "Follow" / "Unfollow" button
- [ ] Endorsements section (other analysts who vouch for them)
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-002: Follow/unfollow functionality
**Description:** As a user, I want to follow analysts so their picks appear in my feed.

**Acceptance Criteria:**
- [ ] Follow button on analyst profile and pick cards
- [ ] Unfollow confirmation modal ("You'll lose access to comment on their picks")
- [ ] Following state persists (local storage for MVP, database later)
- [ ] Follower count updates in real-time (optimistic UI)
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-003: Following feed
**Description:** As a user, I want a feed showing picks from analysts I follow.

**Acceptance Criteria:**
- [ ] "Following" tab in main feed
- [ ] Shows picks from followed analysts, newest first
- [ ] Each pick shows: analyst avatar/name, pick details, timestamp, comment count
- [ ] Empty state: "Follow analysts to see their picks here"
- [ ] Infinite scroll or "Load more" pagination
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-004: Comment on picks (followers only)
**Description:** As a follower, I want to comment on an analyst's picks to discuss strategy.

**Acceptance Criteria:**
- [ ] Comment input appears on pick detail (only if following)
- [ ] Non-followers see "Follow to join discussion" prompt
- [ ] Comments support markdown (bold, italic, links)
- [ ] Character limit: 500
- [ ] Comments appear instantly (optimistic UI)
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-005: Threaded replies
**Description:** As a user, I want to reply to specific comments to have focused discussions.

**Acceptance Criteria:**
- [ ] "Reply" button on each comment
- [ ] Replies indented under parent comment
- [ ] Max 2 levels of nesting (reply to reply flattens)
- [ ] Collapse/expand thread functionality
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-006: Upvote comments
**Description:** As a user, I want to upvote helpful comments so the best insights rise to the top.

**Acceptance Criteria:**
- [ ] Upvote button (▲) on each comment
- [ ] Vote count displayed
- [ ] User can only upvote once per comment
- [ ] Toggle: click again to remove upvote
- [ ] Comments sorted by upvotes (with recency tiebreaker)
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-007: Reactions on picks
**Description:** As a user, I want to react to picks with emojis for quick engagement.

**Acceptance Criteria:**
- [ ] Reaction bar under each pick: 🔥 (fire), 💰 (money), 🎯 (bullseye), 💀 (skull/fade), 🤔 (thinking)
- [ ] Click to add reaction, click again to remove
- [ ] Show count for each reaction
- [ ] Show "You and 12 others" tooltip on hover
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-008: Mentions (@username)
**Description:** As a user, I want to mention other users in comments to get their attention.

**Acceptance Criteria:**
- [ ] Type `@` to trigger username autocomplete
- [ ] Autocomplete searches followed analysts and recent commenters
- [ ] Mentioned username styled as link (gold color)
- [ ] Clicking mention navigates to profile
- [ ] Mentioned user receives notification
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-009: Quote picks
**Description:** As a user, I want to quote another pick in my comment for context.

**Acceptance Criteria:**
- [ ] "Quote" button on picks
- [ ] Inserts pick preview card into comment composer
- [ ] Quoted pick shows: analyst, pick text, odds, timestamp
- [ ] Quoted pick is clickable (navigates to original)
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-010: Notifications
**Description:** As a user, I want notifications when someone interacts with my content.

**Acceptance Criteria:**
- [ ] Notification bell icon in header
- [ ] Badge count for unread notifications
- [ ] Notification types: new follower, comment on your pick, reply to your comment, mention, upvote milestone (10, 50, 100)
- [ ] Notification dropdown with "Mark all read"
- [ ] Click notification navigates to relevant content
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-011: Analyst endorsements
**Description:** As a verified analyst, I want to endorse other analysts to signal trust.

**Acceptance Criteria:**
- [ ] "Endorse" button on analyst profiles (only for verified analysts)
- [ ] Endorsement shows endorser's name and win rate
- [ ] Max 5 endorsements displayed, "See all" expands
- [ ] Endorsement can be withdrawn
- [ ] Endorsed analysts get notification
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-012: Discover analysts page
**Description:** As a user, I want to discover new analysts to follow based on performance.

**Acceptance Criteria:**
- [ ] `/discover` page with analyst cards
- [ ] Filter by: league specialty, minimum win rate, minimum picks
- [ ] Sort by: follower count, win rate, ROI, recent hot streak
- [ ] "Rising" section: analysts with high recent performance + low followers
- [ ] "Verified" badge for analysts with 100+ picks
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

## Functional Requirements

- FR-1: Users must be logged in to follow, comment, react, or upvote
- FR-2: Following relationship stored with timestamp (for "Following since")
- FR-3: Comments are immutable (no edit, can only delete within 5 min)
- FR-4: Deleted comments show "[deleted]" placeholder to preserve thread structure
- FR-5: Analysts can disable comments on individual picks
- FR-6: Block functionality: users can block other users (hides their content)
- FR-7: Report functionality: flag comments for review
- FR-8: Rate limiting: max 10 comments per hour, max 100 follows per day

## Non-Goals (v1)

- Direct messaging between users
- Group chats or Discord-style channels
- Analyst subscriptions/paywalls (future monetization)
- Tipping/payments to analysts
- Verified checkmarks (all analysts equal for now)
- Comment editing (keep immutable for transparency)

## Technical Considerations

- **State management:** Consider Zustand or React Query for social state
- **Real-time:** WebSocket for live comment updates (or polling for MVP)
- **Database:** Need users, follows, comments, reactions, notifications tables
- **Caching:** Cache analyst profiles, invalidate on follow/pick
- **Pagination:** Cursor-based pagination for comments and feeds

## Data Models (Reference)

```
User {
  id, username, displayName, avatar, bio, 
  createdAt, isVerified, followerCount, followingCount
}

Follow {
  id, followerId, followeeId, createdAt
}

Comment {
  id, pickId, userId, parentId (nullable), 
  content, upvoteCount, createdAt, deletedAt
}

Reaction {
  id, pickId, userId, type (fire|money|bullseye|skull|thinking)
}

Notification {
  id, userId, type, referenceId, isRead, createdAt
}

Endorsement {
  id, endorserId, endorseeId, createdAt
}
```

## Success Metrics

- **Engagement:** Comments per pick, reactions per pick
- **Retention:** DAU of users with 5+ follows vs. 0 follows
- **Growth:** Follower growth rate for top analysts
- **Quality:** Upvote ratio (upvotes / comments)
- **Discovery:** % of users who follow someone within first session

## Open Questions

- Should analysts be able to pin a comment to top of discussion?
- Should we show "X is typing..." for live comment updates?
- Gamification: badges for milestones (100 followers, 50 upvotes)?
- Should analyst profiles be public (SEO) or logged-in only?

## Implementation Order (Suggested)

1. **Phase 1:** Profiles + Follow/Unfollow + Following Feed
2. **Phase 2:** Comments + Replies + Upvotes
3. **Phase 3:** Reactions + Mentions
4. **Phase 4:** Notifications + Discover Page
5. **Phase 5:** Endorsements + Quote Picks
