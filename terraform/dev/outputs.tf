output "judicial_web_service_name" {
  description = "ECS service name for judicial-system-web."
  value       = module.judicial_web.ecs_service_name
}

output "judicial_api_service_name" {
  description = "ECS service name for judicial-system-api."
  value       = module.judicial_api.ecs_service_name
}

output "judicial_backend_service_name" {
  description = "ECS service name for judicial-system-backend."
  value       = module.judicial_backend.ecs_service_name
}

output "judicial_backend_task_role_arn" {
  description = "Task IAM role ARN for the backend (S3/SQS/SES grants attach here)."
  value       = module.judicial_backend.tasks_iam_role_arn
}
