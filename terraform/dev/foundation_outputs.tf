module "foundation_outputs" {
  source            = "../modules/foundation_outputs"
  state_bucket_name = local.foundation_state_bucket
  aws_region        = local.aws_region
}
