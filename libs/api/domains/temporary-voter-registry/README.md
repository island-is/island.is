# API Domains Temporary Voter Registry

This library routes requests to the temporary voter registry service.
This library also serves to limit public access to the temporary voter registry.

## Generate types and api clients

This library uses types and api clients from the temporary voter registry service generated via [openapi generator](https://openapi-generator.tech/).  
To generate api clients and types first run:  
`yarn nx run services-temporary-voter-registry-api:schemas/build-openapi` (build fresh openapi schema in temporary voter registry service)  
Then run:  
`yarn nx run services-temporary-voter-registry-api:schemas/openapi-generator` (creates clients and types inside this domain)
