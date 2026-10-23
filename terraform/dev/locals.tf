locals {
  env        = "dev"
  aws_region = "eu-west-1"
  tenant     = "dmr-judicial"

  # Infra state bucket (owned by the infra repo, clients/DMR/infrastructure/judicial).
  # root.hcl there writes state to "<env>-<tenant>-terraform-state".
  infra_state_bucket = "${local.env}-${local.tenant}-terraform-state"

  domain = "rettarvorslugatt.dev.dmr-dev.cloud"

  # DMR shared ECR registry (account 592944621100, eu-west-1) holding the
  # judicial-system images mirrored by JM-32.
  shared_ecr_registry = "592944621100.dkr.ecr.eu-west-1.amazonaws.com"

  # APRÓ ecs_service module is pulled from the apro-terraform-modules S3 bucket.
  # The source is a string literal in each service module (Terraform requires
  # module.source to be constant) — pinned to v3.26.1, the first line exposing
  # `paths` + `listener_rule_priority` (single-host web `/` + api `/api/*` split).
  # Bump all three service modules together.

  # Image tags live in SSM, written by CI — see image_tags.tf.

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
