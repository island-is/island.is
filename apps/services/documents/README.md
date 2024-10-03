## About

The `services-documents` service is responsible for providing and storing documents and document provider information.

### Initial Setup

To get started with the `services-documents` service, ensure you have Docker installed. Then, execute the following command to run the development services:

```bash
yarn dev-services services-documents
```

Next, you need to run the migrations with the command:

```bash
yarn nx run services-documents:migrate
```

To serve this service locally, use:

```bash
yarn start services-documents
```

Once running, the API's OpenAPI specifications will be accessible at:

```bash
http://localhost:3369/swagger/#/default
```

## Getting Started

Run the service using the command:

```bash
yarn start services-documents
```

## Code Owners and Maintainers

- Maintained by [Advania](https://github.com/orgs/island-is/teams/advania/members)