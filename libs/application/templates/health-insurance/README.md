# Health Insurance

Application for health insurance when moving back to Iceland after living abroad.

## Running unit tests

Run `nx test application-templates-health-insurance` to execute the unit tests via [Jest](https://jestjs.io).

## Setup

To start the application system, follow the instructions in the handbook [here](https://docs.devland.is/handbook/apps/application-system).

## Additional setup

There are additional steps required to run this template locally

### Prerequisites

- You have `awscli` installed
  - `brew install awscli`
- You have access to the `island-is-development01` AWS account
  - Contact someone from the [Core team](https://github.com/orgs/island-is/teams/core)
- You have `jq` installed [JQ](https://stedolan.github.io/jq/)
  - `brew install jq`
- You have `kubectl` installed
  - `brew install kubectl`

#### Configure AWS

- Run `aws configure`
- Region should be set to `eu-west-1`
- Output should be set to `json`
- Add `aws_access_key_id`, `aws_secret_access_key` and `aws_session_token` from `island-is-development01` to your AWS credentials file `~/.aws/credentials`
- Or export them manually in the terminal

#### Get kubeconfig

- Export aws variables `aws eks update-kubeconfig --name dev-cluster01`

### Health Insurance Providers

1. Fetch development secrets for the project

- TODO

2. Socat XRoad

- Run `kubectl -n socat port-forward svc/socat-xroad 8080:80`
- Keep this process running while running the project

### National Registry Provider

1. Fetch development secrets for the project

- Run `yarn get-secrets service-portal`

2. Socat Þjóðskrá

- Run `kubectl port-forward svc/socat-soffia 8443:443 -n socat`
- Keep this process running while running the project

### User Profile Provider (optional)

- Follow the instructions to start the user profule service in the handbook [here](https://docs.devland.is/handbook/apps/services/user-profile).

This service is optional as there is a fallback for dev

### Translations from Contentful

Fetch development secrets

- Run `yarn get-secrets api`

## Code owners and maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte)
