# judicial-system-scheduler — daily job (ECS/Fargate task on a schedule).
#
# Source: island.is apps/judicial-system/scheduler/infra/scheduler.ts
# A k8s CronJob there, `0 2,9 * * *` (UTC). The app runs once and exits: it
# archives cases, queues post-hearing jobs on SQS, resets the lawyer registry
# and delivers verdict service certificates, all through backend.
#
# Uses the APRÓ scheduled_ecs_tasks module, the standard way to run a
# scheduled task on ECS: EventBridge rule -> Step Functions -> ECS RunTask
# (sync, so a non-zero exit fails the run), with SNS success/failure topics.
#
# dd_enabled = false on purpose: the Datadog agent is an essential sidecar that
# never exits, so the task would never finish. Logs go to CloudWatch instead.

locals {
  judicial_scheduler_task_name = "judicial-system-scheduler"
  judicial_scheduler_image     = "${local.shared_ecr_registry}/judicial-system-scheduler:${local.judicial_scheduler_image_tag}"
}

module "judicial_scheduler" {
  # module source must be a string literal — keep the version in sync with the other services.
  source = "s3::https://apro-terraform-modules.s3.eu-west-1.amazonaws.com/v3.26.1/scheduled_ecs_tasks.zip"

  name_prefix      = local.judicial_scheduler_task_name
  env              = local.env
  ecs_cluster_name = module.infra_outputs.ecs_cluster_name
  subnet_ids       = module.infra_outputs.private_subnets
  security_groups  = [module.infra_outputs.services_shared_sg_id]

  # EventBridge cron runs in UTC, same as the k8s CronJob.
  schedule_expression  = "cron(0 2,9 * * ? *)"
  schedule_description = "Every day at 02:00 and 09:00 UTC"

  dd_enabled = false

  tasks = [
    {
      name             = local.judicial_scheduler_task_name
      container_image  = local.judicial_scheduler_image
      cpu_architecture = "X86_64"
      container_cpu    = 256
      container_memory = 512
      command          = ["node", "main.cjs"]

      environment_variables = {
        NODE_OPTIONS = "--max-old-space-size=384"
        LOG_LEVEL    = "info"

        BACKEND_URL                = local.backend_internal_url
        SQS_QUEUE_NAME             = module.infra_outputs.sqs_queue_name
        SQS_DEAD_LETTER_QUEUE_NAME = module.infra_outputs.sqs_dlq_name
        SQS_REGION                 = local.aws_region
        TIME_TO_LIVE_MINUTES       = "30"
      }

      secretsmanager_secret_names = {
        BACKEND_ACCESS_TOKEN = module.infra_outputs.secret_names["shared/BACKEND_ACCESS_TOKEN"]
      }

      # Scheduler only queues messages; message-handler consumes them.
      task_policy_json = jsonencode({
        Version = "2012-10-17"
        Statement = [{
          Sid      = "JudicialSqsSend"
          Effect   = "Allow"
          Action   = ["sqs:SendMessage", "sqs:GetQueueUrl", "sqs:GetQueueAttributes"]
          Resource = [module.infra_outputs.sqs_queue_arn]
        }]
      })
    }
  ]
}
