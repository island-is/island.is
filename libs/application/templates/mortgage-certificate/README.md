## Mortgage Certificate Application

This library was generated with [Nx](https://nx.dev). (yarn generate @nrwl/node:lib application/templates/mortgage-certificate)

## Setup

Run the following two proxy clients for the Þjóðskrá connection.

### Proxy the X-Road socat service (v2):

First, set the AWS environment variables (retrieve from <https://island-is.awsapps.com/start>):

```bash
export AWS_ACCESS_KEY_ID="<access_key_id>"
export AWS_SECRET_ACCESS_KEY="<secret_access_key>"
export AWS_SESSION_TOKEN="<session_token>"
```

Then, execute:

```bash
./scripts/run-xroad-proxy.sh
```

### Proxy the X-Road socat service (v1):

Initially, you may need to run this command (possibly only once):

```bash
aws eks update-kubeconfig --name dev-cluster01 --profile <profile-name> --region eu-west-1
```

Make sure to fetch all necessary secrets.

## Running Locally

You can serve this app locally by executing the following commands:

```bash
yarn start api
yarn start application-system-api
yarn start application-system-form
yarn start services-user-profile
```

## Running Unit Tests

Execute `nx test application-templates-mortgage-certificate` to run unit tests via [Jest](https://jestjs.io).

## Code Owners and Maintainers

- [Unnur Sól - @unnursol](https://github.com/unnursolingimars)
- Jón Bjarni (GitHub username not provided)
- [Jóhanna Agnes - @johannaagma](https://github.com/johannaagma)