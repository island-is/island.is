# X-Road Collector

The X-Road collector uses the [X-Road Service Metadata] and
[X-Road Service Metadata for REST] to collect information
about services registered in the X-Road environment.

## Developing

### Codegen

We use codegen to generate clients from the OpenAPI documents for the
two REST services X-Road provides for this metadata. In `workspace.json`
we have setup two `codegen` commands and to use them from the cli you do:

```
# Generates clients from X-Road Service Metadata
yarn nx run services-xroad-collector:codegen-xrd

# Generates clients from X-Road Service Metadata for REST
yarn nx run services-xroad-collector:codegen-xrd-rest
```

### X-Road Security Server

There are two options while developing this service against X-Road Security Server.
Either run a standalone Security Server using [Docker](https://hub.docker.com/r/niis/xroad-security-server-standalone):

```
# Publish the container ports (4000, 443 and 80) to localhost (loopback address)
# using the latest docker image available. See docker hub for specific tags for specific version.
docker run -p 4000:4000 -p 80:80 -p 443:443 --name ss niis/xroad-security-server-standalone
```

Developer can now access Security Server AdminUI on `https://localhost:4000`
to register custom services and clients for testing.

or connect to Stafrænt Ísland X-Road Dev environment
**ToDo add description how you use the X-Road Dev environment**

Then to test the commands using `curl` in cli you can do:

```
# List clients
curl -H "Accept: application/json" http://localhost/listClients
```

```
# List services for specific client
curl -H "Accept: application/json" -H "X-Road-Client: CS/ORG/1111/TestService" http://localhost/r1/CS/ORG/1111/TestService/listMethods
```

```
# Petstore have previously been added to the TestService client using the AdminUI
curl -H "Accept: application/json" -H "X-Road-Client: CS/ORG/1111/TestService" http://localhost/r1/CS/ORG/1111/TestService/getOpenAPI?serviceCode=petstore
```

_Note:_ For SÍ X-Road dev environment the localhost changes to the dns provided
by DevOps and {xroadInstance}/{memberClass}/{memberCode}/{subsystemCode} needs
appropriate changes.

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
