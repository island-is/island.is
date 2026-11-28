# AI agent setup

Shared configuration for AI coding agents in this repo. Owned by `@island-is/core`, and changes are reviewed like any other code.

| Path                                 | Read by                                   | Purpose                                                                                                         |
| ------------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/AGENTS.md`                         | Claude Code, Codex, Cursor, Copilot, …    | Repo-wide baseline: commands, safety rules, conventions, PR rules                                               |
| `/CLAUDE.md`                         | Claude Code                               | Imports `AGENTS.md`, plus Claude-specific notes                                                                 |
| `.claude/settings.json`              | Claude Code                               | Team permissions: denies secret reads and cluster mutations; asks before pushes, PRs, migrations and DB proxies |
| `.claude/skills/policies/`           | Claude Code (any tool can read the files) | island.is policies as rules with IDs (`LOG-1`, `SEC-2`, …) and links to docs.devland.is                         |
| `.claude/skills/pr-review/`          | Claude Code                               | `/pr-review [pr\|branch]`: drafts review comments in the house style for you to post; checks agent-file changes |
| `.claude/skills/pr-create/`          | Claude Code                               | `/pr-create`: verify, title that passes PR lint, body from the PR template                                      |
| `.claude/skills/hotfix-release/`     | Claude Code                               | `/hotfix-release <release> <sha>`: cherry-pick onto a release branch and open the PR                            |
| `.claude/skills/application-review/` | Claude Code                               | `/application-review`: review for application-system changes (owned by the application-system team)             |

## Personal setup

- Personal overrides go in `.claude/settings.local.json` and `CLAUDE.local.md` (both gitignored), or in `~/.claude/`.
- Project `deny` and `ask` rules can't be overridden by a personal `allow`.
- A personal skill with the same name as a shared one hides the shared one. Delete or rename personal copies of `policies`, `pr-review`, `pr-create` and `hotfix-release`.

## Adding team files

Teams own the agent guidance for their area.

1. **Guidance.** Add `apps/<area>/AGENTS.md` (or `libs/<area>/AGENTS.md`) and a `CLAUDE.md` next to it containing only `@AGENTS.md`. Agents load nested files when they work in that directory. `apps/judicial-system/` is the reference example.
2. **Skills.** Add `<area>/.claude/skills/<name>/SKILL.md`. The root `.claude/skills/` is for repo-wide skills and for area skills whose paths span apps and libs (like `application-review`). Nested skills show up when working in that area. Prefix names with the area (e.g. `js-e2e`) to avoid clashes.
3. **Content.** Write down what an agent can't infer from the code: traps, codegen steps, domain rules, where shared code belongs. Keep it short. Don't copy the root file or the policies.

Rules for any agent file (the `pr-review` skill checks these):

- Don't restate or relax the root safety rules.
- Before any migration, seed, `dev-init`, `psql`, or other DB write, require the local-DB proof from the root `AGENTS.md` Databases rule: the service's postgres container publishes the port, no `socat-db` proxy is running, and `NODE_ENV` is unset or `development`. Otherwise the agent gives the command to the user. A `localhost` check isn't enough, because the dev DB proxy (`yarn proxies`, `scripts/run-db-proxy.sh`) listens on `localhost:5432`, the same port many local docker databases use.
- No `kubectl`, `helm`, `aws`, ConfigCat or Contentful mutations. No pushes or force-pushes without asking.
- No reading audit logs, and no searching logs by national ID.
- No secrets, tokens, `.env.secret` contents, prod or staging URLs, or personal paths.
- Don't add `allow` rules or hooks to a committed `.claude/settings.json` without core review.
