# Personal Representative Public

## About

A service that is responsible for giving third party service providers information about personal representatives and their rights

## Context

The purpose of the Public API for the Personal Representative Database is to allow Service providers ,that are unable or unwilling to use Digital Iceland’s login service, to get information about personal representatives and their clients to give the personal representative access to services on behalf of the client according to the rights given in the contract and connection.

The API allows service providers to get information about possible rights as well as the connections a single personal representative has to clients.

The service providers are required to use secure logins and only query by logged in users.

### Example of connections

| **Personal representative** | **Represented person** | **Rights**                                         |
| --------------------------- | ---------------------- | -------------------------------------------------- |
| 1122334459                  | 1223455569             | health-data, personal-data, limited-financial-data |
| 1020304059                  | 0203050569             | limited-health-data                                |

### JSON expample of connection

```json
{
  "personalRepresentativeTypeCode": "personal_representative_for_disabled_person",
  "nationalIdPersonalRepresentative": "0123456789",
  "nationalIdRepresentedPerson": "0123456789",
  "rights": ["health", "finance"]
}
```

## Access

The PublicAPI is only accessible through X-Road security servers and only to machine clients with specific scope

### Scope

```
@island.is/auth/personal-representative-public
```

### X-Road setup

[X-Road information](https://docs.devland.is/technical-overview/x-road/x-road-system-requirements)

Urls for X-Road setup are as follows

- Dev: [https://personal-representative-public-xrd.internal.dev01.devland.is/swagger-json](https://personal-representative-public-xrd.internal.dev01.devland.is/swagger-json)
- Staging: [https://personal-representative-public-xrd.internal.staging01.devland.is/swagger-json](https://personal-representative-public-xrd.internal.staging01.devland.is/swagger-json)
- Production: [https://personal-representative-public-xrd.internal.innskra.island.is/swagger-json](https://personal-representative-public-xrd.internal.innskra.island.is/swagger-json)

### OpenAPI URL

OpenAPI documentation and demoing at

- [https://personal-representative-public-xrd.dev01.devland.is/swagger](https://personal-representative-public-xrd.dev01.devland.is/swagger)

## Development

### Initial setup

We are using the same service library and database as auth-api and therefore this step by step represents that
First, make sure you have docker, then run:

```bash
yarn dev-services services-auth-api
```

Then run the migrations:

```bash
yarn nx run services-auth-api:migrate
```

You can serve this service locally by running:

```bash
yarn start services-personal-representative-public
```

Api open api specs will now be accessible at

```bash
http://localhost:3378
```

### Testing

You can run tests for this service locally by running:

```bash
yarn test services-personal-representative-public
```

### Getting started

```bash
yarn start services-personal-representative-public
```

### Project owner

- Réttindagæsla velferðarráðuneytisins

### Code owners and maintainers

- [Programm](https://github.com/orgs/island-is/teams/programm/members)
