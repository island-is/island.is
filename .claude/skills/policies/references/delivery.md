# Delivery, reviews and definition of done (DOD)

Sources: [Definition of done](https://docs.devland.is/development/definition-of-done.md), [Code reviews](https://docs.devland.is/technical-overview/code-reviews.md), [ADR 0004 branching and releases](https://docs.devland.is/technical-overview/adr/0004-branching-and-release-strategy.md)

- **DOD-1** Behaviour changes have tests: Jest for units and internal APIs, Playwright for e2e where relevant.
- **DOD-2** Feature flag in place (`FLAG-1`), audit logging in place (`AUTH-6`), scopes defined (`AUTH-1`), and access for companies, children and delegations decided (`AUTH-2`).
- **DOD-3** Lint, format and typecheck pass for the touched projects.
- **DOD-4** PR titles follow Conventional Commits and pass `pullrequest-lint.yml`. The body follows `.github/pull_request_template.md` with the AI checkbox filled in.
- **DOD-5** Review comments start with `Consider` (optional, knowledge sharing) or `Should` (bug, danger, or performance problem that must change, backed by an argument). Be concise and neutral, critique the code, not the author, and ask for clarification rather than assuming ignorance. Phrasing in practice: `.claude/skills/pr-review/references/comment-style.md`.
- **DOD-6** Squash-merge to `main`. Out-of-cycle fixes go through `hotfix/*` branches against `release/*`.
- **DOD-7** Tested in dev before release. No functional tests or go-lives for IDS or mailbox integrations on Fridays, weekends or public holidays.
