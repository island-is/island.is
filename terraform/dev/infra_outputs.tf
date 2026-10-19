module "infra_outputs" {
  source            = "../modules/infra_outputs"
  state_bucket_name = local.infra_state_bucket
  aws_region        = local.aws_region
}
