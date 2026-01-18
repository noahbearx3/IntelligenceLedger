PRD: "The Intelligence Ledger" (Working Title)

SLC Commitment
This PRD defines a SLC (simple, lovable, complete) v25.0.1. The release must feel complete, polished, and delightful even with a tight scope.

1. Product Overview
A social intelligence layer for sports betting and prediction markets. It aggregates raw data, news (RSS), and social sentiment into a single "Team Entity" view while enforcing 100% transparency through verified, immutable betting records.

Target Audience:
* The Analyst: Bettors who want data-backed "tidbits" rather than gut feelings.
* The Follower: Users who want to find experts without the risk of "record-washing" (deleting losses).
* The Disciplined Bettor: Users seeking tools to prevent the "Blur" and manage their emotional bankroll.

2. Core Feature Set (MVP)

A. The "Team/Player DNA" Dashboard (Aggregation)
RSS Aggregator: A tab for every team/player that pulls from local beat reporters, official team news, and injury wires.
Sentiment Heat Map: An AI-driven bar that scans X (Twitter) and Reddit to show if the "public" is bullish or bearish on a team.
The Tidbit Feed: A community-driven section where users post specific, verified stats (e.g., "Josh Allen is 10-2 in games under 30°F"). These are upvoted for accuracy.

B. The Immutable Ledger (Transparency)
Verified Pick Entry: Picks must be locked in before the event starts. No deleting, no editing.
Unit-Only Display: Profits are displayed in Units, not currency. This levels the playing field between whales and small bettors.
The Transparency Badge: Users who have 0% deleted/hidden picks over 100+ bets get a "Verified Analyst" status.

C. The "Logic Filter" (Mental Health & Safety)
The "Blur" Alert: If a user tries to place/post more than 3 picks in 30 minutes after a loss, the app displays a full-screen prompt: "Detecting potential chase. View your Tidbit data before proceeding."
The Kill-Switch: A user-set "Stop-Loss." If you lose X units in a day, the "Post" and "View Feed" buttons are disabled until the next day.
Recovery Fund Vault: A feature where users can mark a portion of their bankroll as "Off-Limits" for survival necessities.

3. User Experience (The "Flow")
Action | Feature | Outcome
Research | Clicks "Buffalo Bills" | Sees aggregated RSS news + recent tidbits.
Validate | Sees a Pro's pick | Views the Pro's entire history (including the 25-unit crashes).
Commit | Enters a 1-unit bet | App asks: "What is the data anchor for this pick?" (Forces logical thinking).
Review | Match ends (Loss) | App displays the loss and prompts: "Do you want to bench yourself for 4 hours?"

4. Technical Requirements & Integrations
APIs: Sportradar or Genius Sports for real-time scores/odds; RSS feeds for news; X (Twitter) API for sentiment.
Database: Use a ledger-style database (like Amazon QLDB) or Blockchain to ensure betting records are immutable (cannot be tampered with).
AI Engine: Natural Language Processing (NLP) to categorize RSS news into "Tactical," "Injury," or "Travel" tags.

5. Success Metrics (KPIs)
"Tidbit" Quality: Number of upvoted data-anchors per 100 picks.
Retention under Duress: How many users keep the app open/active after a 5+ unit loss without "chasing."
Accuracy Gap: The difference between a user's "Logical" picks (with data) vs. their "Impulse" picks (no data).

6. PRD Supplement: User Persona & Behavioral Logic
This PRD update integrates Bob, our primary user persona, to ensure every feature directly solves a real-world frustration. By designing for Bob, we move from "cool features" to "necessary tools" that solve the fragmentation and emotional instability of modern betting.

1. User Persona: Bob "The Information Architect"
Bio: A data-driven sports enthusiast who views betting as a puzzle. He is technically savvy but emotionally susceptible to the "swing."
Daily Workflow: Scours Reddit (r/sportsbook), checks SofaScore for the "wisdom of the crowd," and monitors three different Telegram/Discord "Sharp" channels.
The Problem: He spends 80% of his time fact-checking and only 20% actually analyzing. By the time he verifies a stat, the odds have often moved.
The Breaking Point: When Bob loses a "well-researched" bet, he feels the universe is unfair, leading to a Rage Bet to "balance the scales."

2. Pain Point Mapping & Feature Alignment
Bob's Current Frustration | Platform Solution (Feature) | Impact on Bob
Information Overload: Wastes hours jumping between Discord, Twitter, and RSS feeds. | The "Team DNA" Aggregator: All feeds (official, local, and social) in one tab. | Saves Bob ~2 hours of research daily; allows for "First-to-Market" betting.
The "Guru" Scam: Can't tell if a Telegram tipster is actually profitable or just lucky. | Immutable Ledger (Transparency): Verified, non-deletable records for all users. | Bob only follows people with a proven, verified ROI.
Trust Issues: SofaScore percentages are anonymous and easily manipulated. | Weighted Sentiment: Sentiment bars filtered by "Verified Analysts" only. | Bob sees what the smart money thinks, not just the general public.
The Rage Bet: Loses a bet at 9 PM and "all-ins" on a 10 PM game to recover. | The "Amygdala Lock" (Kill-Switch): Hard stop-loss that disables betting after a loss streak. | Forces Bob to "bench himself" and reset his psychology.

3. Behavioral Feature Specifications (The "Bob" Rules)
A. Automated Fact-Checking (The "Tidbit" Validator)
Requirement: When Bob reads a claim (e.g., "Sinner is 8-0 vs. Lefties"), he can highlight the text.
Action: The app queries the internal API and returns a [Verified] or [False/Context Needed] badge.
Goal: Eliminate Bob's manual fact-checking time.

B. The "Mood" Journaling Integration
Requirement: Before placing a bet over 2 units, the app asks Bob: "How are you feeling?" (Options: Focused, Anxious, Frustrated, Neutral).
Action: If Bob selects "Frustrated" or "Anxious," the app applies a 10-minute "Cooling Off" timer before the bet can be confirmed.
Goal: Intercept the "Rage Bet" before it happens.

4. Updated Success Metrics (The "Bob" KPIs)
Research Efficiency: Reduction in the number of external apps Bob opens before placing a bet.
Impulse Control: Number of times the "Cooling Off" timer is triggered and the user subsequently cancels the bet.
Community IQ: Ratio of "Data-Anchored" posts (posts with verified stats) vs. "Opinion-Only" posts.

5. Monetization (The "Pro" Tier for Bob)
Free Tier: Access to basic RSS feeds and public sentiment.
Analyst Tier ($15/mo): Access to the Aggregated Intelligence Terminal, Automated Fact-Checking, and the ability to sell "Verified Picks" (with the transparency escrow we discussed).

6. Persona-Driven Feature Additions (Bob)
Note: Skip the personal journal feature. The additions below focus on Bob's research and impulse-control workflow without journaling.

A. Aggregated Intelligence Terminal
Unified Feed Mixer: Merge RSS, Reddit, and verified social posts into a single timeline with source tags and recency scoring.
Change Tracker: Highlight deltas in odds, injury reports, and sentiment within the last 60 minutes.
First-to-Market Alerts: Push alerts when new verified tidbits appear before line movement.

B. Credibility & Verification
Verified Analyst Weighting: Sentiment heat maps are weighted by verified ROI and sample size.
Tipster Audit View: One-click drilldown to any analyst’s full, immutable pick history with ROI and volatility.
Tidbit Validator: Inline verification badge for highlighted claims, with source evidence attached.

C. Anti-Chase Controls (Non-Journaling)
Amygdala Lock Expansion: Configurable cooldown lengths (10/30/60 min) after a loss streak.
Loss-Streak Guardrails: Require a data anchor and an extra confirmation for any pick after 2 consecutive losses.
Unit-Cap Mode: Optional daily max units posted, enforced until the next day.

D. Research Efficiency Toolkit
Source Credibility Scores: Rank feeds based on historical accuracy of posted stats.
Stat Snapshot Cards: One-click, shareable cards that summarize verified data anchors.
Noise Filter: Toggle to hide unverified tidbits or anonymous sentiment data.
