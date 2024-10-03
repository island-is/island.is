# Personal Representative

## About

A service responsible for storing and maintaining personal representatives and their rights to act on behalf of represented individuals.

## Context

The Personal Representative Database and Service API, provided by the Ministry of Social Affairs, manage rights definitions and connections for personal representatives. This ensures digital services can allow representatives to access client information per their authorized rights.

### Example Connections

| **Personal Representative** | **Represented Person** | **Rights**                                         |
| --------------------------- | ---------------------- | -------------------------------------------------- |
| 1122334459                  | 1223455569             | health-data, personal-data, limited-financial-data |
| 1020304059                  | 0203050569             | limited-health-data                                |

### JSON Example of a Connection

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

## Access

The Service API is accessed via X-Road security servers and specific machine client scopes.

The Personal Representative Contract System by Spektra is currently the only system with access.

### Scope

```
@island.is/auth/personal-representative-admin
```

### X-Road Setup

[X-Road information](https://docs.devland.is/technical-overview/x-road/x-road-system-requirements)

#### URLs for X-Road Setup

- Dev: [https://personal-representative-xrd.internal.dev01.devland.is/swagger-json](https://personal-representative-xrd.internal.dev01.devland.is/swagger-json)
- Staging: [https://personal-representative-xrd.internal.staging01.devland.is/swagger-json](https://personal-representative-xrd.internal.staging01.devland.is/swagger-json)
- Production: [https://personal-representative-xrd.internal.innskra.island.is/swagger-json](https://personal-representative-xrd.internal.innskra.island.is/swagger-json)

### OpenAPI URL

OpenAPI documentation and demo:

- [https://personal-representative-xrd.dev01.devland.is/swagger](https://personal-representative-xrd.dev01.devland.is/swagger)

### Service Provider Usage

Digital service providers do not directly access the service API. They can:

- Set up X-Road and use the [PublicAPI](https://docs.devland.is/apps/services/auth/personal-representative-public)
- Use [Digital Iceland’s](https://www.notion.so/Identity-Server-Integration-afde614a247e4b9da4731b2ace1115cd) login option for Personal Representatives, mapping rights to scopes for client access.

## Development

### Initial Setup

We use the same service library and database as auth-api:

1. Ensure Docker is installed.
2. Run:

   ```bash
   yarn dev-services services-auth-ids-api
   ```

3. Run migrations:

   ```bash
   yarn nx run services-auth-ids-api:migrate
   ```

4. Serve locally:

   ```bash
   yarn start services-auth-personal-representative
   ```

API specs are accessible at:

```bash
http://localhost:3376
```

### Testing

Run local tests:

```bash
yarn test services-auth-personal-representative
```

### Getting Started

```bash
yarn start services-auth-personal-representative
```

### Project Owner

- Ministry of Social Affairs

### Code Owners and Maintainers

- [Programm](https://github.com/orgs/island-is/teams/programm/members)