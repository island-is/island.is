# Documents

## About

A service that is responsible for providing and storing documents and document
providers info.

### Quick start

Simply run this command:

```bash
yarn dev services-documents
```

### Initial setup

First, make sure you have docker, then run:

```bash
yarn nx run services-documents:dev:services
```

Then run the migrations:

```bash
yarn nx run services-documents:migrate
```

You can serve this service locally by running:

```bash
yarn start services-documents
```

The OpenAPI specs will now be accessible [locally](http://localhost:3369/swagger/#/default)

## Getting started

```bash
yarn start services-documents
```

## Code owners and maintainers

- [Advania](https://github.com/orgs/island-is/teams/advania/members)
