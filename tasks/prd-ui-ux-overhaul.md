# PRD: UI/UX Overhaul - Minimalist Redesign + Light Mode

## Introduction

Complete visual polish of Intelligence Ledger to eliminate the "AI template" aesthetic and establish a distinctive, minimalist design language inspired by Linear and Notion. This includes a full light/dark mode toggle, refined typography, improved color system, and polished micro-interactions. The goal is to make the app feel custom-built and premium, not generated.

## Goals

- Add full light/dark mode toggle that persists user preference
- Replace generic "AI slop" aesthetic with distinctive minimalist design
- Improve typography with better font choices and hierarchy
- Create a refined color system that works in both modes
- Polish all components with subtle micro-interactions
- Maintain current layout structure (no major restructuring)

## User Stories

### Phase 1: Theme System Foundation

#### US-001: Implement Theme Toggle System
**Description:** As a user, I want to switch between light and dark modes so I can use the app comfortably in any lighting condition.

**Acceptance Criteria:**
- [ ] Theme toggle button in header (sun/moon icon)
- [ ] Clicking toggle switches between light and dark instantly
- [ ] Theme preference saved to localStorage
- [ ] On first visit, detect system preference (prefers-color-scheme)
- [ ] No flash of wrong theme on page load
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-002: Create CSS Custom Properties for Theming
**Description:** As a developer, I need a systematic color token system so themes can be swapped efficiently.

**Acceptance Criteria:**
- [ ] Define CSS variables for all colors in `:root` (dark) and `.light` (light)
- [ ] Semantic naming: `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-muted`, `--accent`, `--border`, etc.
- [ ] All component colors reference CSS variables (no hardcoded colors)
- [ ] Smooth 200ms transition on theme change
- [ ] Typecheck passes

### Phase 2: Typography Refresh

#### US-003: Implement New Typography System
**Description:** As a user, I want the text to feel premium and readable so the app doesn't look like a template.

**Acceptance Criteria:**
- [ ] Replace current fonts with distinctive pairing:
  - Display/Headers: **Satoshi** or **General Sans** (modern geometric sans)
  - Body: **Inter** with proper optical sizing, or **DM Sans**
  - Monospace: **JetBrains Mono** or **Fira Code** (for stats/numbers)
- [ ] Establish clear type scale: xs (11px), sm (13px), base (15px), lg (18px), xl (24px), 2xl (32px)
- [ ] Improve line-height and letter-spacing for readability
- [ ] Headers use tighter letter-spacing (-0.02em)
- [ ] Body text uses relaxed line-height (1.6)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Phase 3: Color System Refinement

#### US-004: Design Light Mode Color Palette
**Description:** As a user, I want light mode to feel clean and easy on the eyes, not washed out or harsh.

**Acceptance Criteria:**
- [ ] Background: Off-white/warm gray (not pure white) - `#FAFAFA` or `#F8F8F8`
- [ ] Cards/Elevated: Pure white `#FFFFFF` with subtle shadow
- [ ] Text primary: Near-black `#1A1A1A` (not pure black)
- [ ] Text muted: Medium gray `#6B7280`
- [ ] Borders: Very subtle `#E5E7EB`
- [ ] Accent: Refined gold that works on light bg - test contrast
- [ ] Success/Warning/Danger colors adjusted for light mode visibility
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-005: Refine Dark Mode Color Palette
**Description:** As a user, I want dark mode to feel sophisticated, not like a default dark theme.

**Acceptance Criteria:**
- [ ] Background: Rich dark (not pure black) - `#0A0A0B` or `#111113`
- [ ] Cards/Elevated: Slightly lighter `#18181B` with subtle border
- [ ] Text primary: Soft white `#FAFAFA` (not pure white - reduces eye strain)
- [ ] Text muted: `#71717A`
- [ ] Borders: Subtle `#27272A`
- [ ] Accent: Keep gold `#F5A623` or refine to `#FBBF24`
- [ ] Reduce harsh contrast - aim for comfortable reading
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Phase 4: Component Polish

#### US-006: Redesign Card Components
**Description:** As a user, I want cards to feel modern and tactile, not flat and generic.

**Acceptance Criteria:**
- [ ] Cards have subtle rounded corners (12px)
- [ ] Light mode: White cards with soft shadow (`shadow-sm`)
- [ ] Dark mode: Elevated cards with subtle border glow
- [ ] Hover state: Slight lift or border highlight (not dramatic)
- [ ] Active/Selected state: Accent border or background tint
- [ ] Consistent padding (16px or 20px)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-007: Redesign Buttons and Interactive Elements
**Description:** As a user, I want buttons to feel responsive and intentional.

**Acceptance Criteria:**
- [ ] Primary button: Accent color, white text, subtle hover darken
- [ ] Secondary button: Ghost/outline style, accent on hover
- [ ] Button padding: Comfortable click targets (px-4 py-2 minimum)
- [ ] Border radius: Consistent with cards (8px or pill style)
- [ ] Hover: Scale(1.02) or subtle background shift
- [ ] Active: Scale(0.98) press effect
- [ ] Focus: Visible ring for accessibility
- [ ] Disabled: Reduced opacity, no hover effects
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-008: Redesign Form Inputs
**Description:** As a user, I want inputs to feel integrated with the design, not like browser defaults.

**Acceptance Criteria:**
- [ ] Inputs match card styling (rounded, proper padding)
- [ ] Clear focus state with accent ring
- [ ] Placeholder text is muted but readable
- [ ] Labels are small, uppercase, muted (Linear style)
- [ ] Error states use danger color subtly
- [ ] Search inputs have icon inside
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-009: Redesign Tables and Data Displays
**Description:** As a user, I want data tables to be scannable and not overwhelming.

**Acceptance Criteria:**
- [ ] Table headers: Small, uppercase, muted, sticky
- [ ] Row hover: Subtle background highlight
- [ ] Alternating rows: Very subtle or none (Notion style)
- [ ] Cell padding: Comfortable (12-16px)
- [ ] Numbers: Monospace font, right-aligned
- [ ] Status badges: Pill style, muted backgrounds
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Phase 5: Micro-interactions and Polish

#### US-010: Add Subtle Animations
**Description:** As a user, I want the interface to feel alive and responsive without being distracting.

**Acceptance Criteria:**
- [ ] Page transitions: Fade in content (150ms)
- [ ] Tab switches: Smooth content transitions
- [ ] Modal open/close: Scale + fade animation
- [ ] Skeleton loaders: Subtle shimmer effect
- [ ] Theme toggle: Smooth color transitions (200ms)
- [ ] Button clicks: Brief press feedback
- [ ] List items: Stagger animation on load (optional)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-011: Improve Visual Hierarchy and Spacing
**Description:** As a user, I want clear visual hierarchy so I know what's important.

**Acceptance Criteria:**
- [ ] Increase whitespace between sections (32-48px)
- [ ] Group related elements with tighter spacing (8-16px)
- [ ] Section headers: Clear, with subtle separator or extra spacing
- [ ] Important numbers/stats: Larger, bolder
- [ ] Secondary info: Smaller, muted
- [ ] Consistent spacing scale: 4, 8, 12, 16, 24, 32, 48, 64
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Theme toggle must be accessible from any page (in header)
- FR-2: Theme preference must persist across sessions (localStorage)
- FR-3: System preference detection on first visit
- FR-4: All colors must meet WCAG AA contrast requirements
- FR-5: Animations must respect `prefers-reduced-motion`
- FR-6: No layout shift during theme change
- FR-7: All interactive elements must have visible focus states
- FR-8: Touch targets minimum 44x44px on mobile

## Non-Goals

- No major layout restructuring (keep current page structure)
- No new pages or features
- No logo/brand redesign (just refinement)
- No mobile-specific redesign (responsive adjustments only)
- No user customization beyond light/dark (no custom themes)

## Design Considerations

### Inspiration References
- **Linear** - Clean cards, subtle shadows, excellent typography
- **Notion** - Warm neutrals, comfortable spacing, readable
- **Vercel Dashboard** - Dark mode done right, clear hierarchy
- **Raycast** - Crisp components, great micro-interactions

### Color Token Structure
```css
/* Light Mode */
--bg-primary: #FAFAFA;
--bg-secondary: #FFFFFF;
--bg-elevated: #FFFFFF;
--text-primary: #1A1A1A;
--text-secondary: #4B5563;
--text-muted: #9CA3AF;
--border: #E5E7EB;
--accent: #F59E0B;

/* Dark Mode */
--bg-primary: #0A0A0B;
--bg-secondary: #111113;
--bg-elevated: #18181B;
--text-primary: #FAFAFA;
--text-secondary: #A1A1AA;
--text-muted: #71717A;
--border: #27272A;
--accent: #FBBF24;
```

## Technical Considerations

- Use CSS custom properties for all colors (easy theming)
- Theme class applied to `<html>` element for full-page coverage
- Consider `color-scheme` CSS property for native form styling
- Test on both macOS and Windows for font rendering
- Use `font-display: swap` to prevent FOUT
- Lazy load non-critical fonts

## Success Metrics

- Site no longer "looks like AI generated it" (subjective but testable with user feedback)
- Theme toggle works without page refresh
- No accessibility regressions (contrast, focus states)
- Consistent visual language across all components
- Faster perceived performance (smooth animations)

## Open Questions

- Should the accent color change between light/dark modes?
- Should we add a "system" option to the toggle (auto-detect)?
- Any specific components that feel most "template-y" to prioritize?
