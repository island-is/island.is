# CLAUDE.md

Guidance for this repo lives in @AGENTS.md (shared with other AI tools).

Claude Code specifics:

- Team settings and permissions are in `.claude/settings.json`. Put personal overrides in `.claude/settings.local.json` (gitignored).
- Shared skills live in `.claude/skills/`: `/policies`, `/pr-review`, `/pr-create`, `/hotfix-release`, and the application-system team's `/application-review`. A personal skill with the same name shadows the shared one, so remove personal copies.
