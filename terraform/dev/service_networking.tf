# ALB <-> task security-group wiring.
#
# The APRÓ ecs_service module only creates the ALB->task ingress rule when it
# manages its OWN task security group (i.e. when security_group_ingress_rules /
# security_group_egress_rules are set). We pass a pre-created SHARED services SG
# via security_group_ids instead, so the module does NOT open the ALB->task path.
# The old in-repo module opened it automatically; here we declare it explicitly
# (gagni-style cross-SG rules), both directions, on the service container port.
#
# Without these two rules the ALB health checks cannot reach the tasks on :3333
# ("Reachability may be impacted" on the ALB; targets stay unhealthy).

locals {
  service_container_port = 3333
}

# Tasks (shared services SG) accept traffic from the ALB SG on the app port.
resource "aws_security_group_rule" "alb_to_services" {
  type                     = "ingress"
  from_port                = local.service_container_port
  to_port                  = local.service_container_port
  protocol                 = "tcp"
  security_group_id        = module.infra_outputs.services_shared_sg_id
  source_security_group_id = module.infra_outputs.alb_security_group_id
  description              = "ALB to judicial ECS tasks on ${local.service_container_port}"
}

# ALB may egress to the tasks (shared services SG) on the app port.
resource "aws_security_group_rule" "alb_egress_to_services" {
  type                     = "egress"
  from_port                = local.service_container_port
  to_port                  = local.service_container_port
  protocol                 = "tcp"
  security_group_id        = module.infra_outputs.alb_security_group_id
  source_security_group_id = module.infra_outputs.services_shared_sg_id
  description              = "ALB to judicial ECS tasks on ${local.service_container_port}"
}
