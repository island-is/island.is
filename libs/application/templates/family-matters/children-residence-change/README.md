## Children Residence Change Template

This template is used for applications for changing a child's residence, developed for the County Magistrate of Iceland by Kolibri.

### Setup

For detailed setup instructions, refer to the [Application System Setup](https://docs.devland.is/apps/application-system).

#### Local Setup Instructions

To run this template locally, follow these steps:

##### Prerequisites for National Registry Provider

- Ensure `kubectl` is installed:
  ```bash
  brew install kubectl
  ```

- Configure [AWS Secrets](../../../../handbook/repository/aws-secrets.md).

1. **Fetch Development Secrets**
   - Run:
     ```bash
     yarn get-secrets service-portal
     ```

2. **Configure Kubeconfig**
   - Export AWS variables and update kubeconfig:
     ```bash
     aws eks update-kubeconfig --name dev-cluster01
     ```
   - Keep this terminal session active while running the project.

#### Test User Credentials

For testing in local, development, and staging environments, use: Gervimaður Evrópa login: `0102719`.

### Code Owners and Maintainers

- Managed by [Kolibri](https://github.com/orgs/island-is/teams/kolibri-modern-family).