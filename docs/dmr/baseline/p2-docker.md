# P2 — Docker images for judicial services

Status: **Build system reused and VERIFIED — `backend` image built via a real `docker build` (rc=0, 438s, linux/amd64).**
Date: 2026-10-19 · Branch: `chore/judicial-prune`

## Decision: reuse the shared Dockerfile, do NOT write 7 Dockerfiles
island.is already ships a **single parameterized multi-stage Dockerfile**
`scripts/ci/Dockerfile` with target stages that cover every judicial service:
- `output-express-yarn` → `node main.cjs` — api, backend, digital-mailbox-api, message-handler, scheduler, xrd-api
- `output-next` → `node main.js` (PORT 4200) — web

Each judicial `project.json` already carries a marker target (`docker-express-yarn` /
`docker-next`) used only for CI discovery (`nx show projects --with-target ...`).
The real build is `docker buildx --target <stage>` with `APP` / `APP_HOME` /
`APP_DIST_HOME` build args. **This is the official path** — writing per-service
Dockerfiles would duplicate it. P2 reuses it.

## Verified (statically, without Docker)
Built dist outputs match the Dockerfile's CMD/COPY exactly:
- express-yarn services → `dist/apps/judicial-system/<svc>/main.cjs` ✅ (all 6)
- web → `dist/apps/judicial-system/web/main.js` ✅
- So `APP_HOME=apps/judicial-system/<svc>`, `APP_DIST_HOME=dist/apps/judicial-system/<svc>`.
- `PLAYWRIGHT_VERSION` ARG is only consumed by the `playwright-base` stage — none of
  the 7 judicial targets build from it, so a dummy value is fine.
- express-yarn `yarn workspaces focus --production` runs inside the dist dir against
  its own deps-only `package.json`; unaffected by emptying root `workspaces`.
- next `output-next` copies full root `node_modules` from the `deps` stage; unaffected.

## Changes made
1. **`scripts/ci/Dockerfile`**: removed the deleted `apps/native/app/package.json`
   COPY + its log line from the `deps` stage (would otherwise fail the build against
   the pruned repo). This was the only native reference in the Dockerfile.
2. **`scripts/dmr/docker-build-matrix.json`** (new): single source of truth —
   service → nx app name → APP_HOME → target stage → verified listen port
   (api 3333, backend 3344, dmb-api 3358, message-handler 3366, xrd-api 3355,
   web 4200, scheduler = worker/no HTTP). Consumed by the helper and the P5 CI matrix.
3. **`scripts/dmr/docker-build.sh`** (new): DMR-local / GitHub Actions build helper.
   Drives the shared Dockerfile per service **without** island.is's S3 buildkit cache
   or Nx Cloud token (empty token ⇒ cacheless build, which the Dockerfile allows).
   `docker-build.sh <service|all> [--load|--push] [--tag <tag>]`, registry via `DOCKER_REGISTRY`.
   Defaults to `--load`; default tag `dev_<sha7>_<nonce>`, printed as `TAG=<tag>` on the last line.
   The empty Nx Cloud token file lives in `$TMPDIR` and is removed on any exit (trap).

## Real build — VERIFIED (Docker Desktop 28.3.3)
`DOCKER_TAG=smoke PLATFORM=linux/amd64 scripts/dmr/docker-build.sh backend --load` → **rc=0 in 438s**.
Resulting image `judicial-system/judicial-system-backend:smoke`:
- arch **linux/amd64** (ECS/Fargate target), size ~798 MB, `CMD [node main.cjs]`, non-root `runner`.
- `/webapp/main.cjs`, `/webapp/sequelize.config.js` present; node 22.22.3 inside.
- Full `yarn install` + Nx build ran inside the image against the pruned repo — proves the
  native-ref fix and the arg mapping end-to-end.
- Benign warning: `unix-dgram` (DataDog optional native dep) fails to compile under amd64
  emulation; does not block the build and is present upstream too.

The other 6 services use the identical express-yarn path (web = `output-next`); only `backend`
was built here to save ~40 min of amd64-emulated build time — the rest build the same way in
CI (P5) on native amd64 runners.

## NOT yet done

## Next (P5 will call this)
GitHub Actions matrix over `docker-build-matrix.json`: build each service via
`scripts/dmr/docker-build.sh <svc> --push`, push to ECR 592944621100, set the
matching `judicial_<svc>_image_tag` from the printed `TAG=`, then `terraform apply`
(the `ecs_service` module rolls the service in judicial dev 640538430394).
