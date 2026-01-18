# PRD: Homepage Rebrand & Layout Redesign

## Introduction

Intelligence Ledger needs a distinctive brand identity and refined homepage layout. The current design feels generic ("AI slop") and lacks visual hierarchy. This redesign will establish a clean, minimal aesthetic inspired by ESPN/The Athletic with bold typography and a monochrome palette featuring a single signature accent color.

## Goals

- Establish a unique, recognizable brand identity
- Create a clean, minimal layout with clear visual hierarchy
- Design a unified dashboard view combining news, odds, ledger, and discovery
- Implement bold, sporty typography that conveys confidence
- Move away from generic AI-generated aesthetics
- Make the app feel premium and trustworthy

## Design Direction

### Aesthetic
**Clean & Minimal** — Apple-like restraint with purposeful whitespace. Every element earns its place. No decorative clutter.

### Color Palette
**Monochrome + One Accent**

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#0A0A0B` | Primary background |
| `--surface` | `#141416` | Card/panel backgrounds |
| `--surface-elevated` | `#1C1C1F` | Hover states, modals |
| `--border` | `#2A2A2E` | Subtle dividers |
| `--text-primary` | `#FAFAFA` | Headings, primary text |
| `--text-secondary` | `#A1A1A6` | Body text, labels |
| `--text-muted` | `#636366` | Hints, timestamps |
| `--accent` | `#F5A623` | Gold — CTAs, highlights, wins |
| `--accent-secondary` | `#FF3B30` | Red — losses, alerts |
| `--accent-success` | `#34C759` | Green — positive trends |

### Typography
**Bold Sans-Serif** — Modern, confident, sporty

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Logo/Brand | `'Clash Display'` or `'Satoshi'` | 700 | — |
| Headings | `'Satoshi'` or `'Plus Jakarta Sans'` | 700 | 24-32px |
| Subheadings | Same | 600 | 18-20px |
| Body | Same | 400-500 | 14-16px |
| Mono/Stats | `'JetBrains Mono'` | 500 | 13-14px |

### Inspiration
- **ESPN**: Bold section headers, confident typography, clear content hierarchy
- **The Athletic**: Premium feel, excellent readability, smart use of space
- **Apple**: Restraint, purposeful whitespace, one accent color philosophy

## User Stories

### US-001: Update color system in Tailwind config
**Description:** As a developer, I need a new color palette so the entire app uses consistent brand colors.

**Acceptance Criteria:**
- [ ] Update `tailwind.config.cjs` with new color tokens
- [ ] Remove old color values that conflict
- [ ] Colors work in both light reference and dark UI
- [ ] Typecheck/lint passes

---

### US-002: Add custom fonts
**Description:** As a user, I want distinctive typography that feels sporty and premium.

**Acceptance Criteria:**
- [ ] Add Satoshi (or Plus Jakarta Sans) as primary font via Google Fonts or local files
- [ ] Add JetBrains Mono for stats/numbers
- [ ] Update `index.css` with font-face declarations
- [ ] Update body and heading font-family in Tailwind
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-003: Redesign header/navigation
**Description:** As a user, I want a clean header that establishes the brand.

**Acceptance Criteria:**
- [ ] Logo text uses brand font, gold accent
- [ ] Minimal nav items (no clutter)
- [ ] Login/CTA button uses accent color
- [ ] Header has subtle bottom border, no heavy backgrounds
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-004: Create unified dashboard layout
**Description:** As a user, I want to see news, odds, ledger, and discovery in a clean dashboard.

**Acceptance Criteria:**
- [ ] Two-column layout on desktop (main content + sidebar)
- [ ] Main column: Team/Player selector, News Intelligence Feed
- [ ] Sidebar: Quick odds glance, Recent ledger entries, Trending picks
- [ ] Clear section headings with consistent spacing
- [ ] Responsive: stacks to single column on mobile
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-005: Redesign Team/Player DNA section
**Description:** As a user, I want the team/player browser to feel integrated, not like a separate component.

**Acceptance Criteria:**
- [ ] Featured cards use team colors but with muted opacity (not overpowering)
- [ ] Selection state is clear (gold accent border or highlight)
- [ ] Section title is bold, left-aligned
- [ ] Cleaner grid spacing
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-006: Redesign News Intelligence Feed
**Description:** As a user, I want news cards that are scannable and elegant.

**Acceptance Criteria:**
- [ ] Cards have minimal borders (or none — use spacing)
- [ ] Source tags are subtle, not colorful pills
- [ ] Timestamps are muted
- [ ] Headlines are bold, body is secondary color
- [ ] AI Summary card is visually distinct (gold left border)
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-007: Redesign Immutable Ledger section
**Description:** As a user, I want the ledger to feel premium and trustworthy.

**Acceptance Criteria:**
- [ ] Table/list uses monospace font for odds and units
- [ ] Win/loss indicators use accent colors (gold/red)
- [ ] Subtle alternating row backgrounds
- [ ] Stats summary uses large, bold numbers
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-008: Add subtle micro-interactions
**Description:** As a user, I want the UI to feel polished with subtle feedback.

**Acceptance Criteria:**
- [ ] Buttons have hover state transitions (150-200ms)
- [ ] Cards have subtle hover lift or border change
- [ ] Selected states animate smoothly
- [ ] No jarring color changes
- [ ] Typecheck/lint passes
- [ ] Verify in browser

---

### US-009: Update footer
**Description:** As a user, I want a minimal footer that doesn't distract.

**Acceptance Criteria:**
- [ ] Simple one-line footer with muted text
- [ ] Centered, minimal padding
- [ ] No unnecessary links
- [ ] Typecheck/lint passes
- [ ] Verify in browser

## Functional Requirements

- FR-1: All color usage must reference Tailwind tokens (no hardcoded hex except in config)
- FR-2: Typography hierarchy must be consistent (H1 > H2 > H3 > body)
- FR-3: All interactive elements must have visible focus states
- FR-4: Dashboard must be responsive (mobile-first breakpoints)
- FR-5: Maximum content width of 1400px, centered on large screens
- FR-6: Consistent spacing scale (4px base, 8/12/16/24/32/48)

## Non-Goals

- No light mode (dark only for v1)
- No animation library (CSS only)
- No logo design (text logo for now)
- No new features — this is visual only

## Technical Considerations

- Use CSS custom properties for colors (easier theming later)
- Consider lazy-loading fonts to avoid FOUT
- Keep existing component structure, just restyle
- Test on mobile viewport (375px) and desktop (1440px)

## Success Metrics

- Homepage feels distinct and recognizable (not generic)
- Visual hierarchy guides user attention
- Consistent spacing and typography throughout
- No accessibility regressions (contrast ratios maintained)
- Positive user feedback on "premium" feel

## Open Questions

- Should we use Satoshi or Plus Jakarta Sans? (Test both)
- Exact gold shade — warmer (#F5A623) or cooler (#D4AF37)?
- Should sidebar be fixed or scroll with content?
