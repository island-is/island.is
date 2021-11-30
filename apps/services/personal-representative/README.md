# Documents

## About

A service that is responsible for storing and maintaining personal representatives and their rights to act on behalf of the represented person

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
http://localhost:3333/swagger/#/default
```
## Testing
You can run tests for this service locally by running:

```bash
yarn test services-personal-representative
```

## Getting started

```bash
yarn start services-personal-representative
```

## Code owners and maintainers

- [Programm](https://github.com/orgs/island-is/teams/programm/members)
