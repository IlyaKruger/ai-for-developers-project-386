# AGENTS.md

## Commands

### Install dependencies
```bash
npm run install:all
```

### Run frontend (dev server, http://localhost:5173)
```bash
npm run dev:frontend
```

### Run backend (Hono API server, http://localhost:3001)
```bash
npm run dev:backend
```

### Run tests
```bash
npm test
```

### Run linter
```bash
npm run lint
```

## Commit format

All commits **must** follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(calendar): add slot booking form
fix(api): handle empty bookings list
docs: update installation instructions
```

This convention is required — release-please reads commit messages to auto-generate changelogs and bump versions when PRs are merged into `main`.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (`GLOSSARY.md` + `docs/adr/` at repo root). See `docs/agents/domain.md`.
