# Personal Representative

## About

A service responsible for storing and maintaining personal representatives and their rights to act on behalf of the represented person.

## Context

The purpose of the Personal Representative Database and the Service API is to allow the protection of rights agency of the Ministry of Social Affairs to define rights for personal representatives and maintain a list of connections between personal representatives and represented persons along with their associated rights list.

This allows digital services to provide access to the personal representative on behalf of their clients, according to the rights list in their connection.

The API allows for the maintenance of right types, personal representative types (currently only one type), and the connections between a personal representative and the represented person.

### Example of Connections

| **Personal representative** | **Represented person** | **Rights**                                         |
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

## Access

The Service API is only accessible through X-Road security servers and only to machine clients with a specific scope.

For the foreseeable future, the only system with access would be the Personal Representative Contract System serviced by Spektra for the protection of rights agency.

### Scope

```plaintext
@island.is/auth/personal-representative-admin
```

### X-Road Setup

Refer to [X-Road information](https://docs.devland.is/technical-overview/x-road/x-road-system-requirements)

#### URLs for X-Road setup

- Dev: [https://personal-representative-xrd.internal.dev01.devland.is/swagger-json](https://personal-representative-xrd.internal.dev01.devland.is/swagger-json)
- Staging: [https://personal-representative-xrd.internal.staging01.devland.is/swagger-json](https://personal-representative-xrd.internal.staging01.devland.is/swagger-json)
- Production: [https://personal-representative-xrd.internal.innskra.island.is/swagger-json](https://personal-representative-xrd.internal.innskra.island.is/swagger-json)

### OpenAPI URL

OpenAPI documentation and demo:

- [https://personal-representative-xrd.dev01.devland.is/swagger](https://personal-representative-xrd.dev01.devland.is/swagger)

### Service Provider Usage

Digital service providers do not have direct access to the service API.

They can use the connection information through:

- Setting up X-Road and accessing the [PublicAPI](https://docs.devland.is/apps/services/auth/personal-representative-public)
- Using [Digital Iceland’s](https://www.notion.so/Identity-Server-Integration-afde614a247e4b9da4731b2ace1115cd) new login option and configuring it for Personal Representative usage.
  - This requires mapping rights to scope for the service provider's client.

## Development

### Initial Setup

We are using the same service library and database as `auth-api`, and therefore, this step-by-step guide follows that setup.

First, ensure you have Docker installed, then run:

```bash
yarn dev-services services-auth-ids-api
```

Run the migrations:

```bash
yarn nx run services-auth-ids-api:migrate
```

Serve the service locally by running:

```bash
yarn start services-auth-personal-representative
```

The API specs will be accessible at:

```plaintext
http://localhost:3376
```

### Testing

Run tests for this service locally by executing:

```bash
yarn test services-auth-personal-representative
```

### Getting Started

```bash
yarn start services-auth-personal-representative
```

### Project Owner

- Réttindagæsla velferðarráðuneytisins

### Code Owners and Maintainers

- [Programm](https://github.com/orgs/island-is/teams/programm/members)
