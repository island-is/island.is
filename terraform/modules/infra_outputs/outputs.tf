# Flat, service-facing view of the foundation. Keys match what the ecs_service
# module inputs expect, so service modules read module.infra_outputs.<x>.

# --- network ---
output "vpc_id" {
  value = data.terraform_remote_state.network.outputs.vpc_id
}

output "private_subnets" {
  value = data.terraform_remote_state.network.outputs.private_subnets
}

output "public_subnets" {
  value = data.terraform_remote_state.network.outputs.public_subnets
}

# --- ecs_cluster ---
output "ecs_cluster_name" {
  value = data.terraform_remote_state.ecs_cluster.outputs.cluster_name
}

output "ecs_namespace_id" {
  value = data.terraform_remote_state.ecs_cluster.outputs.namespace_id
}

# --- alb (public, shared) ---
output "alb_https_listener_arn" {
  value = data.terraform_remote_state.alb.outputs.alb_https_listener
}

output "alb_security_group_id" {
  value = data.terraform_remote_state.alb.outputs.applications_alb_security_group
}

# Map of created ALB records keyed by the alb unit's `records` entries,
# e.g. route_53_record_names["judicial-system"] = "judicial-system.<domain>".
output "alb_route53_record_names" {
  value = data.terraform_remote_state.alb.outputs.route_53_record_names
}

output "alb_dns_name" {
  value = data.terraform_remote_state.alb.outputs.dns_name
}

# --- hosted zone (foundation-owned) ---
# The ecs_service module requires alb_zone_id / alb_dns_name / hosted_zone_name
# unconditionally, but only USES them when create_record = true. All judicial
# services set create_record = false (the foundation alb unit + CloudFront own
# the records), so these are satisfied with real zone values and never consumed
# to create a record. The DMR alb module does not output its own zone_id, so we
# pass the hosted zone id (harmless; unused while create_record = false).
output "hosted_zone_name" {
  value = data.terraform_remote_state.hosted_zone.outputs.zone_name
}

output "hosted_zone_id" {
  value = data.terraform_remote_state.hosted_zone.outputs.zone_id
}

# --- shared services security group (infra-owned) ---
output "services_shared_sg_id" {
  value = data.terraform_remote_state.services_sg.outputs.security_group_id
}

# --- database (Aurora) ---
output "rds_cluster_endpoint" {
  value = data.terraform_remote_state.database.outputs.cluster_endpoint
}

output "rds_cluster_reader_endpoint" {
  value = data.terraform_remote_state.database.outputs.cluster_reader_endpoint
}

# --- secrets (logical key -> full Secrets Manager name) ---
output "secret_names" {
  value = data.terraform_remote_state.judicial_secrets.outputs.secret_names
}

output "xroad_secret_names" {
  value = data.terraform_remote_state.judicial_xroad_secrets.outputs.secret_names
}

# --- S3 upload bucket ---
output "upload_bucket_id" {
  value = data.terraform_remote_state.judicial_upload_bucket.outputs.s3_bucket_id
}

output "upload_bucket_arn" {
  value = data.terraform_remote_state.judicial_upload_bucket.outputs.s3_bucket_arn
}

# --- SQS ---
output "sqs_queue_name" {
  value = data.terraform_remote_state.judicial_sqs.outputs.queue_name
}

output "sqs_queue_arn" {
  value = data.terraform_remote_state.judicial_sqs.outputs.queue_arn
}

output "sqs_dlq_name" {
  value = data.terraform_remote_state.judicial_sqs.outputs.dlq_name
}

output "sqs_dlq_arn" {
  value = data.terraform_remote_state.judicial_sqs.outputs.dlq_arn
}
