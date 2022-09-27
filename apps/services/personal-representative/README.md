# Personal Representative

## About

A service that is responsible for storing and maintaining personal representatives and their rights to act on behalf of the represented person

## Context

The purpose of the Personal Representative Database and the Service API is to allow the protection of rights agency of the Ministry of Social Affairs to define rights for personal representatives and maintain a list of personal representative connections along with rights list.

This allows for digital services to give access to the personal representative on behalf of their clients according to the rights list in their connection.

The API allows for maintenance of right types, personal representative types (currently only one type) and as stated before the connections between a personal representative and the represented person.

### Example of connections

| **Personal representative** | **Represented person** | **Rights**                                         |
| --------------------------- | ---------------------- | -------------------------------------------------- |
| 1122334459                  | 1223455569             | health-data, personal-data, limited-financial-data |
| 1020304059                  | 0203050569             | limited-health-data                                |

### JSON expample of connection

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

The ServiceAPI is only accessible through X-Road security servers and only to machine clients with specific scope

For the foreseeable future the only system with access would be the Personal Representative Contract System serviced by Spektra for the protection of rights agency

### Scope

```
@island.is/auth/personal-representative-admin
```

### X-Road setup

[X-Road information](https://docs.devland.is/technical-overview/x-road/x-road-system-requirements)

#### Urls for X-Road setup are as follows

- Dev: [https://personal-representative-xrd.internal.dev01.devland.is/swagger-json](https://personal-representative-xrd.internal.dev01.devland.is/swagger-json)
- Staging: [https://personal-representative-xrd.internal.staging01.devland.is/swagger-json](https://personal-representative-xrd.internal.staging01.devland.is/swagger-json)
- Production: [https://personal-representative-xrd.internal.innskra.island.is/swagger-json](https://personal-representative-xrd.internal.innskra.island.is/swagger-json)

### OpenAPI URL##

OpenAPI documentation and demoing at

- [https://personal-representative-xrd.dev01.devland.is/swagger](https://personal-representative-xrd.dev01.devland.is/swagger)

### Service provider usage

Digital service providers do not get access to the service API.

They can use the connection information through two ways.

- Setting up X-Road and use the [PublicAPI](https://docs.devland.is/apps/services/personal-representative-public)
- Use [Digital Iceland’s](https://www.notion.so/Identity-Server-Integration-afde614a247e4b9da4731b2ace1115cd) new login option and setting it up for Personal Representative usage.
  - This requires mapping rights to scope for service provider's client

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
yarn start services-personal-representative
```

Api open api specs will now be accessible at

```bash
http://localhost:3376
```

### Testing

You can run tests for this service locally by running:

```bash
yarn test services-personal-representative
```

### Getting started

```bash
yarn start services-personal-representative
```

### Project owner

- Réttindagæsla velferðarráðuneytisins

### Code owners and maintainers

- [Programm](https://github.com/orgs/island-is/teams/programm/members)
