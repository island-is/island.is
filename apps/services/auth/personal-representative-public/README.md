Personal Representative Public

## About

This service provides third-party service providers with information about personal representatives and their rights.

## Context

The Public API for the Personal Representative Database allows service providers, not using Digital Iceland's login service, to access information about personal representatives and their clients. This enables personal representatives to access services on behalf of clients based on granted rights.

Service providers must use secure logins and can only query for data related to logged-in users.

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

The API is accessible via X-Road security servers to machine clients with a specific scope.

### Scope

```
@island.is/auth/personal-representative-public
```

### X-Road Setup

Information about X-Road: [X-Road documentation](https://docs.devland.is/technical-overview/x-road/x-road-system-requirements)

X-Road setup URLs:

- Dev: [Swagger JSON](https://personal-representative-public-xrd.internal.dev01.devland.is/swagger-json)
- Staging: [Swagger JSON](https://personal-representative-public-xrd.internal.staging01.devland.is/swagger-json)
- Production: [Swagger JSON](https://personal-representative-public-xrd.internal.innskra.island.is/swagger-json)

### OpenAPI URL

OpenAPI documentation and testing:

- [Swagger](https://personal-representative-public-xrd.dev01.devland.is/swagger)

## Development

### Initial Setup

Using the same service library and database as auth-api. Ensure Docker is installed, then run:

```bash
yarn dev-services services-auth-ids-api
```

Run database migrations:

```bash
yarn nx run services-auth-ids-api:migrate
```

Serve the service locally:

```bash
yarn start services-auth-personal-representative-public
```

API OpenAPI specs available at:

```
http://localhost:3378
```

### Testing

Run tests locally:

```bash
yarn test services-auth-personal-representative-public
```

### Getting Started

Start the service:

```bash
yarn start services-auth-personal-representative-public
```

### Project Owner

- Réttindagæsla velferðarráðuneytisins

### Code Owners and Maintainers

- [Programm Team](https://github.com/orgs/island-is/teams/programm/members)