# judicial-system-xrd-api + judicial-system-digital-mailbox-api (ECS/Fargate).
#
# Source: island.is apps/judicial-system/{xrd-api,digital-mailbox-api}/infra/*.ts
# Both are internal HTTP APIs that OTHER X-Road members call through a security
# server: xrd-api by police and courts, digital-mailbox-api by the island.is
# mailbox. On island.is they sat behind the internal nginx ingress.
#
# Here they run with no ALB: APRÓ ecs_service_worker + a CloudMap name
# (judicial-system-<svc>.dmr.local:3333). The X-Road path to them (security
# server -> TGW -> this VPC, its SG rule and DNS) is not built yet, so for now
# nobody can call them. See docs/dmr/remaining-services-plan.md.

locals {
  judicial_xroad_apis = {
    xrd-api = {
      service_name = "judicial-system-xrd-api"
      image_tag    = aws_ssm_parameter.image_tag["xrd-api"].insecure_value
      extra_env    = {}
      # xrd-api posts failed calls to this URL (env.required, no default).
      extra_secrets = {
        ERROR_EVENT_URL = module.infra_outputs.secret_names["backend/ERROR_EVENT_URL"]
      }
    }
    digital-mailbox-api = {
      service_name = "judicial-system-digital-mailbox-api"
      image_tag    = aws_ssm_parameter.image_tag["digital-mailbox-api"].insecure_value
      # Validates island.is IDS tokens from the mailbox. Kept on island.is IDS
      # until the IDS decision (see prod-todo.md).
      extra_env = {
        IDENTITY_SERVER_ISSUER_URL = "https://identity-server.dev01.devland.is"
      }
      extra_secrets = {}
    }
  }
}

module "judicial_xroad_api" {
  # module source must be a string literal — keep the version in sync with the other services.
  source   = "s3::https://apro-terraform-modules.s3.eu-west-1.amazonaws.com/v3.26.1/ecs_service_worker.zip"
  for_each = local.judicial_xroad_apis

  service_name = each.value.service_name
  env          = local.env

  cluster_name         = module.infra_outputs.ecs_cluster_name
  subnet_ids           = module.infra_outputs.private_subnets
  security_group_ids   = [module.infra_outputs.services_shared_sg_id]
  service_discovery_id = module.infra_outputs.ecs_namespace_id

  container_image  = "${local.shared_ecr_registry}/${each.value.service_name}:${each.value.image_tag}"
  cpu_architecture = "X86_64"
  container_cpu    = 256
  container_memory = 512

  desired_count      = 1
  enable_autoscaling = false

  # No ALB, so the container checks itself. Image has node but no curl.
  container_health_check = {
    command = [
      "CMD-SHELL",
      "node -e \"fetch('http://localhost:3333/liveness').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\"",
    ]
    startPeriod = 60
  }

  dd_enabled      = true
  dd_service_name = each.value.service_name
  dd_tags = {
    service = each.value.service_name
    version = split("_", each.value.image_tag)[1]
  }

  environment_variables = merge({
    # Shared services SG only opens 3333.
    PORT         = "3333"
    NODE_OPTIONS = "--max-old-space-size=384"
    LOG_LEVEL    = "info"

    DD_ENV     = local.env
    DD_SERVICE = each.value.service_name
    DD_VERSION = split("_", each.value.image_tag)[1]

    BACKEND_URL                    = local.backend_internal_url
    AUDIT_TRAIL_USE_GENERIC_LOGGER = "false"
    AUDIT_TRAIL_GROUP_NAME         = local.audit_log_group_name
    AUDIT_TRAIL_REGION             = local.aws_region
  }, each.value.extra_env)

  secretsmanager_secret_names = merge({
    BACKEND_ACCESS_TOKEN = module.infra_outputs.secret_names["shared/BACKEND_ACCESS_TOKEN"]
  }, each.value.extra_secrets)
}

# ecs_service_worker has no tasks_iam_role_statements input; attach to its role.
data "aws_iam_policy_document" "judicial_xroad_api_audit" {
  statement {
    sid       = local.audit_log_task_statement.sid
    effect    = local.audit_log_task_statement.effect
    actions   = local.audit_log_task_statement.actions
    resources = local.audit_log_task_statement.resources
  }
}

resource "aws_iam_role_policy" "judicial_xroad_api_audit" {
  for_each = module.judicial_xroad_api

  name   = "audit-log"
  role   = each.value.tasks_iam_role_name
  policy = data.aws_iam_policy_document.judicial_xroad_api_audit.json
}
