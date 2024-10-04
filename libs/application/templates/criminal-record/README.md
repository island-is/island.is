# Criminal Record Application Documentation

This library was generated with [Nx](https://nx.dev). Run using `yarn generate @nrwl/node:lib application/templates/criminal-record`.

## Setup

Run the proxy clients for Þjóðskrá connection:

### Proxy X-Road Socat Service (v2)

Enter AWS environment variables (obtain from [AWS Console](https://island-is.awsapps.com/start)):

```bash
export AWS_ACCESS_KEY_ID="<access_key_id>"
export AWS_SECRET_ACCESS_KEY="<secret_access_key>"
export AWS_SESSION_TOKEN="<session_token>"
```

Run the script:

```bash
./scripts/run-xroad-proxy.sh
```

### Proxy X-Road Socat Service (v1)

First run (possibly only once):

```bash
aws eks update-kubeconfig --name dev-cluster01 --profile <profile-name> --region eu-west-1
```

Fetch necessary secrets.

## Running Locally

Start the app locally with:

```bash
yarn start api
yarn start application-system-api
yarn start application-system-form
yarn start services-user-profile
```

## Running Unit Tests

Run unit tests with [Jest](https://jestjs.io) using:

```bash
yarn nx test application-templates-criminal-record
```

## Code Owners and Maintainers

- [Unnur Sól - @unnursol](https://github.com/unnursolingimars)
- [Jón Bjarni]()
- [Jóhanna Agnes - @johannaagma](https://github.com/johannaagma)