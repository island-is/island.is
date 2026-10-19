locals {
  env        = "dev"
  aws_region = "eu-west-1"
  tenant     = "dmr-judicial"

  # Foundation state bucket (owned by the infra repo, clients/DMR/infrastructure/judicial).
  # root.hcl there writes state to "<env>-<tenant>-terraform-state".
  foundation_state_bucket = "${local.env}-${local.tenant}-terraform-state"

  domain = "rettarvorslugatt.dev.dmr-dev.cloud"

  # DMR shared ECR registry (account 592944621100, eu-west-1) holding the
  # judicial-system images mirrored by JM-32.
  shared_ecr_registry = "592944621100.dkr.ecr.eu-west-1.amazonaws.com"

  # APRÓ ecs_service module is pulled from the apro-terraform-modules S3 bucket.
  # The source is a string literal in each service module (Terraform requires
  # module.source to be constant) — pinned to v3.26.1, the first line exposing
  # `paths` + `listener_rule_priority` (single-host web `/` + api `/api/*` split).
  # Bump all three service modules together.

  # Image tags — the exact builds islandis-prod runs for judicial-system
  # (mirrored to DMR shared ECR by JM-32). web is on 94d0d52; api/backend 6f92630.
  judicial_web_image_tag     = "dev_94d0d52_U6FZPgfAKpXoheNp"
  judicial_api_image_tag     = "dev_6f92630_VedP50IT5YwH4cCJ"
  judicial_backend_image_tag = "dev_6f92630_VedP50IT5YwH4cCJ"

  # Internal CloudMap base (ecs_cluster namespace = dmr.local). Services register
  # <service_name>.<namespace>; A records carry no port so the :3333 is explicit.
  internal_domain = "dmr.local"

  common_tags = {
    Owner     = "DevOps"
    Customer  = "DMR"
    Project   = "judicial-system"
    terraform = "true"
    state     = "services/judicial-system"
  }
}
