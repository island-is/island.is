# General Petitions

This application enables users to create general petitions.

## Setup

To initialize the Docker environment (one-time setup):

```bash
yarn dev-init application-templates-general-petition
```

To start all required services:

```bash
yarn dev application-templates-general-petition
```

Ensure your setup meets the [Application System requirements](https://docs.devland.is/apps/application-system).

### Additional Setup

Further steps are required for local setup.

### National Registry Provider

**Prerequisites:**

- Install `kubectl`:
  - `brew install kubectl`
- [AWS Secrets](https://docs.devland.is/development/aws-secrets) should be configured.

To obtain environment variables, run:

```bash
yarn get-secrets service-portal
```

**Kubeconfig:**

Update the kubeconfig:

```bash
aws eks update-kubeconfig --name dev-cluster01
```

### Current User Companies Provider

Ensure the following environment variable is set:

```bash
RSK_API_PASSWORD
```

To retrieve environment variables:

```bash
yarn get-secrets service-portal
```

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni)
