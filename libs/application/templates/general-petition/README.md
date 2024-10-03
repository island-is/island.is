````markdown
# General Petitions

This application allows individuals to create general petitions.

## Setup

### Docker Environment Setup

To set up the Docker environment, execute the following command (only needs to be done once):

```bash
yarn dev-init application-templates-general-petition
```
````

### Starting Required Services

To start all required services for the application, execute:

```bash
yarn dev application-templates-general-petition
```

Ensure your setup fulfills the requirements specified by the [Application System](https://docs.devland.is/apps/application-system).

### Additional Setup

Additional steps are required to run this template locally:

#### National Registry Provider

**Prerequisites:**

- Install `kubectl`:
  ```bash
  brew install kubectl
  ```
- Configure [AWS Secrets](../../../../handbook/repository/aws-secrets.md).

To retrieve environment variables, a useful command is:

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

To retrieve environment variables, a useful command is:

```bash
yarn get-secrets service-portal
```

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni)

```

```
