---
name: local-run-setup
description: How to run application-system locally (node version, AWS profile, 2-terminal dev bundle, port gotchas)
metadata:
  type: project
---

How to run the **application-system** stack locally on this machine. See [[user-team-area]].

**Node:** repo pins `20.15.0` (engines). Machine defaults to v22, so every interactive terminal needs `nvm use 20.15.0` first. v20.15.0 is installed via nvm.

**AWS:** the island.is dev profile is `islandis-dev` (account `013313053092`, SSO `https://island-is.awsapps.com/start`). The other profiles in `~/.aws/config` (`mms-*`, `thjodskra`) are a different org. `AWS_PROFILE=islandis-dev` is exported via `.envrc.private` (git-ignored, loaded by direnv) so `yarn get-secrets` / `yarn dev-init` hit the right account. Refresh with `aws sso login` (no `--profile` needed once direnv sets it).

**First-time / branch-switch prep:** `yarn install`, `(cd infra && yarn install)`, `yarn codegen`, then `yarn dev-init application-system-api` (fetches secrets → starts Docker db + redis → migrations → backend codegen). Docker must be running. The `services-user-profile:seed` step fails harmlessly (no `seeders/` dir) — ignore it.

**Running = ONE command** (with `nvm use 20.15.0`): `yarn dev application-system-form`. This is an all-in-one BUNDLE that starts in parallel: `application-system-api:dev` (= api gateway 4444 + services-user-profile + backend 3333), the **BFF** (`service-portal:start-bff`, serves `/bff/*` incl. `/bff/user`), and the frontend (4242). Then open http://localhost:4242/umsoknir. Backend swagger at http://localhost:3333/swagger.

Pitfalls: `yarn start application-system-form` alone starts ONLY the frontend → `/bff/user` returns **504 Gateway Timeout** because the BFF isn't running; start the BFF too (`yarn nx run service-portal:start-bff`) or just use `yarn dev application-system-form`. Do NOT run `yarn dev application-system-api` AND `yarn dev application-system-form` together (or `yarn start api` alongside either) — the form's dev already includes the api bundle, so double-starting the gateway causes `EADDRINUSE :::4444`.

**Port gotchas:** island.is uses 5432 (db), 7010-7015 (redis cluster), 3333/4444/4242. Other-project Docker stacks (`mb-*`, `thjodskra-*`) occupy 5432/9200/6379 and must be stopped first (`docker stop ...`); restart them with `docker start ...` when switching back. Benign warnings on api boot: `Could not load configuration for <X>. Missing N required environment variable(s)` (optional integrations) and `Starting inspector on localhost:9229 failed` (shared debug port).
