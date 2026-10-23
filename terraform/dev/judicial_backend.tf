# judicial-system-backend — core backend (ECS/Fargate), internal-only.
#
# Source: island.is apps/judicial-system/backend/infra/judicial-system-backend.ts
# No public ingress (ClusterIP on island.is). api reaches it in-VPC via CloudMap
# at http://judicial-system-backend.dmr.local:3333.
#
# PORT=3333 (islandis pods listen on 3333; k8s remapped 80->3333, ECS has no remap).
# RDS :5432 ingress from the shared services SG is opened on the DB side in the
# infra repo (judicial/_envcommon/database.hcl). X-Road env set with placeholder
# shell secrets so the backend boots; real integration deferred (JM-30).

locals {
  judicial_backend_service_name = "judicial-system-backend"
  judicial_backend_image        = "${local.shared_ecr_registry}/judicial-system-backend:${local.judicial_backend_image_tag}"
  judicial_backend_dd_version   = split("_", local.judicial_backend_image_tag)[1]
  judicial_backend_health       = "/liveness"
}

module "judicial_backend" {
  # module source must be a string literal — keep in sync with web/api.
  source = "s3::https://apro-terraform-modules.s3.eu-west-1.amazonaws.com/v3.26.1/ecs_service.zip"

  service_name = local.judicial_backend_service_name
  env          = local.env

  cluster_name          = module.infra_outputs.ecs_cluster_name
  vpc_id                = module.infra_outputs.vpc_id
  subnet_ids            = module.infra_outputs.private_subnets
  security_group_ids    = [module.infra_outputs.services_shared_sg_id]
  service_discovery_id  = module.infra_outputs.ecs_namespace_id
  alb_listener          = module.infra_outputs.alb_https_listener_arn
  alb_security_group_id = module.infra_outputs.alb_security_group_id

  # Required unconditionally; unused (backend has create_record = false and no ingress).
  hosted_zone_name = module.infra_outputs.hosted_zone_name
  alb_dns_name     = module.infra_outputs.alb_dns_name
  alb_zone_id      = module.infra_outputs.hosted_zone_id

  container_image  = local.judicial_backend_image
  cpu_architecture = "X86_64"
  container_cpu    = 512
  container_memory = 1024
  service_port     = 3333

  desired_count            = 1
  enable_autoscaling       = true
  autoscaling_min_capacity = 1
  autoscaling_max_capacity = 2

  # Internal-only — no public listener rule, no Route 53 record. api reaches it
  # via CloudMap (service_discovery_id registers the A record).
  create_record        = false
  create_listener_rule = false
  hosts                = []

  healthcheck_path    = local.judicial_backend_health
  healthcheck_matcher = "200"

  dd_enabled                     = true
  dd_apm_ignore_resources_string = "GET ${local.judicial_backend_health}"
  dd_service_name                = local.judicial_backend_service_name
  dd_tags = {
    service = local.judicial_backend_service_name
    version = local.judicial_backend_dd_version
  }

  environment_variables = {
    PORT         = "3333"
    NODE_OPTIONS = "--max-old-space-size=768"
    LOG_LEVEL    = "info"

    DD_ENV     = local.env
    DD_SERVICE = local.judicial_backend_service_name
    DD_VERSION = local.judicial_backend_dd_version

    # --- service-defined env (backend .ts) ---
    DOKOBIT_URL                             = "https://developers.dokobit.com"
    EMAIL_REGION                            = "eu-west-1"
    S3_REGION                               = "eu-west-1"
    S3_BUCKET                               = module.infra_outputs.upload_bucket_id
    S3_TIME_TO_LIVE_POST                    = "15"
    S3_TIME_TO_LIVE_GET                     = "5"
    LAWYER_REGISTRY_INCLUDE_TEST_LAWYERS    = "true"
    CONTENTFUL_HOST                         = "preview.contentful.com"
    CONTENTFUL_ENVIRONMENT                  = "test"
    CLIENT_URL                              = "https://${local.judicial_host}"
    SQS_QUEUE_NAME                          = module.infra_outputs.sqs_queue_name
    SQS_DEAD_LETTER_QUEUE_NAME              = module.infra_outputs.sqs_dlq_name
    SQS_REGION                              = "eu-west-1"
    BLOCKED_API_INTEGRATION                 = ""
    USE_MICROSOFT_GRAPH_API_FOR_COURT_ROBOT = "false"
    AUDIT_TRAIL_USE_GENERIC_LOGGER          = "false"
    AUDIT_TRAIL_GROUP_NAME                  = local.audit_log_group_name
    AUDIT_TRAIL_REGION                      = "eu-west-1"
    NOVA_SENDER_NAME                        = "Island Dev"

    # DB (JM-34): plain env; DB_PASS via parameter_store_secret_names.
    DB_HOST          = module.infra_outputs.rds_cluster_endpoint
    DB_REPLICAS_HOST = module.infra_outputs.rds_cluster_reader_endpoint
    DB_USER          = "judicial_system"
    DB_NAME          = "judicial_system"

    # X-Road (non-secret config) — real islandis dev values. The backend's
    # CourtClientModule validates ALL XROAD_* at boot (presence check) and
    # exits(1) if absent. Secret creds are placeholder shells. NOT a cutover.
    XROAD_BASE_PATH                    = "http://securityserver.dev01.devland.is"
    XROAD_BASE_PATH_WITH_ENV           = "http://securityserver.dev01.devland.is/r1/IS-DEV"
    XROAD_TLS_BASE_PATH                = "https://securityserver.dev01.devland.is"
    XROAD_TLS_BASE_PATH_WITH_ENV       = "https://securityserver.dev01.devland.is/r1/IS-DEV"
    XROAD_CLIENT_ID                    = "IS-DEV/GOV/10014/Rettarvorslugatt-Client"
    XROAD_COURT_MEMBER_CODE            = "10019"
    XROAD_POLICE_MEMBER_CODE           = "10005"
    XROAD_DMR_MEMBER_CODE              = "10014"
    XROAD_COURT_API_PATH               = "/Domstolasyslan/JusticePortal-v1"
    XROAD_POLICE_API_PATH              = "/Logreglan-Private/rettarvarsla-v1"
    XROAD_DMR_CRIMINAL_RECORD_API_PATH = "/DMR-Protected/sakaskra-dev"

    # Redis EXCLUDED (JM-30); empty JSON array satisfies requiredJSON loaders
    # without a cluster (ioredis Cluster is lazy). Keeps Redis excluded.
    REDIS_NODES = "[]"
  }

  secretsmanager_secret_names = {
    NOVA_URL                                 = module.infra_outputs.secret_names["backend/NOVA_URL"]
    NOVA_USERNAME                            = module.infra_outputs.secret_names["backend/NOVA_USERNAME"]
    NOVA_PASSWORD                            = module.infra_outputs.secret_names["backend/NOVA_PASSWORD"]
    COURTS_MOBILE_NUMBERS                    = module.infra_outputs.secret_names["backend/COURTS_MOBILE_NUMBERS"]
    COURTS_ASSISTANT_MOBILE_NUMBERS          = module.infra_outputs.secret_names["backend/COURTS_ASSISTANT_MOBILE_NUMBERS"]
    COURTS_EMAILS                            = module.infra_outputs.secret_names["backend/COURTS_EMAILS"]
    COURT_OF_APPEALS_ASSISTANT_EMAILS        = module.infra_outputs.secret_names["backend/COURT_OF_APPEALS_ASSISTANT_EMAILS"]
    DOKOBIT_ACCESS_TOKEN                     = module.infra_outputs.secret_names["backend/DOKOBIT_ACCESS_TOKEN"]
    EMAIL_FROM                               = module.infra_outputs.secret_names["backend/EMAIL_FROM"]
    EMAIL_FROM_NAME                          = module.infra_outputs.secret_names["backend/EMAIL_FROM_NAME"]
    EMAIL_REPLY_TO                           = module.infra_outputs.secret_names["backend/EMAIL_REPLY_TO"]
    EMAIL_REPLY_TO_NAME                      = module.infra_outputs.secret_names["backend/EMAIL_REPLY_TO_NAME"]
    POLICE_INSTITUTIONS_EMAILS               = module.infra_outputs.secret_names["backend/POLICE_INSTITUTIONS_EMAILS"]
    PRISON_EMAIL                             = module.infra_outputs.secret_names["backend/PRISON_EMAIL"]
    PRISON_ADMIN_EMAIL                       = module.infra_outputs.secret_names["backend/PRISON_ADMIN_EMAIL"]
    PUBLIC_PROSECUTOR_CRIMINAL_RECORDS_EMAIL = module.infra_outputs.secret_names["backend/PUBLIC_PROSECUTOR_CRIMINAL_RECORDS_EMAIL"]
    AUTH_JWT_SECRET                          = module.infra_outputs.secret_names["shared/AUTH_JWT_SECRET"]
    ADMIN_USERS                              = module.infra_outputs.secret_names["backend/ADMIN_USERS"]
    BACKEND_ACCESS_TOKEN                     = module.infra_outputs.secret_names["shared/BACKEND_ACCESS_TOKEN"]
    CONTENTFUL_ACCESS_TOKEN                  = module.infra_outputs.secret_names["shared/CONTENTFUL_ACCESS_TOKEN"]
    EVENT_URL                                = module.infra_outputs.secret_names["backend/EVENT_URL"]
    ERROR_EVENT_URL                          = module.infra_outputs.secret_names["backend/ERROR_EVENT_URL"]
    ARCHIVE_ENCRYPTION_KEY                   = module.infra_outputs.secret_names["backend/ARCHIVE_ENCRYPTION_KEY"]
    COURT_ROBOT_CLIENT_ID                    = module.infra_outputs.secret_names["backend/COURT_ROBOT_CLIENT_ID"]
    COURT_ROBOT_TENANT_ID                    = module.infra_outputs.secret_names["backend/COURT_ROBOT_TENANT_ID"]
    COURT_ROBOT_CLIENT_SECRET                = module.infra_outputs.secret_names["backend/COURT_ROBOT_CLIENT_SECRET"]
    COURT_ROBOT_USER                         = module.infra_outputs.secret_names["backend/COURT_ROBOT_USER"]
    COURT_ROBOT_EMAIL                        = module.infra_outputs.secret_names["backend/COURT_ROBOT_EMAIL"]
    CONFIGCAT_SDK_KEY                        = module.infra_outputs.secret_names["shared/CONFIGCAT_SDK_KEY"]
    LAWYERS_ICELAND_API_KEY                  = module.infra_outputs.secret_names["shared/LAWYERS_ICELAND_API_KEY"]

    # X-Road creds — PLACEHOLDER shells (judicial_xroad_secrets). Present so the
    # backend boots; real values seeded in the X-Road milestone.
    XROAD_CLIENT_CERT        = module.infra_outputs.xroad_secret_names["backend/XROAD_CLIENT_CERT"]
    XROAD_CLIENT_KEY         = module.infra_outputs.xroad_secret_names["backend/XROAD_CLIENT_KEY"]
    XROAD_CLIENT_PEM         = module.infra_outputs.xroad_secret_names["backend/XROAD_CLIENT_PEM"]
    XROAD_COURTS_CREDENTIALS = module.infra_outputs.xroad_secret_names["backend/XROAD_COURTS_CREDENTIALS"]
    XROAD_POLICE_API_KEY     = module.infra_outputs.xroad_secret_names["backend/XROAD_POLICE_API_KEY"]
  }

  # DB_PASS lives in SSM Parameter Store (JM-34).
  parameter_store_secret_names = {
    DB_PASS = "/ecs/judicial-system/DB_PASSWORD"
  }

  # Task role (replaces island.is IRSA): S3 upload bucket + SQS + SES (JM-35).
  tasks_iam_role_statements = [
    {
      sid       = "JudicialS3Upload"
      effect    = "Allow"
      actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
      resources = ["${module.infra_outputs.upload_bucket_arn}/*"]
    },
    {
      sid       = "JudicialS3ListBucket"
      effect    = "Allow"
      actions   = ["s3:ListBucket"]
      resources = [module.infra_outputs.upload_bucket_arn]
    },
    {
      sid    = "JudicialSqs"
      effect = "Allow"
      actions = [
        "sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage",
        "sqs:GetQueueAttributes", "sqs:GetQueueUrl"
      ]
      resources = [
        module.infra_outputs.sqs_queue_arn,
        module.infra_outputs.sqs_dlq_arn
      ]
    },
    {
      sid       = "JudicialSes"
      effect    = "Allow"
      actions   = ["ses:SendEmail", "ses:SendRawEmail"]
      resources = ["*"]
    },
    local.audit_log_task_statement,
  ]
}
