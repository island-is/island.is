# api-catalogue-services

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `ng test api-catalogue-services` to execute the unit tests via [Jest](https://jestjs.io).

## Usage

This library export ApiCatalogueServiceModule which depends on two environment variables to exist
to configure connection to X-Road Security Server.

The variables are available from AWS Parameter Store under the /k8s/xroad-collector/ path.
The variable are named:

- XROAD_BASE_PATH
- XROAD_CLIENT_ID
