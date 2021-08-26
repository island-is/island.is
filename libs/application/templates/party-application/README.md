# Party Application

This application allows political parties to announce candidacy.

## Setup

To setup the docker environment run (this only needs to be run once):

```bash
yarn nx run application-templates-party-application:dev/init
```

To start all required services:

```bash
yarn nx run application-templates-party-application:dev
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

## Code owners and maintainers

- [Kosmos & Kaos](https://github.com/orgs/island-is/teams/kosmos-kaos)
