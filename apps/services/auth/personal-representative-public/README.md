# Personal Representative Public

## About

Access information on personal representatives and their delegated rights for third-party service providers.

## Context

The Personal Representative Public API allows service providers to access info about personal representatives and their clients without Digital Iceland's login, enabling representatives to access services per their contracts.

Service providers should use secure logins and query info only for logged-in users.

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

The API is accessible only via X-Road security servers to machine clients with the specific scope.

### Scope

```text
@island.is/auth/personal-representative-public
```

### X-Road Setup

More details: [X-Road information](https://docs.devland.is/technical-overview/x-road/x-road-system-requirements).

X-Road setup URLs:

- Dev: [Swagger JSON](https://personal-representative-public-xrd.internal.dev01.devland.is/swagger-json)
- Staging: [Swagger JSON](https://personal-representative-public-xrd.internal.staging01.devland.is/swagger-json)
- Production: [Swagger JSON](https://personal-representative-public-xrd.internal.innskra.island.is/swagger-json)

### OpenAPI URL

Explore OpenAPI documentation:

- [Swagger](https://personal-representative-public-xrd.dev01.devland.is/swagger)

## Development

### Initial Setup

Requires the service library and database from auth-api.

Ensure Docker is installed, then execute:

```bash
yarn dev-services services-auth-ids-api
```

Run migrations:

```bash
yarn nx run services-auth-ids-api:migrate
```

Serve the service locally:

```bash
yarn start services-auth-personal-representative-public
```

You can now access the [Swagger UI](http://localhost:3378).

### Testing

Run local tests:

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
