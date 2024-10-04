# Health Insurance

Application for health insurance when returning to Iceland after living abroad.

## Running Unit Tests

Execute the unit tests via [Jest](https://jestjs.io) with:

```bash
nx test application-templates-health-insurance
```

## Setup

To start the application system, follow the handbook instructions [here](https://docs.devland.is/apps/application-system).

## Additional Setup

### Prerequisites

- Install `kubectl`

  ```bash
  brew install kubectl
  ```

- Configure [AWS Secrets](https://docs.devland.is/development/aws-secrets)

#### Get Kubeconfig

- Export AWS variables:

  ```bash
  aws eks update-kubeconfig --name dev-cluster01
  ```

### Health Insurance Providers

1. Fetch development secrets for the project (TODO).

2. Socat XRoad:

   - Run:

     ```bash
     kubectl -n socat port-forward svc/socat-xroad 8080:80
     ```

   - Keep this running while using the project.

### National Registry Provider

- Fetch development secrets with:

  ```bash
  yarn get-secrets service-portal
  ```

### User Profile Provider (Optional)

- Start the user profile service by following instructions [here](https://docs.devland.is/apps/services/user-profile).

This service is optional; there is a fallback for development.

### Translations from Contentful

Fetch development secrets with:

```bash
yarn get-secrets api
```

## Code Owners and Maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte)
