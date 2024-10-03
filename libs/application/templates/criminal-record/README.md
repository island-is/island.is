## Criminal Record Application

This library was generated with [Nx](https://nx.dev). Use the following command to generate it using Yarn:

```
yarn generate @nrwl/node:lib application/templates/criminal-record
```

## Setup

Before setting up the Þjóðskrá connection, ensure you have the following AWS environment variables. These can be acquired from the AWS Management Console: <https://island-is.awsapps.com/start>.

```bash
export AWS_ACCESS_KEY_ID="<access_key_id>"
export AWS_SECRET_ACCESS_KEY="<secret_access_key>"
export AWS_SESSION_TOKEN="<session_token>"
```

### Proxy X-Road Socat Service (v2)

To set up the proxy for the X-Road socat service (v2), execute:

```bash
./scripts/run-xroad-proxy.sh
```

### Proxy X-Road Socat Service (v1)

Before running the v1 proxy, update the Kubernetes configuration. This step might only be necessary once:

```bash
aws eks update-kubeconfig --name dev-cluster01 --profile <profile-name> --region eu-west-1
```

Lastly, fetch all necessary secrets.

## Running the Application Locally

To serve the application locally, execute the following commands in separate terminal windows:

```bash
yarn start api
yarn start application-system-api
yarn start application-system-form
yarn start services-user-profile
```

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run the following command:

```bash
nx test application-templates-criminal-record
```

## Code Owners and Maintainers

- [Unnur Sól](https://github.com/unnursolingimars) - @unnursol
- Jón Bjarni
- [Jóhanna Agnes](https://github.com/johannaagma) - @johannaagma
