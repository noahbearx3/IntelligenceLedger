# Intelligence Ledger - Agent Instructions

## Project Overview

The Intelligence Ledger is a social intelligence layer for sports betting and prediction markets. It aggregates data, news (RSS), and social sentiment into a unified view while enforcing transparency through immutable betting records.

## Tech Stack

- **Frontend:** React 18 + Tailwind CSS
- **Build:** Vite 7.x
- **Package Manager:** npm

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

## Project Structure

```
src/
  App.jsx        # Main application component
  main.jsx       # React entry point
  index.css      # Tailwind imports + custom styles

skills/          # Agent skill definitions
  agent-browser/ # Browser automation skill
  prd/           # PRD generation skill
  ralph/         # Ralph PRD converter skill

ralph/           # Ralph autonomous agent files
  prompt.md      # Agent instructions
  prd.json       # Current task list (when active)
  progress.txt   # Iteration learnings

PRD.md           # Product Requirements Document
```

## Key Patterns

- **Tailwind Config:** Custom colors defined in `tailwind.config.cjs` (ink, panel, card, accent, etc.)
- **State Management:** React useState hooks (no external state library yet)
- **Modals:** Custom Modal component in App.jsx
- **Forms:** Controlled inputs with onChange handlers

## Gotchas

- Dev server runs on port 5173 (Vite default)
- PowerShell on Windows: use semicolons instead of `&&` for command chaining
- agent-browser has Windows daemon issues; use `npx playwright` as fallback

## Testing UI Changes

For any frontend story, verify in browser:
1. Run `npm run dev`
2. Open http://localhost:5173
3. Test the specific feature
4. Check console for errors
