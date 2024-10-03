```markdown
# Children Residence Change Template

This document outlines the setup and usage for the Children Residence Change application template, designed for the County Magistrate of Iceland by Kolibri.

## Setup

For information on setting up the application system, please refer to the following link: [Application System Setup](https://docs.devland.is/apps/application-system).

### Additional Setup

Additional setup steps are required to run this template locally.

#### National Registry Provider

**Prerequisites:**

- Ensure you have `kubectl` installed. You can install it using Homebrew:
  ```
  brew install kubectl
  ```
- Configure [AWS Secrets](../../../../handbook/repository/aws-secrets.md).

**Steps:**

1. **Fetch Development Secrets for the Project:**

   Execute the following command:
   ```
   yarn get-secrets service-portal
   ```

2. **Get Kubeconfig:**

   - Export AWS variables using the following command:
     ```
     aws eks update-kubeconfig --name dev-cluster01
     ```

   - Keep this process running while maintaining the project setup.

### Test User

For testing in local, development, or staging environments, use the Gervimaður Evrópa login: `0102719`.

## Code Owners and Maintainers

- For any issues, contact the [Kolibri Modern Family Team](https://github.com/orgs/island-is/teams/kolibri-modern-family).
```