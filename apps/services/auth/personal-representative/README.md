````markdown
# Personal Representative

## Overview

This service manages personal representatives and their authority to act for represented individuals.

## Context

The database and API enable the Ministry of Social Affairs to define rights for personal representatives and manage their connections with those they represent. The API facilitates managing right types, personal representative types (currently only one type), and the links between a representative and the represented person.

### Connection Examples

| **Personal Representative** | **Represented Person** | **Rights**                                         |
| --------------------------- | ---------------------- | -------------------------------------------------- |
| 1122334459                  | 1223455569             | health-data, personal-data, limited-financial-data |
| 1020304059                  | 0203050569             | limited-health-data                                |

### JSON Example of Connection

```json
{
  "id": "guid",
  "personalRepresentativeTypeCode": "personal_representative_for_disabled_person",
  "contractId": "99",
  "externalUserId": "usernameA",
  "nationalIdPersonalRepresentative": "0123456789",
  "nationalIdRepresentedPerson": "0123456789",
  "validTo": "2022-02-04T11:26:25.159Z",
  "rightCodes": ["health-data", "finance-data"]
}
```
````

## Access

The API is accessible via X-Road security servers to clients with specific scope, currently limited to the Personal Representative Contract System by Spektra.

### Scope

```plaintext
@island.is/auth/personal-representative-admin
```

### X-Road Information

Refer to [X-Road Information](https://docs.devland.is/technical-overview/x-road/x-road-system-requirements).

#### Setup URLs

- Dev: [Swagger-JSON Dev](https://personal-representative-xrd.internal.dev01.devland.is/swagger-json)
- Staging: [Swagger-JSON Staging](https://personal-representative-xrd.internal.staging01.devland.is/swagger-json)
- Production: [Swagger-JSON Production](https://personal-representative-xrd.internal.innskra.island.is/swagger-json)

### OpenAPI Documentation

- [Swagger Dev](https://personal-representative-xrd.dev01.devland.is/swagger)

### Service Provider Usage

Service providers won't access the API directly. They may:

- Set up X-Road with [PublicAPI](https://docs.devland.is/apps/services/auth/personal-representative-public)
- Use [Digital Iceland's](https://www.notion.so/Identity-Server-Integration-afde614a247e4b9da4731b2ace1115cd) login option for Personal Representative use, mapping rights to scope.

## Development

### Initial Setup

Ensure Docker is installed, then run:

```bash
yarn dev-services services-auth-ids-api
```

Run migrations:

```bash
yarn nx run services-auth-ids-api:migrate
```

To serve locally:

```bash
yarn start services-auth-personal-representative
```

Open API specs are available at:

```plaintext
http://localhost:3376
```

### Testing

Run tests locally:

```bash
yarn test services-auth-personal-representative
```

### Getting Started

Launch the service:

```bash
yarn start services-auth-personal-representative
```

### Project Ownership

- Ministry of Social Affairs Rights Protection Agency

### Code Owners and Maintainers

- [Programm](https://github.com/orgs/island-is/teams/programm/members)

```

```
