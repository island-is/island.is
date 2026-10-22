terraform {
  backend "s3" {
    encrypt = true
    # Reuses the judicial infrastructure state bucket with a dedicated service
    # key so app state is isolated from the infrastructure state.
    bucket = "dev-dmr-judicial-terraform-state"
    key    = "services/judicial-system/terraform.tfstate"
    region = "eu-west-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  required_version = ">= 1.9.8"
}

provider "aws" {
  region = local.aws_region
  default_tags {
    tags = local.common_tags
  }
}

# us-east-1 (CloudFront/ACM-global, if needed later).
provider "aws" {
  alias  = "us"
  region = "us-east-1"
  default_tags {
    tags = local.common_tags
  }
}
