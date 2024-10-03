## Children Residence Change Template

This template is used for children residence change applications, developed for the County Magistrate of Iceland by Kolibri.

### Setup

For setting up the Application System, refer to: [Setup](https://docs.devland.is/apps/application-system)

#### Additional Local Setup

To run this template locally, follow these steps:

##### National Registry Provider Prerequisites

- Ensure `kubectl` is installed:
  ```bash
  brew install kubectl
  ```
- Configure [AWS Secrets](../../../../handbook/repository/aws-secrets.md).

1. **Fetch Development Secrets**

   - Execute:
     ```bash
     yarn get-secrets service-portal
     ```

2. **Get Kubeconfig**

   - Export AWS variables and update kubeconfig:
     ```bash
     aws eks update-kubeconfig --name dev-cluster01
     ```
   - Keep this terminal session active while running the project.

#### Test User

For testing in local, development, and staging environments, use the following credentials: Gervimaður Evrópa login: `0102719`.

### Code Owners and Maintainers

- Managed by [Kolibri](https://github.com/orgs/island-is/teams/kolibri-modern-family).
