# Remaining services: message-handler, scheduler, xrd-api, digital-mailbox-api

Status (2026-10-23): message-handler + scheduler built (`terraform/dev/judicial_message_handler.tf`, `judicial_scheduler.tf`). xrd-api + digital-mailbox-api built 2026-10-27 (`terraform/dev/judicial_xroad_apis.tf`): ecs_service_worker + CloudMap `judicial-system-<svc>.dmr.local:3333`, no ALB. Not reachable yet: still needs SS -> judicial ingress (SG rule from the X-Road VPC `10.67.0.0/24` on 3333, plus a name the SS can resolve) and the services published on the SS. ERROR_EVENT_URL reuses the `backend/` secret.
Owner of deploy Terraform: `terraform/dev/` in this repo (same `ecs_service` pattern as web/api/backend).

## The four services

| Service | Kind | Port | Callers | ECS shape |
|---|---|---|---|---|
| message-handler | Always-on SQS worker, calls backend | 3366 (health only) | none | APRÓ `ecs_service_worker`, no ALB |
| scheduler | Runs once, exits | none | none | APRÓ `scheduled_ecs_tasks` (EventBridge rule -> Step Functions -> RunTask) |
| xrd-api | HTTP API, internal | 3355 | police + courts via X-Road | `ecs_service`, X-Road path |
| digital-mailbox-api | HTTP API, internal | 3358 | island.is mailbox via X-Road | `ecs_service`, X-Road path |

## Common work (all four)

- [ ] ECR repos in infra `DMR-shared/config/shared.yml` (shared `github-ci` push rights come with it)
- [ ] Add to CI `images` list in `.github/workflows/ci.yml` (build matrix in `scripts/dmr/docker-build-matrix.json` already has all 7)
- [ ] SSM image-tag params in `terraform/dev/image_tags.tf` (`/judicial-system/dev/<svc>/image-tag`)
- [ ] CI role: `iam:PassRole` for `judicial-system-*` already covers the new task roles; scheduler also needs `scheduler:*` + PassRole to `scheduler.amazonaws.com`
- [ ] `PORT=3333` on the HTTP ones (shared SG only opens 3333)

## Env per service

| Env | msg-handler | scheduler | xrd-api | mailbox | Source |
|---|---|---|---|---|---|
| `BACKEND_URL` | x | x | x | x | `local.backend_internal_url` |
| `BACKEND_ACCESS_TOKEN` | x | x | x | x | `shared/` secret (exists) |
| `AUTH_JWT_SECRET` | | | x | x | `shared/` secret (exists) |
| `SQS_QUEUE_NAME`, `SQS_REGION` | x | x | | | infra_outputs (exists) |
| `TIME_TO_LIVE_MINUTES=30` | | x | | | plain |
| `AUDIT_TRAIL_*` (3) | | | x | x | plain, `local.audit_log_group_name` |
| `ERROR_EVENT_URL` | | | x | | only `backend/` secret exists -> move/copy to `shared/` |
| `IDENTITY_SERVER_ISSUER_URL` | | | | x | island.is IDS |

`LAWYERS_ICELAND_API_KEY` is in island.is infra for xrd-api/mailbox but never read. Skip.

## Task roles

| Service | Rights |
|---|---|
| message-handler | SQS receive/delete/get on queue + DLQ |
| scheduler | SQS send on queue |
| xrd-api | `local.audit_log_task_statement` |
| digital-mailbox-api | `local.audit_log_task_statement` |

## Per-service decisions

1. **Scheduler** — decided: ECS task on a schedule, same as the k8s CronJob. island.is ran it at 02:00 and 09:00 (check timezone in `apps/judicial-system/scheduler/infra`). Check if the APRÓ modules have a scheduled-task module; otherwise `aws_scheduler_schedule` + task definition directly.
2. **xrd-api + digital-mailbox-api** — DMR has its own X-Road Security Server (dev: `ss.xroad.dev.dmr-dev.cloud`, not connected to judicial yet). backend still points `XROAD_*` at island.is's `securityserver.dev01.devland.is`, so court/police jobs from message-handler fail to the DLQ until it is switched. Needs network groundwork (likely VPC peering / routing from the security server to the judicial VPC, SG rule, internal ALB or CloudMap path). Tracked with X-Road milestone (JM-30). Deploy the services only when the path exists.
3. **digital-mailbox-api auth** — likely keeps trusting island.is IDS. Snorri to confirm.
4. **Audit log group** — fixed 2026-10-22: `terraform/dev/audit_log.tf` creates `judicial-system/audit-log` and grants backend + api write rights. Was missing before (writes failed silently).

## Order

1. message-handler (unblocks backend's queued jobs: notifications, court sync)
2. scheduler
3. xrd-api + digital-mailbox-api, after X-Road network path + IDS confirmation
