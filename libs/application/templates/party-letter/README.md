# Party Letter

This application allows governmental parties to get assigned a party letter for upcoming elections

## Setup

Application System setup: [Setup](https://github.com/island-is/island.is/tree/main/apps/application-system)

### Additional setup

There are additional steps required to run this template locally

### National Registry Provider

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

2. Make sure the following environment variables are set:

```bash
SOFFIA_PASS
SOFFIA_USER
```

- A good way to get environment variables is to run `yarn get-secrets service-portal`

3. Get kubeconfig

- Export aws variables `aws eks update-kubeconfig --name dev-cluster01`

4. Socat Þjóðskrá

- Run `kubectl port-forward svc/socat-soffia 8443:443 -n socat`
- Keep this process running while running the project

### Current user companies provider

Make sure the following environment variable is set

```bash
RSK_API_PASSWORD
```

- A good way to get environment variables is to run `yarn get-secrets service-portal`

## Code owners and maintainers

- [Kosmos & Kaos](https://github.com/orgs/island-is/teams/kosmos-kaos)
