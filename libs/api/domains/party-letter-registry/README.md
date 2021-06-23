# API Domains Party Letter Registry

This library routes requests to the party letter registry service.
This library also serves to limit public access to the party letter registry.

## Generate types and api clients

This library uses types and api clients from the the party letter registry service generated via [openapi generator](https://openapi-generator.tech/).  
To generate api clients and types first run:  
`yarn nx run services-party-letter-registry-api:schemas/build-openapi` (build fresh openapi schema in party letter registry service)  
Then run:  
`yarn nx run services-party-letter-registry-api:schemas/openapi-generator` (creates clients and types inside this domain)
