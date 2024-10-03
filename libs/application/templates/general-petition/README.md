## General Petitions

This application enables users to create general petitions.

### Setup

To initialize the docker environment (one-time setup):

```bash
yarn dev-init application-templates-general-petition
```

To start all required services:

```bash
yarn dev application-templates-general-petition
```

Ensure your setup meets the [Application System requirements](https://docs.devland.is/apps/application-system).

#### Additional Setup

Additional steps are necessary for local setup.

#### National Registry Provider

**Prerequisites:**

- `kubectl` must be installed:
  - `brew install kubectl`
- [AWS Secrets](../../../../handbook/repository/aws-secrets.md) must be configured.

Obtain environment variables by running:
```bash
yarn get-secrets service-portal
```

**Kubeconfig:**

Export AWS variables:
```bash
aws eks update-kubeconfig --name dev-cluster01
```

#### Current User Companies Provider

Ensure the following environment variable is set:

```bash
RSK_API_PASSWORD
```

To retrieve environment variables:
```bash
yarn get-secrets service-portal
```

### Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni)