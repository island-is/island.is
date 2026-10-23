# judicial-system-api — API/BFF (ECS/Fargate).
#
# Source: island.is apps/judicial-system/api/infra/judicial-system-api.ts
# Single-host path split: api owns /api/* at listener priority 10 (evaluated
# BEFORE web's "/*" catch-all at 100). Talks to backend in-VPC via CloudMap:
#   BACKEND_URL = http://judicial-system-backend.dmr.local:3333

locals {
  judicial_api_service_name = "judicial-system-api"
  judicial_api_image        = "${local.shared_ecr_registry}/judicial-system-api:${local.judicial_api_image_tag}"
  judicial_api_dd_version   = split("_", local.judicial_api_image_tag)[1]
  judicial_api_health       = "/liveness"

  backend_internal_url = "http://judicial-system-backend.${local.internal_domain}:3333"
}

module "judicial_api" {
  # module source must be a string literal — keep in sync with web/backend.
  source = "s3::https://apro-terraform-modules.s3.eu-west-1.amazonaws.com/v3.26.1/ecs_service.zip"

  service_name = local.judicial_api_service_name
  env          = local.env

  cluster_name          = module.infra_outputs.ecs_cluster_name
  vpc_id                = module.infra_outputs.vpc_id
  subnet_ids            = module.infra_outputs.private_subnets
  security_group_ids    = [module.infra_outputs.services_shared_sg_id]
  service_discovery_id  = module.infra_outputs.ecs_namespace_id
  alb_listener          = module.infra_outputs.alb_https_listener_arn
  alb_security_group_id = module.infra_outputs.alb_security_group_id

  # Required unconditionally; unused while create_record = false.
  hosted_zone_name = module.infra_outputs.hosted_zone_name
  alb_dns_name     = module.infra_outputs.alb_dns_name
  alb_zone_id      = module.infra_outputs.hosted_zone_id

  container_image  = local.judicial_api_image
  cpu_architecture = "X86_64"
  container_cpu    = 512
  container_memory = 512
  service_port     = 3333

  desired_count            = 1
  enable_autoscaling       = true
  autoscaling_min_capacity = 1
  autoscaling_max_capacity = 2

  # api owns /api/* at HIGHER priority (10) than web's catch-all (100).
  create_record          = false
  create_listener_rule   = true
  hosts                  = [local.judicial_host]
  paths                  = ["/api/*"]
  listener_rule_priority = 10

  healthcheck_path    = local.judicial_api_health
  healthcheck_matcher = "200"

  dd_enabled                     = true
  dd_apm_ignore_resources_string = "GET ${local.judicial_api_health}"
  dd_service_name                = local.judicial_api_service_name
  dd_tags = {
    service = local.judicial_api_service_name
    version = local.judicial_api_dd_version
  }

  environment_variables = {
    PORT         = "3333"
    NODE_OPTIONS = "--max-old-space-size=384"
    LOG_LEVEL    = "info"

    DD_ENV     = local.env
    DD_SERVICE = local.judicial_api_service_name
    DD_VERSION = local.judicial_api_dd_version

    # --- service-defined env (api .ts) ---
    AUTH_IDS_SCOPE                 = "openid profile offline_access"
    AUTH_IDS_CLIENT_ID             = "@rettarvorslugatt.island.is/web"
    IDENTITY_SERVER_ISSUER_URL     = "https://identity-server.dev01.devland.is"
    AUTH_IDS_REDIRECT_URI          = "https://${local.judicial_host}/api/auth/callback/identity-server"
    AUTH_IDS_LOGOUT_REDIRECT_URI   = "https://${local.judicial_host}"
    ALLOW_AUTH_BYPASS              = "true"
    BACKEND_URL                    = local.backend_internal_url
    AUDIT_TRAIL_USE_GENERIC_LOGGER = "false"
    AUDIT_TRAIL_GROUP_NAME         = local.audit_log_group_name
    AUDIT_TRAIL_REGION             = "eu-west-1"
    CONTENTFUL_HOST                = "preview.contentful.com"
    CONTENTFUL_ENVIRONMENT         = "test"
    HIDDEN_FEATURES                = ""
    # Redis EXCLUDED (JM-30); empty JSON array satisfies requiredJSON loaders.
    REDIS_NODES = "[]"
  }

  secretsmanager_secret_names = {
    AUTH_JWT_SECRET          = module.infra_outputs.secret_names["shared/AUTH_JWT_SECRET"]
    BACKEND_ACCESS_TOKEN     = module.infra_outputs.secret_names["shared/BACKEND_ACCESS_TOKEN"]
    CONTENTFUL_ACCESS_TOKEN  = module.infra_outputs.secret_names["shared/CONTENTFUL_ACCESS_TOKEN"]
    AUTH_IDS_SECRET          = module.infra_outputs.secret_names["api/AUTH_IDS_SECRET"]
    LAWYERS_ICELAND_API_KEY  = module.infra_outputs.secret_names["shared/LAWYERS_ICELAND_API_KEY"]
    AUTH_TOKEN_SECRET_BASE64 = module.infra_outputs.secret_names["api/AUTH_TOKEN_SECRET_BASE64"]
    CONFIGCAT_SDK_KEY        = module.infra_outputs.secret_names["shared/CONFIGCAT_SDK_KEY"]
  }

  # Task role: audit trail writes to CloudWatch (audit_log.tf).
  tasks_iam_role_statements = [local.audit_log_task_statement]
}
