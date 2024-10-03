# No Debt Certificate Application

This library was generated with [Nx](https://nx.dev). This guide provides instructions for setting up and running the application.

## Setup

Before starting, ensure you have the necessary AWS environment variables set up. These can be obtained from the [AWS Management Console](https://island-is.awsapps.com/start).

1. Set AWS environment variables:

   ```bash
   export AWS_ACCESS_KEY_ID="<access_key_id>"
   export AWS_SECRET_ACCESS_KEY="<secret_access_key>"
   export AWS_SESSION_TOKEN="<session_token>"
   ```

2. To proxy the X-Road socat service (v2), run:

   ```bash
   ./scripts/run-xroad-proxy.sh
   ```

3. To proxy the X-Road socat service (v1), execute the following command to update your kubeconfig (may be necessary only once):

   ```bash
   aws eks update-kubeconfig --name dev-cluster01 --profile <profile-name> --region eu-west-1
   ```

4. Fetch all necessary secrets.

### Running Locally

To serve the application locally, run the following commands:

```bash
yarn start api
yarn start application-system-api
yarn start application-system-form
yarn start services-user-profile
```

## Running Unit Tests

Execute the unit tests using [Jest](https://jestjs.io) by running:

```bash
nx test application-templates-no-debt-certificate
```

## Code Owners and Maintainers

- [Unnur Sól - @unnursol](https://github.com/unnursolingimars)
- Jón Bjarni
- [Jóhanna Agnes - @johannaagma](https://github.com/johannaagma)
