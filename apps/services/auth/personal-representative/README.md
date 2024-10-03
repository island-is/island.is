````markdown
# Personal Representative

## About

A service to store and maintain personal representatives and their authorization to act on behalf of represented individuals.

## Context

This database and API enable the Ministry of Social Affairs to define rights for personal representatives and manage their connections with represented individuals.

The API allows for managing right types, personal representative types (currently one type), and connections between a representative and the person they represent.

### Example of Connections

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

The Service API is accessible via X-Road security servers, limited to clients with specific scope.

Currently, access is restricted to the Personal Representative Contract System by Spektra for the rights agency.

### Scope

```plaintext
@island.is/auth/personal-representative-admin
```

### X-Road Setup

[X-Road Information](https://docs.devland.is/technical-overview/x-road/x-road-system-requirements)

#### Setup URLs

- Dev: [Swagger-JSON Dev](https://personal-representative-xrd.internal.dev01.devland.is/swagger-json)
- Staging: [Swagger-JSON Staging](https://personal-representative-xrd.internal.staging01.devland.is/swagger-json)
- Production: [Swagger-JSON Production](https://personal-representative-xrd.internal.innskra.island.is/swagger-json)

### OpenAPI URL

OpenAPI documentation:

- [Swagger Dev](https://personal-representative-xrd.dev01.devland.is/swagger)

### Service Provider Usage

Service providers won't access the service API directly. They may:

- Set up X-Road to use [PublicAPI](https://docs.devland.is/apps/services/auth/personal-representative-public)
- Use [Digital Iceland's](https://www.notion.so/Identity-Server-Integration-afde614a247e4b9da4731b2ace1115cd) new login option for Personal Representative use, mapping rights to scope.

## Development

### Initial Setup

First, ensure docker is installed, then run:

```bash
yarn dev-services services-auth-ids-api
```

Run migrations:

```bash
yarn nx run services-auth-ids-api:migrate
```

To serve the service locally:

```bash
yarn start services-auth-personal-representative
```

Open API specs are accessible at:

```plaintext
http://localhost:3376
```

### Testing

Run local tests:

```bash
yarn test services-auth-personal-representative
```

### Getting Started

Run the service:

```bash
yarn start services-auth-personal-representative
```

### Project Owner

- Ministry of Social Affairs Rights Protection Agency

### Code Owners and Maintainers

- [Programm](https://github.com/orgs/island-is/teams/programm/members)

```

```
