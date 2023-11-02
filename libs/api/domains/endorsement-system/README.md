# API Domains Endorsement System

This library routes requests to the endorsement system app.

## Generate types and api clients

This library uses types and api clients from the endorsement system generated via [openapi generator](https://openapi-generator.tech/).  
To generate api clients and types first run:  
`yarn nx run services-endorsement-api:schemas/build-openapi` (build fresh openapi schema in endorsement system app)  
Then run:  
`yarn nx run api-domains-endorsement-system:schemas/openapi-generator` (creates clients and types inside this domain)

## Running unit tests

Run `ng test api-domains-endorsement-system` to execute the unit tests via [Jest](https://jestjs.io).
