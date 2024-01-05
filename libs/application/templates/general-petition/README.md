# General Petitions

This application allows individuals to create general petitions

## Setup

To setup the docker environment run (this only needs to be run once):

```bash
yarn dev-init application-templates-general-petition
```

To start all required services:

```bash
yarn dev application-templates-general-petition
```

This template runs within the application system, make sure your setup fulfills requirements set by the [Application System](https://docs.devland.is/apps/application-system)

### Additional setup

There are additional steps required to run this template locally

### National Registry Provider

Prerequisites

- You have `kubectl` installed
  - `brew install kubectl`
- You have [AWS Secrets](../../../../handbook/repository/aws-secrets.md) configured

1. Make sure the following environment variables are set:

```bash
SOFFIA_PASS
SOFFIA_USER
```

- A good way to get environment variables is to run `yarn get-secrets service-portal`

2. Get kubeconfig

- Export aws variables `aws eks update-kubeconfig --name dev-cluster01`

3. Socat Þjóðskrá

- Run `kubectl port-forward svc/socat-soffia 8443:443 -n socat`
- Keep this process running while running the project

### Current user companies provider

Make sure the following environment variable is set

```bash
RSK_API_PASSWORD
```

- A good way to get environment variables is to run `yarn get-secrets service-portal`

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni)
