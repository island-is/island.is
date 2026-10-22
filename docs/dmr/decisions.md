# Decisions

## 2026-10-20 — Build on JM-36; repo owns ECS as Terraform HCL (supersedes the taskdef.json plan)
Branch `chore/judicial-prune` rebased onto `origin/feat/JM-36-judicial-ecs-services` (clean, 0 conflicts — JM-36 touches only `terraform/`, our prune touches `apps/`/`libs/`/`scripts/`/config). Backup tag `backup/pre-jm36-rebase`.

JM-36 landed the task-def/service ownership a different way than the 2026-10-19 P3 plan assumed. **This supersedes "retire DSL → hand-maintained `deploy/ecs/<service>/taskdef.json` + `amazon-ecs-render-task-definition`."** The repo now owns each judicial service as **Terraform HCL** in `terraform/dev/judicial_{web,api,backend}.tf`, each calling the APRÓ `ecs_service` S3 module (`s3::.../v3.26.1/ecs_service.zip`) which internally renders the task definition and the `aws_ecs_service`. Infra outputs (cluster, VPC, subnets, SGs, ALB listener, secret names, RDS endpoints) are read via the local `infra_outputs` module from the infra state bucket. So:
- **P3** is answered by JM-36: no `taskdef.json`, no DSL renderer. Task-def lives inside the `ecs_service` module, configured by HCL.
- **P4 (infra/app seam)** is already built: app repo owns `ecs_service` (task-def + service), infra owns everything beneath, handed over via `infra_outputs`.
- **P5 (CI)** shape changes: build → push to ECR `592944621100` as `judicial-system-<svc>:<tag>` → update the `judicial_*_image_tag` locals in `terraform/dev/locals.tf` → `terraform apply`. NOT render-task-def + ecs-deploy-action.

Image contract from `terraform/dev/locals.tf`: registry `592944621100.dkr.ecr.eu-west-1.amazonaws.com`, image `judicial-system-<svc>`, tag scheme `dev_<gitsha7>_<nonce>` (island.is's own; current M1 tags pin islandis-prod mirrored builds), arch `X86_64`, runtime `PORT=3333` for web/api/backend. Our `scripts/dmr/docker-build.sh` already tags `$REGISTRY/judicial-system-<svc>:$TAG` — matches.
Only web/api/backend have TF today (M1 live); the other 4 services (digital-mailbox-api, message-handler, scheduler, xrd-api) have no TF yet.

## 2026-10-19 — Retire the DSL for deploys
(Partly superseded by the 2026-10-20 JM-36 entry above: the repo owns task-defs via the `ecs_service` Terraform module, not standalone `taskdef.json` files.)
Task definitions become ECS-native JSON in this repo (`deploy/ecs/<service>/taskdef.dev.json`), seeded once from `apps/judicial-system/*/infra/*.ts`. Matches the apro-accelerator pattern (`aproorg/terraform-modules//modules/ecs_service` + app-repo `taskdef.json`). The DSL files stay until the seed is verified, then get deleted with `infra/` in the deep prune.

## 2026-10-19 — No copy of the island.is API gateway (`apps/api`)
Judicial never calls `apps/api` at runtime. `judicial-system-web` → `judicial-system-api` (its own GraphQL gateway) → `judicial-system-backend`. Translations are served by `judicial-system-api` itself: it mounts `CmsTranslationsModule` (`libs/cms-translations` → `libs/cms` ContentfulRepository → Contentful, using `CONTENTFUL_ACCESS_TOKEN`).
The only link to `apps/api` is at compile time: `web/pages/_app.tsx` imports `Query`/`QueryGetTranslationsArgs` types from `@island.is/api/schema`, which is generated from `apps/api/src/api.graphql`.
Plan: replace those two types with local types (or types generated from judicial-system-api's own schema) before deleting `apps/api`. Do not extract or copy the gateway.
External runtime dependencies that stay island.is-owned: IDS login (`innskra.island.is`), X-Road, Contentful.
