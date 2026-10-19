# judicial-system-web — public frontend (ECS/Fargate).
#
# Source: island.is apps/judicial-system/web/infra/judicial-system-web.ts
# Single-host path split: web is the "/*" catch-all at listener priority 100,
# evaluated AFTER api's /api/* rule (10). Same-origin with api (no CORS).
#
#   API_URL          = https://judicial-system.<domain>            (browser)
#   INTERNAL_API_URL = http://judicial-system-api.dmr.local:3333   (server-side, CloudMap)

locals {
  judicial_web_service_name = "judicial-system-web"
  judicial_web_image        = "${local.shared_ecr_registry}/judicial-system-web:${local.judicial_web_image_tag}"
  judicial_web_dd_version   = split("_", local.judicial_web_image_tag)[1]
  judicial_web_health       = "/liveness"

  judicial_host    = module.infra_outputs.alb_route53_record_names["judicial-system"]
  api_internal_url = "http://judicial-system-api.${local.internal_domain}:3333"
}

module "judicial_web" {
  # NOTE: module source must be a string literal (no locals/vars). Bump the
  # version here + in judicial_api.tf + judicial_backend.tf together. v3.26.1 is
  # the first line exposing `paths` + `listener_rule_priority`.
  source = "s3::https://apro-terraform-modules.s3.eu-west-1.amazonaws.com/v3.26.1/ecs_service.zip"

  service_name = local.judicial_web_service_name
  env          = local.env

  cluster_name          = module.infra_outputs.ecs_cluster_name
  vpc_id                = module.infra_outputs.vpc_id
  subnet_ids            = module.infra_outputs.private_subnets
  security_group_ids    = [module.infra_outputs.services_shared_sg_id]
  service_discovery_id  = module.infra_outputs.ecs_namespace_id
  alb_listener          = module.infra_outputs.alb_https_listener_arn
  alb_security_group_id = module.infra_outputs.alb_security_group_id

  # Required by the module unconditionally; only used when create_record = true
  # (it is false here — foundation/CloudFront own the DNS records).
  hosted_zone_name = module.infra_outputs.hosted_zone_name
  alb_dns_name     = module.infra_outputs.alb_dns_name
  alb_zone_id      = module.infra_outputs.hosted_zone_id

  container_image  = local.judicial_web_image
  cpu_architecture = "X86_64"
  container_cpu    = 512
  container_memory = 512
  service_port     = 3333

  desired_count            = 1
  enable_autoscaling       = true
  autoscaling_min_capacity = 1
  autoscaling_max_capacity = 2

  # Single-host path split — web catch-all at LOWER priority than api (10).
  # No Route 53 record created here (the foundation alb unit owns the host record,
  # fronted by CloudFront / JM-37).
  create_record          = false
  create_listener_rule   = true
  hosts                  = [local.judicial_host]
  paths                  = ["/*"]
  listener_rule_priority = 100

  healthcheck_path    = local.judicial_web_health
  healthcheck_matcher = "200-399"

  dd_enabled                     = true
  dd_apm_ignore_resources_string = "GET ${local.judicial_web_health}"
  dd_service_name                = local.judicial_web_service_name
  dd_tags = {
    service = local.judicial_web_service_name
    version = local.judicial_web_dd_version
  }

  environment_variables = {
    PORT         = "3333"
    NODE_OPTIONS = "--max-old-space-size=384"
    LOG_LEVEL    = "info"

    DD_ENV     = local.env
    DD_SERVICE = local.judicial_web_service_name
    DD_VERSION = local.judicial_web_dd_version

    # --- service-defined env (web .ts) ---
    API_URL          = "https://${local.judicial_host}"
    INTERNAL_API_URL = local.api_internal_url
    ENVIRONMENT      = local.env
  }

  secretsmanager_secret_names = {
    DD_LOGS_CLIENT_TOKEN      = module.infra_outputs.secret_names["shared/DD_LOGS_CLIENT_TOKEN"]
    NATIONAL_REGISTRY_API_KEY = module.infra_outputs.secret_names["web/NATIONAL_REGISTRY_API_KEY"]
    LAWYERS_ICELAND_API_KEY   = module.infra_outputs.secret_names["shared/LAWYERS_ICELAND_API_KEY"]
    SUPPORT_EMAIL             = module.infra_outputs.secret_names["web/SUPPORT_EMAIL"]
    CONFIGCAT_SDK_KEY         = module.infra_outputs.secret_names["shared/CONFIGCAT_SDK_KEY"]
    AUTH_JWT_SECRET           = module.infra_outputs.secret_names["shared/AUTH_JWT_SECRET"]
  }
}
