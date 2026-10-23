# Audit trail log group (libs/judicial-system/audit-trail).
#
# backend and api (and later xrd-api + digital-mailbox-api) write audit events
# straight to CloudWatch via winston-cloudwatch when
# AUDIT_TRAIL_USE_GENERIC_LOGGER=false. On island.is the group was
# k8s/judicial-system/audit-log; we drop the k8s prefix on ECS.
#
# winston-cloudwatch calls DescribeLogStreams, CreateLogStream and PutLogEvents
# (CreateLogGroup only if the group is missing — it never is, Terraform owns it).

locals {
  audit_log_group_name = "judicial-system/audit-log"

  audit_log_task_statement = {
    sid    = "JudicialAuditTrail"
    effect = "Allow"
    actions = [
      "logs:DescribeLogStreams",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = [
      aws_cloudwatch_log_group.audit.arn,
      "${aws_cloudwatch_log_group.audit.arn}:*",
    ]
  }
}

resource "aws_cloudwatch_log_group" "audit" {
  name              = local.audit_log_group_name
  retention_in_days = 365
  tags              = local.common_tags
}
