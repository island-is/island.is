# GitHub Actions -> AWS login (OIDC) for the judicial dev account.
#
# The account had no GitHub OIDC provider. This adds it, plus one CI role that
# only DMR-is/island.is workflows can assume. The role mirrors the shared
# account's github-ci role (ReadOnlyAccess) so CI can run `terraform plan`,
# plus scoped deploy rights so CI can `terraform apply` the ECS services.
#
# ECR push lives in the shared account (592944621100) and is granted there by
# the infrastructure repo's github-ci role, not by this file.

locals {
  github_org  = "DMR-is"
  github_repo = "island.is"
}

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  # AWS trusts GitHub's OIDC CA directly; no thumbprint needed (aws >= 5.81).
}

data "aws_iam_policy_document" "github_ci_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.github_org}/${local.github_repo}:*"]
    }
  }
}

resource "aws_iam_role" "github_ci" {
  name               = "${local.env}-judicial-system-github-ci-role"
  assume_role_policy = data.aws_iam_policy_document.github_ci_trust.json
}

resource "aws_iam_role_policy_attachment" "github_ci_readonly" {
  role       = aws_iam_role.github_ci.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

# `terraform plan` must lock and read the app state key in the infra state bucket.
data "aws_iam_policy_document" "github_ci_state" {
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["arn:aws:s3:::${local.infra_state_bucket}/services/judicial-system/*"]
  }
  statement {
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = ["arn:aws:s3:::${local.infra_state_bucket}"]
  }
}

resource "aws_iam_role_policy" "github_ci_state" {
  name   = "terraform-state"
  role   = aws_iam_role.github_ci.id
  policy = data.aws_iam_policy_document.github_ci_state.json
}

# `terraform apply` of this root: everything the ecs_service module manages.
# IAM writes are limited to the module's judicial-system-* roles and policies.
data "aws_iam_policy_document" "github_ci_deploy" {
  statement {
    sid    = "ServiceResources"
    effect = "Allow"
    actions = [
      "ecs:*",
      "elasticloadbalancing:*",
      "application-autoscaling:*",
      "codedeploy:*",
      "servicediscovery:*",
      "logs:*",
      "cloudwatch:PutMetricAlarm",
      "cloudwatch:DeleteAlarms",
      "route53:ChangeResourceRecordSets",
      "route53:GetChange",
      "ec2:CreateSecurityGroup",
      "ec2:DeleteSecurityGroup",
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:AuthorizeSecurityGroupEgress",
      "ec2:RevokeSecurityGroupIngress",
      "ec2:RevokeSecurityGroupEgress",
      "ec2:ModifySecurityGroupRules",
      "ec2:UpdateSecurityGroupRuleDescriptionsIngress",
      "ec2:UpdateSecurityGroupRuleDescriptionsEgress",
      "ec2:CreateTags",
      "ec2:DeleteTags",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "ServiceIam"
    effect = "Allow"
    actions = [
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:UpdateRole",
      "iam:UpdateAssumeRolePolicy",
      "iam:TagRole",
      "iam:UntagRole",
      "iam:AttachRolePolicy",
      "iam:DetachRolePolicy",
      "iam:PutRolePolicy",
      "iam:DeleteRolePolicy",
      "iam:CreatePolicy",
      "iam:DeletePolicy",
      "iam:CreatePolicyVersion",
      "iam:DeletePolicyVersion",
      "iam:TagPolicy",
      "iam:UntagPolicy",
    ]
    resources = [
      "arn:aws:iam::*:role/judicial-system-*",
      "arn:aws:iam::*:policy/judicial-system-*",
    ]
  }

  statement {
    sid       = "PassServiceRoles"
    effect    = "Allow"
    actions   = ["iam:PassRole"]
    resources = ["arn:aws:iam::*:role/judicial-system-*"]
    condition {
      test     = "StringEquals"
      variable = "iam:PassedToService"
      values   = ["ecs-tasks.amazonaws.com", "codedeploy.amazonaws.com", "application-autoscaling.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "github_ci_deploy" {
  name   = "terraform-deploy"
  role   = aws_iam_role.github_ci.id
  policy = data.aws_iam_policy_document.github_ci_deploy.json
}
