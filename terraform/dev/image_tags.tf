# Deployed image tag per service, kept in SSM Parameter Store.
#
# CI (.github/workflows/ci.yml, deploy job) writes the new tag here, then runs
# `terraform apply`. Terraform reads the live value on refresh and ignores
# drift, so a manual apply never rolls a service back to an old tag. This is
# the "external party updates the image tag in a shared location" pattern from
# the APRÓ ecs_service module docs.
#
# The values below only seed the parameters on first create.

locals {
  initial_image_tags = {
    web     = "dev_94d0d52_U6FZPgfAKpXoheNp"
    api     = "dev_6f92630_VedP50IT5YwH4cCJ"
    backend = "dev_6f92630_VedP50IT5YwH4cCJ"
  }

  judicial_web_image_tag     = aws_ssm_parameter.image_tag["web"].insecure_value
  judicial_api_image_tag     = aws_ssm_parameter.image_tag["api"].insecure_value
  judicial_backend_image_tag = aws_ssm_parameter.image_tag["backend"].insecure_value
}

resource "aws_ssm_parameter" "image_tag" {
  for_each = local.initial_image_tags

  name           = "/judicial-system/${local.env}/${each.key}/image-tag"
  type           = "String"
  insecure_value = each.value

  lifecycle {
    ignore_changes = [insecure_value]
  }
}
