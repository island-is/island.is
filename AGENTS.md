# AGENTS.md

Repo-wide guidance for AI coding agents (Claude Code, Codex, Cursor, Copilot, …) working in the island.is monorepo. Teams add area-specific guidance in nested `AGENTS.md` files; see [How teams extend this](#how-teams-extend-this).

When this file, a team file, and the surrounding code disagree, follow this order: **safety rules here → policies ([docs.devland.is](https://docs.devland.is)) → team `AGENTS.md` → surrounding code.** Existing code is not proof of policy; if you copy a pattern that breaks a policy, flag it instead.

## Repo map

- Nx monorepo. Deployable apps live in `apps/`, shared code in `libs/`, service infra DSL in `**/infra/`, Helm charts in `charts/`, repo tooling in `scripts/`.
- Every `project.json` has `scope:`/`lib:` tags enforced by module boundaries (`yarn check-tags`). On a boundary error, move the code into an allowed lib; never loosen the tags.
- Generated files (`*.generated.ts`, `schema.ts`, `gen/fetch`) are gitignored. Run `yarn codegen` after a fresh checkout or when a GraphQL/OpenAPI schema changes. The codegen cache only watches files named `*.resolver|service|dto|input|model|enum|module|controller.ts`, so schema-affecting code needs those suffixes.

## Commands

- Lint: `yarn nx lint <project>`
- Test: `yarn nx test <project> --detectLeaks=false` (add `--testFile=<path>` to narrow). Don't pass `--ci` locally.
- Typecheck: few projects define a `typecheck` target. Use `yarn tsc --noEmit -p <project-root>/tsconfig.app.json` (or `tsconfig.lib.json` for libs). Run it after every TypeScript change before calling the work done. Many people here work from the terminal, so errors only surface through commands.
- Format: `yarn prettier --write <files>` or `yarn format`. Never `npx prettier`: it resolves an older Prettier than the one pinned in `package.json` and produces different output.
- Prefer the narrowest Nx target that proves the change. Avoid `run-many`/`affected` over the whole repo unless asked.

## Safety rules (hard)

These apply to every agent and every task. Team files and skills can add stricter rules but not looser ones. When a task needs a blocked action, stop and give the user the exact command to run.

- **Databases.** Run migrations, seeds, `dev-init` targets, `psql`, or any other DB-writing command only against a database you have **proven** is local. `localhost` is not proof: `yarn proxies` / `scripts/run-db-proxy.sh` forwards the **dev RDS** to `localhost:5432` (the port many local docker databases use, others use 5433–5438), and `.env.secret` holds real dev DB credentials. Proof means all of:

  - the service's local postgres container publishes the port its `sequelize.config.js` uses (`docker port <container> 5432/tcp` prints that host port);
  - no `socat-db` / proxy container is running (`docker ps`);
  - `NODE_ENV` is unset or `development` (other values make sequelize read `DB_HOST`).

  If any check fails or can't be run, stop and give the user the command instead.

- **Infrastructure.** No `kubectl`, `helm`, `aws`, SSM or Argo commands that change state. No edits to `charts/**/values.prod.yaml`.
- **Feature flags.** Never create, change, or delete ConfigCat flags. Code reads flags only through `@island.is/feature-flags` / `@island.is/nest/feature-flags`.
- **Secrets.** Never read, print, copy, or commit `.env.secret`, `.envrc.private`, `.env.*` files with credentials, `nx_cloud_access_token.txt`, keystores, or tokens.
- **Git.** The repo is public: a push is publishing. Never push to `main` or `release/*`, never force-push a branch you didn't create, and never rewrite pushed history without asking.
- **Environments.** Staging runs on production data and services; treat it like prod. Never point local code at prod or staging.
- **Ownership.** DevOps owns `.github/`, `scripts/`, Dockerfiles, `**/infra/` and `charts/`. Changes there are hand-offs to that team, not something to slip into a feature PR.

## Security and privacy

- Log through `@island.is/logging` only. Never log personal data (national IDs, names, emails, phone numbers, addresses, financial or health data), secrets, tokens, full request/response bodies, or raw error objects that may carry them.
- Never put a national ID in a URL path or query string. Use the `X-Param-National-Id` / `X-Query-National-Id` headers and prefer GUIDs.
- Never hard-code real kennitölur. The `local-rules/disallow-kennitalas` lint rule enforces this; fixtures that need one use the documented eslint-disable header.
- Every endpoint and resolver needs explicit auth: scopes, guards, and a decision on delegations (companies, children, procuration). Audit-log user data actions.
- Validate input at the boundary. Invalid input is a 4xx, not a logged error. REST errors are RFC 7807 problem+json.
- Collect only the data you need and keep personal data for as short a time as possible.

## Code conventions

- Code, docs, and API names are British English. Translate Icelandic domain terms (`nationalId`, not `kennitala`).
- Files are named after their default export: PascalCase for components and classes, camelCase otherwise. Directories are kebab-case only for Nx projects.
- No hard-coded UI strings: use the localization lib / Contentful, with both IS and EN.
- New user-facing features go behind a feature flag (on in dev, off in staging/prod).
- GraphQL: prefix types and operations with the module name, mutations are verb-first and take one `input`, and never remove or rename a field (deprecate instead).
- REST: `/v1/...`, lowercase hyphenated plural paths, top-level object responses, cursor pagination on lists.
- Keep comments minimal. No comments that narrate the change ("added X", "now uses Y") or restate a policy.
- Accessibility: WCAG 2.1 AA minimum. Semantic HTML, labelled inputs, full keyboard support.
- Use Jest for unit tests and Playwright for e2e. Match the testing pattern of the project you're in.

Full rules with sources: the `policies` skill (`.claude/skills/policies/`), readable by any tool.

## Git and pull requests

- Branch names: `<type>/<short-description>`, all lowercase (e.g. `fix/payment-retry`).
- PR titles follow Conventional Commits and must pass `.github/workflows/pullrequest-lint.yml`: `type(scope): description` with type one of `feat infra fix docs style refactor perf test build ci chore revert`; the scope is the app or domain (`j-s`, `my-pages`, `ids-admin`, …).
- Use `.github/pull_request_template.md`. Keep **What**/**Why** short: bullets plus one or two plain sentences, no tutorials. Tick the "AI tools were used" box and name the tool; that is the disclosure, so don't add AI attribution lines or co-author trailers.
- PRs are squash-merged into `main`; releases are cut on a train, with `hotfix/*` branches against `release/*` for out-of-cycle fixes.
- A CODEOWNER approves every change, AI-assisted included. Resolve review comments in the PR rather than deferring them to unspecified follow-ups.

## How teams extend this

- Put area guidance in `apps/<area>/AGENTS.md` (or `libs/<area>/AGENTS.md`) next to a one-line `CLAUDE.md` containing `@AGENTS.md`. `apps/judicial-system/` is the reference example.
- Team Claude skills go in `<area>/.claude/skills/<name>/SKILL.md`.
- Team files add project knowledge (traps, codegen steps, domain rules). They must not restate or relax the safety rules above. A workflow that runs migrations or seeds must include the local-DB proof from the Databases rule before the command (`apps/judicial-system/.claude/skills/js-e2e` is an example), and must never run infra or flag mutations.
- No secrets, prod URLs, or personal paths in any agent file. See `.claude/README.md` for details.
