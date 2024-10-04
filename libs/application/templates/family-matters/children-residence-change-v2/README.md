# Children Residence Change Template

This application template is for children residence change requests submitted to the County Magistrate of Iceland by Kolibri.

## Setup

Refer to the [Application System setup](https://docs.devland.is/apps/application-system) for installation instructions.

### Additional Setup

To run this template locally, follow the steps below:

### National Registry Provider

#### Prerequisites

- Install `kubectl`. Use Homebrew: `brew install kubectl`
- Configure [AWS Secrets](https://docs.devland.is/development/aws-secrets)

#### Steps

1. Fetch development secrets for the project:
   - Run: `yarn get-secrets service-portal`

2. Obtain kubeconfig:
   - Export AWS variables: `aws eks update-kubeconfig --name dev-cluster01`
   - Keep this process running during project work.

### Test User

Use the Gervimaður Evrópa login `0102719` for local, dev, and staging environments.

## Code Owners and Maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri-modern-family)

