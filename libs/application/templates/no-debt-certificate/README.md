# No Debt Certificate Application

This library was generated with [Nx](https://nx.dev).

## Setup

Run these two proxy clients for Þjóðskrá connection.

### X-Road Proxy v2 Setup

1. Set AWS environment variables (obtain from AWS):

   ```bash
   export AWS_ACCESS_KEY_ID="<access_key_id>"
   export AWS_SECRET_ACCESS_KEY="<secret_access_key>"
   export AWS_SESSION_TOKEN="<session_token>"
   ```

2. Start the proxy:

   ```bash
   ./scripts/run-xroad-proxy.sh
   ```

### X-Road Proxy v1 Setup

1. Configure the Kubernetes context (may be needed only once):

   ```bash
   aws eks update-kubeconfig --name dev-cluster01 --profile <profile-name> --region eu-west-1
   ```

2. Fetch all necessary secrets.

### Running Locally

To serve the app locally, run the following commands:

```bash
yarn start api
yarn start application-system-api
yarn start application-system-form
yarn start services-user-profile
```

## Running Unit Tests

Execute unit tests with [Jest](https://jestjs.io) using:

```bash
nx test application-templates-no-debt-certificate
```

## Code Owners and Maintainers

- [Unnur Sól - @unnursol](https://github.com/unnursolingimars)
- Jón Bjarni
- [Jóhanna Agnes - @johannaagma](https://github.com/johannaagma)
