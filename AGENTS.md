# AGENTS.md

Repo-wide guidance for AI coding agents (Claude Code, Codex, Cursor, Copilot, …) working in the island.is monorepo. Teams add area guidance in nested `AGENTS.md` files; see [How teams extend this](#how-teams-extend-this).

Precedence: the **safety rules** below always apply, and no team file or skill can relax them. On conventions, the nearest team `AGENTS.md` wins in its area (judicial-system, for example, uses plain UI strings instead of `defineMessages`). Where neither says anything, follow the policies in the `policies` skill over patterns in the surrounding code. Existing code is not proof of policy; if a pattern you'd copy breaks one, flag it.

## Repo map

- Nx monorepo. Deployable apps live in `apps/`, shared code in `libs/`, service infra DSL in `**/infra/`, Helm charts in `charts/`, repo tooling in `scripts/`.
- Every `project.json` has `scope:`/`lib:` tags enforced by module boundaries (`yarn check-tags`). On a boundary error, move the code into an allowed lib; never loosen the tags.
- Generated files (`*.generated.ts`, `schema.ts`, `gen/fetch`) are gitignored. Run `yarn codegen` after a fresh checkout or when a GraphQL/OpenAPI schema changes. The codegen cache only watches files named `*.resolver|service|dto|input|model|enum|module|controller.ts`, so schema-affecting code needs those suffixes.

## Commands

- Lint: `yarn nx lint <project>`
- Test: `yarn nx test <project> --detectLeaks=false` (add `--testFile=<path>` to narrow). Don't pass `--ci` locally.
- Typecheck: few projects define a `typecheck` target. Use `yarn tsc --noEmit -p <project-root>/tsconfig.app.json` (or `tsconfig.lib.json` for libs) after every TypeScript change. Many people here work from the terminal, so errors only surface through commands.
- Format: `yarn prettier --write <files>` or `yarn format`. Never `npx prettier`: it resolves an older Prettier than the one pinned in `package.json`.
- Prefer the narrowest Nx target that proves the change. Avoid `run-many`/`affected` over the whole repo unless asked.

## Safety rules (hard)

These apply to every agent and every task. When a task needs a blocked action, stop and give the user the exact command to run.

- **Databases.** Run migrations, seeds, `dev-init` targets, `psql`, or any other DB-writing command only against a database you have **proven** is local. `localhost` is not proof: `yarn proxies` / `scripts/run-db-proxy.sh` forwards the **dev RDS** to `localhost:5432`, the port many local docker databases use. Proof means all of:

  - the service's local postgres container publishes the port its `sequelize.config.js` uses (`docker port <container> 5432/tcp` prints that host port);
  - no `socat-db` / proxy container is running (`docker ps`);
  - `NODE_ENV` is unset or `development` (other values make sequelize read `DB_HOST`).

  If any check fails or can't be run, stop and give the user the command instead.

- **Infrastructure.** No `kubectl`, `helm`, `aws`, SSM or Argo commands that change state. No edits to `charts/**/values.prod.yaml`.
- **Feature flags.** Never create, change, or delete ConfigCat flags. Code reads flags only through `@island.is/feature-flags` / `@island.is/nest/feature-flags`.
- **Contentful.** `extract-strings` targets and any other Contentful write are run by a person, who then reviews and publishes the namespace. Suggest the command; don't run it.
- **Secrets.** Never print, copy, or commit `.env.secret`, `.envrc.private`, `nx_cloud_access_token.txt`, keystores, cookies, or tokens. A command may `source .env.secret` to run a service; its values must never reach output, files, or the chat.
- **Personal data while debugging.** Ask for logs, errors, and DB rows to be passed through `scripts/scrub.mjs` first (`pbpaste | node scripts/scrub.mjs | pbcopy`). Never search logs by national ID, and don't read audit logs (`@action` audit entries in Datadog, CloudWatch audit groups); audit access is restricted.
- **Git.** The repo is public: a push is publishing. Never push to `main` or `release/*`, never force-push a branch you didn't create, and never rewrite pushed history without asking.
- **Environments.** Staging runs on production data and services; treat it like prod. Never point local code at prod or staging.
- **Ownership.** DevOps owns `.github/`, `scripts/`, Dockerfiles, `**/infra/` and `charts/` (`.github/CODEOWNERS`). Changes there are hand-offs to that team, not something to slip into a feature PR.

## Security and privacy

- Log through `@island.is/logging` only. Never log personal data (national IDs, names, emails, phone numbers, addresses, financial or health data), secrets, tokens, full request/response bodies, or raw error objects that may carry them.
- Never put a national ID in a URL path or query string. Use the `X-Param-National-Id` / `X-Query-National-Id` headers and prefer GUIDs.
- Never hard-code real kennitölur (`local-rules/disallow-kennitalas`); fixtures use the documented eslint-disable header.
- Every endpoint and resolver needs explicit auth: scopes, guards, and a decision on delegations. Audit-log user data actions.

The full rule set, with IDs and sources, is the `policies` skill (`.claude/skills/policies/`), readable by any tool. Read the relevant reference file before adding endpoints, resolvers, logging, flags, or UI.

## Git and pull requests

- Branch names: `<type>/<short-description>`, all lowercase (e.g. `fix/payment-retry`).
- PR titles follow Conventional Commits and must pass `.github/workflows/pullrequest-lint.yml`: `type(scope): description` with type one of `feat infra fix docs style refactor perf test build ci chore revert`; the scope is the app or domain (`j-s`, `my-pages`, `ids-admin`, …).
- Use `.github/pull_request_template.md`. Keep **What**/**Why** short: bullets plus one or two plain sentences. Tick the "AI tools were used" box and name the tool; that is the disclosure, so don't add AI attribution lines or co-author trailers.
- Comments that explain a change belong in the PR, not the code. Keep code comments minimal and timeless.
- PRs are squash-merged into `main`. Releases go out weekly, on Tuesdays, from a `release/*` branch; `hotfix/*` branches against it handle out-of-cycle fixes.
- A CODEOWNER approves every change, AI-assisted included. Resolve review comments in the PR rather than deferring them to unspecified follow-ups.
- Reviewing: agents draft comments for the developer to post; they don't post them. See the `pr-review` skill.

## How teams extend this

- Put area guidance in `apps/<area>/AGENTS.md` (or `libs/<area>/AGENTS.md`) next to a one-line `CLAUDE.md` containing `@AGENTS.md`. `apps/judicial-system/` and `libs/application/` are good examples.
- Team Claude skills go in `<area>/.claude/skills/<name>/SKILL.md`. Area review skills (like `/application-review`) can live at the root when their paths span apps and libs; say so in their description.
- Write what an agent can't infer from the code: traps, codegen steps, domain rules, cited by `file:line`. Don't restate this file or the policies, and never relax the safety rules. A workflow that runs migrations or seeds must include the local-DB proof before the command (see `apps/judicial-system/.claude/skills/js-e2e`).
- No secrets, prod URLs, or personal paths in any agent file. See `.claude/README.md`.
