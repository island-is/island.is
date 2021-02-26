# Children Residence Change Template

This is an application template for children residence change created for the County Magistrate of Iceland by Kolibri.

## Setup

Application System setup: [Setup](https://github.com/island-is/island.is/tree/main/apps/application-system)

### Additional setup

There are additional steps required to run this template locally

#### National Registry Provider

Prerequisites

- You have `awscli` installed
  - `brew install awscli`
- You have access to the `island-is-development01` AWS account
  - Contact someone from the [Core team](https://github.com/orgs/island-is/teams/core)
- You have `jq` installed [JQ](https://stedolan.github.io/jq/)
  - `brew install jq`
- You have `kubectl` installed
  - `brew install kubectl`

1. Configure AWS

- Run `aws configure`
- Region should be set to `eu-west-1`
- Output should be set to `json`
- Add `aws_access_key_id`, `aws_secret_access_key` and `aws_session_token` from `island-is-development01` to your AWS credentials file `~/.aws/credentials`

2. Fetch development secrets for the project

- Run `yarn env-secrets service-portal`

3. Get kubeconfig

- Export aws variables `aws eks update-kubeconfig --name dev-cluster01`

4. Socat Þjóðskrá

- Run `kubectl port-forward svc/socat-soffia 8443:443 -n socat`
- Keep this process running while running the project

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri-modern-family)
