```markdown
# Children Residence Change Template

This application template is designed for the children residence change process for the County Magistrate of Iceland, created by Kolibri.

## Setup

For a comprehensive guide on setting up the Application System, refer to: [Setup Documentation](https://docs.devland.is/apps/application-system)

### Additional Setup

To run this template locally, follow these additional steps:

#### National Registry Provider

**Prerequisites:**

- Ensure `kubectl` is installed:
  - Use the command: `brew install kubectl`
- Configure your [AWS Secrets](../../../../handbook/repository/aws-secrets.md)

**Steps:**

1. Fetch development secrets for the project:

   - Execute: `yarn get-secrets service-portal`

2. Configure Kubernetes:
   - Export AWS variables using: `aws eks update-kubeconfig --name dev-cluster01`
   - Maintain an active session while running the project locally.

### Test User

For local, development, and staging testing, use the Gervimaður Evrópa login credentials: 0102719

## Code Owners and Maintainers

- [Kolibri Team](https://github.com/orgs/island-is/teams/kolibri-modern-family)
```
