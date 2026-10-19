variable "state_bucket_name" {
  description = "S3 bucket holding the judicial FOUNDATION terraform state (owned by the infra repo). e.g. dev-dmr-judicial-terraform-state."
  type        = string
}

variable "aws_region" {
  description = "AWS region of the foundation state bucket."
  type        = string
  default     = "eu-west-1"
}
