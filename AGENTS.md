# AGENTS.md - Intelligence Ledger

This file contains patterns, conventions, and learnings for AI agents (and developers) working on this codebase.

## Project Overview

**Intelligence Ledger** is a social intelligence layer for sports betting. It aggregates data, news (RSS), and social sentiment into a "Team Entity" view while enforcing transparency through verified, immutable betting records.

## Tech Stack

- **Frontend**: React 18 + Vite 7
- **Styling**: Tailwind CSS
- **State**: React useState (local state for beta)
- **Future**: Backend TBD (likely Node + QLDB or similar for immutability)

## Code Conventions

### Component Structure
- Single `App.jsx` file for beta (will be split into components later)
- Tailwind classes inline, no separate CSS modules
- Mock data at top of file for demo purposes

### Styling Patterns
- Dark theme: `bg-ink` for backgrounds, `text-slate-200` for primary text
- Cards: `rounded-xl border border-border bg-card p-5`
- Buttons: `rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink`
- Accent colors defined in `tailwind.config.cjs`

### State Management
- `useState` for all local state
- Modal state: `[modalOpen, setModalOpen]` pattern
- Form inputs: controlled components with `value` + `onChange`

## File Structure

```
/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind imports
├── skills/              # Agent skill definitions
│   ├── agent-browser.md # Browser automation skill
│   ├── prd/SKILL.md     # PRD generation skill
│   └── ralph/SKILL.md   # PRD-to-JSON converter skill
├── tasks/               # Generated PRD files (when using prd skill)
├── PRD.md               # Product requirements document
└── AGENTS.md            # This file
```

## Gotchas

1. **Vite 7 breaking changes**: Upgraded from Vite 5 due to security audit. Watch for deprecation warnings.
2. **PowerShell on Windows**: Use `;` not `&&` for command chaining. Use `$env:VAR` not `%VAR%`.
3. **agent-browser on Windows**: Daemon has issues. Use `npx playwright` directly as fallback.

## Quality Checks

Before committing:
```bash
npm run dev        # Verify it builds and runs
# Typecheck not yet configured (plain JSX)
```

## Future Considerations

- [ ] Add TypeScript for type safety
- [ ] Split App.jsx into component files
- [ ] Add backend API for immutable ledger
- [ ] Add authentication (Supabase or similar)
- [ ] Add real RSS/sentiment API integrations
