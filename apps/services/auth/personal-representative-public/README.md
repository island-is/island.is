# Personal Representative Public

## About

A service responsible for providing third-party service providers with information about personal representatives and their rights.

## Context

The purpose of the Public API for the Personal Representative Database is to enable service providers, who are unable or unwilling to use Digital Iceland’s login service, to access information about personal representatives and their clients. This facilitates granting the personal representative access to services on behalf of the client according to the rights specified in the contract and connection.

The API allows service providers to retrieve information about possible rights as well as the connections a single personal representative has to clients.

Service providers are required to use secure logins and only query based on logged-in users.

### Example of Connections

| **Personal Representative** | **Represented Person** | **Rights**                                         |
| --------------------------- | ---------------------- | -------------------------------------------------- |
| 1122334459                  | 1223455569             | health-data, personal-data, limited-financial-data |
| 1020304059                  | 0203050569             | limited-health-data                                |

### JSON Example of Connection

```json
{
  "personalRepresentativeTypeCode": "personal_representative_for_disabled_person",
  "nationalIdPersonalRepresentative": "0123456789",
  "nationalIdRepresentedPerson": "0123456789",
  "rights": ["health", "finance"]
}
```

## Access

The Public API is accessible only through X-Road security servers and exclusively to machine clients with a specific scope.

### Scope

```
@island.is/auth/personal-representative-public
```

### X-Road Setup

For information on X-Road, refer to [X-Road documentation](https://docs.devland.is/technical-overview/x-road/x-road-system-requirements).

URLs for X-Road setup are as follows:

- Dev: [https://personal-representative-public-xrd.internal.dev01.devland.is/swagger-json](https://personal-representative-public-xrd.internal.dev01.devland.is/swagger-json)
- Staging: [https://personal-representative-public-xrd.internal.staging01.devland.is/swagger-json](https://personal-representative-public-xrd.internal.staging01.devland.is/swagger-json)
- Production: [https://personal-representative-public-xrd.internal.innskra.island.is/swagger-json](https://personal-representative-public-xrd.internal.innskra.island.is/swagger-json)

### OpenAPI URL

OpenAPI documentation and demo can be accessed at:

- [https://personal-representative-public-xrd.dev01.devland.is/swagger](https://personal-representative-public-xrd.dev01.devland.is/swagger)

## Development

### Initial Setup

We are using the same service library and database as auth-api. Therefore, follow the steps below:

First, ensure you have Docker installed, then run:

```bash
yarn dev-services services-auth-ids-api
```

Then, run the migrations:

```bash
yarn nx run services-auth-ids-api:migrate
```

You can serve this service locally by running:

```bash
yarn start services-auth-personal-representative-public
```

The API OpenAPI specs will be accessible at:

```bash
http://localhost:3378
```

### Testing

To run tests for this service locally, use:

```bash
yarn test services-auth-personal-representative-public
```

### Getting Started

```bash
yarn start services-auth-personal-representative-public
```

### Project Owner

- Réttindagæsla velferðarráðuneytisins

### Code Owners and Maintainers

- [Programm](https://github.com/orgs/island-is/teams/programm/members)
