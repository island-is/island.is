```markdown
# Services

This library was generated with [Nx](https://nx.dev).

The library utilizes the [X-Road Service Metadata](https://github.com/nordic-institute/X-Road/blob/develop/doc/Protocols/pr-meta_x-road_service_metadata_protocol.md#openapi-definition) and [X-Road Service Metadata for REST](https://github.com/nordic-institute/X-Road/blob/develop/doc/Protocols/pr-mrest_x-road_service_metadata_protocol_for_rest.md#annex-a-service-descriptions-for-rest-metadata-services) to gather information about services registered in the X-Road environment.

## Running Unit Tests

Execute `ng test api-catalogue-services` to run the unit tests via [Jest](https://jestjs.io).

## Usage

This library exports `ApiCatalogueServiceModule`, which requires two environment variables for configuring the connection to the X-Road Security Server. These variables are stored in AWS Parameter Store under the `/k8s/xroad-collector/` path. The variables are:

- `XROAD_BASE_PATH`
- `XROAD_CLIENT_ID`

## Developing

### Code Generation

Code generation is employed to create clients from the OpenAPI documents for the two REST services provided by X-Road for this metadata. Use the `codegen` command in `project.json`:

```bash
# Generates clients
yarn nx run services-xroad-collector:codegen/frontend-client
```

### X-Road Security Server

You have two options for developing this service against the X-Road Security Server:

1. **Standalone Security Server using Docker:**

```bash
# Publish the container ports (4000, 443, and 80) to localhost (loopback address)
# using the latest Docker image available. See Docker Hub for specific tags for specific versions.
docker run -p 4000:4000 -p 80:80 -p 443:443 --name ss niis/xroad-security-server-standalone
```

Access the Security Server AdminUI at `https://localhost:4000` to register custom services and clients for testing.

2. **Connect to Stafrænt Ísland X-Road Dev environment using Kubernetes port-forwarding:**

```bash
# Pre-requisite: Set AWS authentication environment parameters in the current shell
# Get Kubernetes namespaces from the dev cluster using AWS
aws eks update-kubeconfig --name dev-cluster01 --region eu-west-1

# Port forward to the Kubernetes cluster
kubectl -n socat port-forward svc/socat-xroad 8080:80
```

#### Testing Commands

You can test the setup using `curl` in the CLI:

```bash
# List clients
curl -H "Accept: application/json" http://localhost/listClients

# or when using IS-DEV X-Road environment
curl -H "Accept: application/json" http://localhost:8080/listClients
```

```bash
# List services for a specific client
curl -H "Accept: application/json" -H "X-Road-Client: CS/ORG/1111/TestService" http://localhost/r1/CS/ORG/1111/TestService/listMethods

# or when using IS-DEV X-Road environment
curl -H "Accept: application/json" -H "X-Road-Client: IS-DEV/GOV/10000/island-is-client" http://localhost:8080/r1/IS-DEV/GOV/10000/island-is-protected/listMethods
```

```bash
# Retrieve OpenAPI description for the petstore service after adding it to the
# TestService via the AdminUI in the standalone X-Road Security Server
curl -H "Accept: application/json" -H "X-Road-Client: CS/ORG/1111/TestService" http://localhost/r1/CS/ORG/1111/TestService/getOpenAPI?serviceCode=petstore

# or when using IS-DEV X-Road environment
curl -H "Accept: application/json" -H "X-Road-Client: IS-DEV/GOV/10000/island-is-client" http://localhost:8080/r1/IS-DEV/GOV/10000/island-is-protected/getOpenAPI?serviceCode=petstore-v1
```

[NIIS X-Road Playground](https://x-road.global/xroad-playground) is available at:

- Central Server's Security Server: <https://niisss01.playground.x-road.global:4000>
- Service Consumer's Security Server: <https://testcomss01.playground.x-road.global:4000>
- Service Provider's Security Server: <https://testagess01.playground.x-road.global:4000>
```