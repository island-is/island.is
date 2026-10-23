# judicial-system-message-handler — SQS worker (ECS/Fargate), no ingress.
#
# Source: island.is apps/judicial-system/message-handler/infra/message-handler.ts
# Long-polls the judicial SQS queue and POSTs each message to backend's
# /api/internal/... routes. backend does the real work (email, SMS, court and
# police deliveries over X-Road).
#
# Uses the APRÓ ecs_service_worker module: an ECS service with no ALB, no
# listener rule and no target group. The app still listens on 3366, but only
# for its own /liveness, which the container health check calls.

locals {
  judicial_message_handler_service_name = "judicial-system-message-handler"
  judicial_message_handler_image        = "${local.shared_ecr_registry}/judicial-system-message-handler:${local.judicial_message_handler_image_tag}"
  judicial_message_handler_dd_version   = split("_", local.judicial_message_handler_image_tag)[1]
}

module "judicial_message_handler" {
  # module source must be a string literal — keep the version in sync with the other services.
  source = "s3::https://apro-terraform-modules.s3.eu-west-1.amazonaws.com/v3.26.1/ecs_service_worker.zip"

  service_name = local.judicial_message_handler_service_name
  env          = local.env

  cluster_name       = module.infra_outputs.ecs_cluster_name
  subnet_ids         = module.infra_outputs.private_subnets
  security_group_ids = [module.infra_outputs.services_shared_sg_id]

  container_image  = local.judicial_message_handler_image
  cpu_architecture = "X86_64"
  container_cpu    = 512
  container_memory = 512

  # One consumer, like island.is. More would just share the same queue.
  desired_count      = 1
  enable_autoscaling = false

  # Image has node but no curl; Node 22 has fetch built in. startPeriod covers
  # the app's 10 s SQS_WAIT_TIME_SECONDS pause before it starts listening.
  container_health_check = {
    command = [
      "CMD-SHELL",
      "node -e \"fetch('http://localhost:3366/liveness').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\"",
    ]
    startPeriod = 60
  }

  dd_enabled      = true
  dd_service_name = local.judicial_message_handler_service_name
  dd_tags = {
    service = local.judicial_message_handler_service_name
    version = local.judicial_message_handler_dd_version
  }

  environment_variables = {
    NODE_OPTIONS = "--max-old-space-size=384"
    LOG_LEVEL    = "info"

    DD_ENV     = local.env
    DD_SERVICE = local.judicial_message_handler_service_name
    DD_VERSION = local.judicial_message_handler_dd_version

    BACKEND_URL                = local.backend_internal_url
    SQS_QUEUE_NAME             = module.infra_outputs.sqs_queue_name
    SQS_DEAD_LETTER_QUEUE_NAME = module.infra_outputs.sqs_dlq_name
    SQS_REGION                 = local.aws_region
  }

  secretsmanager_secret_names = {
    BACKEND_ACCESS_TOKEN = module.infra_outputs.secret_names["shared/BACKEND_ACCESS_TOKEN"]
  }
}

# ecs_service_worker has no tasks_iam_role_statements input; attach to its role.
# Receive/delete on the queue, send to the DLQ when a message keeps failing.
data "aws_iam_policy_document" "judicial_message_handler_sqs" {
  statement {
    sid    = "JudicialSqs"
    effect = "Allow"
    actions = [
      "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:ChangeMessageVisibility",
      "sqs:SendMessage", "sqs:GetQueueAttributes", "sqs:GetQueueUrl",
    ]
    resources = [
      module.infra_outputs.sqs_queue_arn,
      module.infra_outputs.sqs_dlq_arn,
    ]
  }
}

resource "aws_iam_role_policy" "judicial_message_handler_sqs" {
  name   = "sqs"
  role   = module.judicial_message_handler.tasks_iam_role_name
  policy = data.aws_iam_policy_document.judicial_message_handler_sqs.json
}
