# Mortgage Certificate Application

This library was created with [Nx](https://nx.dev).

## Setup

Run these two proxy clients for Þjóðskrá connection.

### X-Road Socat Service (v2)

Set AWS environment variables (obtain them from <https://island-is.awsapps.com/start>):

```bash
export AWS_ACCESS_KEY_ID="<access_key_id>"
export AWS_SECRET_ACCESS_KEY="<secret_access_key>"
export AWS_SESSION_TOKEN="<session_token>"
```

Then run:

```bash
./scripts/run-xroad-proxy.sh
```

### X-Road Socat Service (v1)

Execute the following (may be required only once):

```bash
aws eks update-kubeconfig --name dev-cluster01 --profile <profile-name> --region eu-west-1
```

### Fetch Secrets

Retrieve all necessary secrets.

## Running Locally

Serve the app locally with:

```bash
yarn start api
yarn start application-system-api
yarn start application-system-form
yarn start services-user-profile
```

## Running Unit Tests

Execute the unit tests using Jest with:

```bash
nx test application-templates-mortgage-certificate
```

## Code Owners and Maintainers

- [Unnur Sól - @unnursol](https://github.com/unnursolingimars)
- Jón Bjarni
- [Jóhanna Agnes - @johannaagma](https://github.com/johannaagma)
