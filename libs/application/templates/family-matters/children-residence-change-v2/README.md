# Children Residence Change Template

This is an application template for children residence change created for the County Magistrate of Iceland by Kolibri.

## Setup

Application System setup: [Setup](https://docs.devland.is/apps/application-system)

### Additional setup

There are additional steps required to run this template locally

#### National Registry Provider

Prerequisites

- You have `kubectl` installed
  - `brew install kubectl`
- You have [AWS Secrets](../../../../handbook/repository/aws-secrets.md) configured

1. Fetch development secrets for the project

- Run `yarn get-secrets service-portal`

2. Get kubeconfig

- Export aws variables `aws eks update-kubeconfig --name dev-cluster01`

3. Socat Þjóðskrá

- Run `kubectl port-forward svc/socat-soffia 8443:443 -n socat`
- Keep this process running while running the project

### Test user

For testing on local, dev and staging use the Gervimaður Evrópa login: 0102719

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri-modern-family)
