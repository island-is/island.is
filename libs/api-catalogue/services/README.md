# Services

This library is generated with [Nx](https://nx.dev) and utilizes the [X-Road Service Metadata] and [X-Road Service Metadata for REST] to gather information about services registered in the X-Road environment.

## Running Unit Tests

Execute unit tests via [Jest](https://jestjs.io) with:

```bash
ng test api-catalogue-services
```

## Usage

The library exports `ApiCatalogueServiceModule` which requires two environment variables for configuring the connection to the X-Road Security Server. These variables are available from the AWS Parameter Store under the `/k8s/xroad-collector/` path:

- `XROAD_BASE_PATH`
- `XROAD_CLIENT_ID`

## Developing

### Code Generation

To generate clients from OpenAPI documents for the X-Road REST services, run the `codegen` command defined in `project.json`:

```bash
yarn nx run services-xroad-collector:codegen/frontend-client
```

### X-Road Security Server

You can work with the X-Road Security Server in two ways:

1. **Standalone Security Server**  
   Run with [Docker](https://hub.docker.com/r/niis/xroad-security-server-standalone):

   ```bash
   docker run -p 4000:4000 -p 80:80 -p 443:443 --name ss niis/xroad-security-server-standalone
   ```

   Access the Security Server AdminUI at `https://localhost:4000`.

2. **Stafrænt Ísland X-Road Dev Environment**  
   Use Kubernetes port-forwarding:

   ```bash
   aws eks update-kubeconfig --name dev-cluster01 --region eu-west-1
   kubectl -n socat port-forward svc/socat-xroad 8080:80
   ```

### Testing with Curl

#### List Clients

```bash
curl -H "Accept: application/json" http://localhost/listClients
```

For IS-DEV X-Road environment:

```bash
curl -H "Accept: application/json" http://localhost:8080/listClients
```

#### List Services for Specific Client

```bash
curl -H "Accept: application/json" -H "X-Road-Client: CS/ORG/1111/TestService" http://localhost/r1/CS/ORG/1111/TestService/listMethods
```

For IS-DEV X-Road environment:

```bash
curl -H "Accept: application/json" -H "X-Road-Client: IS-DEV/GOV/10000/island-is-client" http://localhost:8080/r1/IS-DEV/GOV/10000/island-is-protected/listMethods
```

#### Retrieve OpenAPI Specification

```bash
curl -H "Accept: application/json" -H "X-Road-Client: CS/ORG/1111/TestService" http://localhost/r1/CS/ORG/1111/TestService/getOpenAPI?serviceCode=petstore
```

For IS-DEV X-Road environment:

```bash
curl -H "Accept: application/json" -H "X-Road-Client: IS-DEV/GOV/10000/island-is-client" http://localhost:8080/r1/IS-DEV/GOV/10000/island-is-protected/getOpenAPI?serviceCode=petstore-v1
```

[NIIS X-Road Playground] access:

- Central Server: https://niisss01.playground.x-road.global:4000
- Service Consumer: https://testcomss01.playground.x-road.global:4000
- Service Provider: https://testagess01.playground.x-road.global:4000

[X-Road Service Metadata]: https://github.com/nordic-institute/X-Road/blob/develop/doc/Protocols/pr-meta_x-road_service_metadata_protocol.md#openapi-definition
[X-Road Service Metadata for REST]: https://github.com/nordic-institute/X-Road/blob/develop/doc/Protocols/pr-mrest_x-road_service_metadata_protocol_for_rest.md#annex-a-service-descriptions-for-rest-metadata-services
[NIIS X-Road Playground]: https://x-road.global/xroad-playground