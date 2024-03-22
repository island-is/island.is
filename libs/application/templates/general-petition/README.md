# General Petitions

This application allows individuals to create general petitions

## Setup

Simply run this command:

```bash
yarn dev application-templates-general-petition
```

This template runs within the application system, make sure your setup fulfills
requirements set by the [Application System](https://docs.devland.is/apps/application-system)

### Additional setup

There are additional steps required to run this template locally

### National Registry Provider

1. Prerequisites
    - You have `kubectl` installed (`brew install kubectl`)
    - You have [AWS Secrets](https://docs.devland.is/development/getting-started#aws-secrets)
      configured

2. Make sure the following environment variables are set:

    ```bash
    SOFFIA_PASS
    SOFFIA_USER
    ```

    A good way to get environment variables is to run `yarn get-secrets service-portal`

3. Get `kubeconfig`
    - Export AWS variables `aws eks update-kubeconfig --name dev-cluster01`

4. Port-forward for the national registry (Þjóðskrá)
    - Run `kubectl port-forward svc/socat-soffia 8443:443 -n socat`
    - Keep this process running while running the project

### Current user companies provider

Make sure the following environment variable is set

```bash
RSK_API_PASSWORD
```

- A good way to get environment variables is to run `yarn get-secrets service-portal`

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni)
