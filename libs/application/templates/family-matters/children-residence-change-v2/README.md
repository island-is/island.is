# Children Residence Change Template

This application template is designed for children residence change requests for the County Magistrate of Iceland by Kolibri.

## Setup

Follow the [Application System setup](https://docs.devland.is/apps/application-system) for installation.

### Additional Setup

Follow these steps to run this template locally:

#### National Registry Provider

**Prerequisites**

- Ensure `kubectl` is installed.
  - You can install it via Homebrew: `brew install kubectl`
- Configure [AWS Secrets](../../../../handbook/repository/aws-secrets.md)

**Steps**

1. Fetch development secrets for the project:

   - Execute: `yarn get-secrets service-portal`

2. Get kubeconfig:
   - Export AWS variables: `aws eks update-kubeconfig --name dev-cluster01`
   - Keep this process running while working on the project.

### Test User

For local, dev, and staging testing, use the Gervimaður Evrópa login: `0102719`.

## Code Owners and Maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri-modern-family)
