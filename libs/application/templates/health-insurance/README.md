````markdown
# Health Insurance Application

Application for health insurance when moving back to Iceland after living abroad.

## Running Unit Tests

To execute the unit tests via [Jest](https://jestjs.io), run:

```bash
nx test application-templates-health-insurance
```
````

## Setup

To start the application system, follow the instructions in the [handbook](https://docs.devland.is/apps/application-system).

## Additional Setup

Additional steps are required to run this template locally.

### Prerequisites

- Ensure `kubectl` is installed:
  ```bash
  brew install kubectl
  ```
- Configure [AWS Secrets](../../../../handbook/repository/aws-secrets.md).

#### Get kubeconfig

- Export AWS variables:
  ```bash
  aws eks update-kubeconfig --name dev-cluster01
  ```

### Health Insurance Providers

1. Fetch the development secrets for the project.

   - TODO

2. Setup Socat XRoad:
   - Run the following command and keep the process running while working on the project:
     ```bash
     kubectl -n socat port-forward svc/socat-xroad 8080:80
     ```

### National Registry Provider

1. Fetch the development secrets for the project:
   ```bash
   yarn get-secrets service-portal
   ```

### User Profile Provider (Optional)

To start the user profile service, follow the instructions in the [handbook](https://docs.devland.is/apps/services/user-profile). Note that this service is optional as there is a fallback for development.

### Translations from Contentful

Fetch the development secrets using:

```bash
yarn get-secrets api
```

## Code Owners and Maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte)

```

```
