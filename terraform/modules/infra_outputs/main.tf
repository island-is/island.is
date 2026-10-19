# infra_outputs — read-only view of the judicial infrastructure state, which is
# owned and applied by the infra repo (clients/DMR/infrastructure/judicial).
#
# Mirrors the gagni `accelerator_outputs` pattern: a bundle of
# `terraform_remote_state` reads against the infra repo's S3 state bucket
# (<env>-dmr-judicial-terraform-state), one key per Terragrunt component, re-
# exposed as flat outputs the service modules consume. This repo NEVER mutates
# the infrastructure — it only reads it and stamps out the ECS services.

terraform {
  required_version = ">= 1.9.8"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "network/terraform.tfstate"
    region = var.aws_region
  }
}

data "terraform_remote_state" "ecs_cluster" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "ecs_cluster/terraform.tfstate"
    region = var.aws_region
  }
}

data "terraform_remote_state" "alb" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "alb/terraform.tfstate"
    region = var.aws_region
  }
}

data "terraform_remote_state" "hosted_zone" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "hosted_zone/terraform.tfstate"
    region = var.aws_region
  }
}

data "terraform_remote_state" "database" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "database/terraform.tfstate"
    region = var.aws_region
  }
}

data "terraform_remote_state" "services_sg" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "judicial_services_sg/terraform.tfstate"
    region = var.aws_region
  }
}

data "terraform_remote_state" "judicial_secrets" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "judicial_secrets/terraform.tfstate"
    region = var.aws_region
  }
}

data "terraform_remote_state" "judicial_xroad_secrets" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "judicial_xroad_secrets/terraform.tfstate"
    region = var.aws_region
  }
}

data "terraform_remote_state" "judicial_upload_bucket" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "judicial_upload_bucket/terraform.tfstate"
    region = var.aws_region
  }
}

data "terraform_remote_state" "judicial_sqs" {
  backend = "s3"
  config = {
    bucket = var.state_bucket_name
    key    = "judicial_sqs/terraform.tfstate"
    region = var.aws_region
  }
}
