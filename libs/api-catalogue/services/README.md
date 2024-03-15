# Services

This library was generated with [Nx](https://nx.dev).

The library uses the [X-Road Service Metadata] and
[X-Road Service Metadata for REST] to collect information
about services registered in the X-Road environment.

## Running unit tests

Run `ng test api-catalogue-services` to execute the unit tests via [Jest](https://jestjs.io).

## Usage

This library export ApiCatalogueServiceModule which depends on two
environment variables to exist to configure connection to X-Road Security Server.

The variables are available from AWS Parameter Store under the /k8s/xroad-collector/ path.
The variable are named:

- XROAD_BASE_PATH
- XROAD_CLIENT_ID

## Developing

### Codegen

We use codegen to generate clients from the OpenAPI documents for the
two REST services X-Road provides for this metadata. In `project.json`
we have setup a `codegen` command:

```
# Generates clients
yarn nx run services-xroad-collector:codegen/frontend-client
```

### X-Road Security Server

There are two options while developing this service against
X-Road Security Server. Either run a standalone Security Server using
[Docker](https://hub.docker.com/r/niis/xroad-security-server-standalone):

```
# Publish the container ports (4000, 443 and 80) to localhost (loopback address)
# using the latest docker image available. See docker hub for specific tags for specific version.
docker run -p 4000:4000 -p 80:80 -p 443:443 --name ss niis/xroad-security-server-standalone
```

Developer can now access Security Server AdminUI on `https://localhost:4000`
to register custom services and clients for testing.

or connect to Stafrænt Ísland X-Road Dev environment using kubernetes
port-forwarding:

```
# Pre-requisite: AWS authentication env params added to the current shell
# Get kubernetes namespaces from the dev cluster using AWS
aws eks update-kubeconfig --name dev-cluster01 --region eu-west-1

# Port forward to the kubernetes cluster
kubectl -n socat port-forward svc/socat-xroad 8080:80
```

Then to test the commands using `curl` in cli you can do:

```
# List clients
curl -H "Accept: application/json" http://localhost/listClients

# or when using IS-DEV X-Road environment
curl -H "Accept: application/json" http://localhost:8080/listClients
```

```
# List services for specific client
curl -H "Accept: application/json" -H "X-Road-Client: CS/ORG/1111/TestService" http://localhost/r1/CS/ORG/1111/TestService/listMethods

# or when using IS-DEV X-Road environment
curl -H "Accept: application/json" -H "X-Road-Client: IS-DEV/GOV/10000/island-is-client" http://localhost:8080/r1/IS-DEV/GOV/10000/island-is-protected/listMethods
```

```
# When using standalone X-Road Security Server and after adding petstore to the
# TestService using the AdminUI
curl -H "Accept: application/json" -H "X-Road-Client: CS/ORG/1111/TestService" http://localhost/r1/CS/ORG/1111/TestService/getOpenAPI?serviceCode=petstore

# or when using IS-DEV X-Road environment
curl -H "Accept: application/json" -H "X-Road-Client: IS-DEV/GOV/10000/island-is-client" http://localhost:8080/r1/IS-DEV/GOV/10000/island-is-protected/getOpenAPI?serviceCode=petstore-v1
```

[NIIS X-Road Playground] is available at:

- Central Server's Security Server:
  https://niisss01.playground.x-road.global:4000

- Service consumer's Security Server:
  https://testcomss01.playground.x-road.global:4000

- Service provider's Security Server:
  https://testagess01.playground.x-road.global:4000

[x-road service metadata]: https://github.com/nordic-institute/X-Road/blob/develop/doc/Protocols/pr-meta_x-road_service_metadata_protocol.md#openapi-definition
[x-road service metadata for rest]: https://github.com/nordic-institute/X-Road/blob/develop/doc/Protocols/pr-mrest_x-road_service_metadata_protocol_for_rest.md#annex-a-service-descriptions-for-rest-metadata-services
[niis x-road playground]: https://x-road.global/xroad-playground
