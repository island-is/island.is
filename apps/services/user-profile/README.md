# User Profile

## About

This service provides and stores user profile information, including contact info and preferred locale using the user's National Registration ID. It also handles email and mobile verification. The user-profile table isn't prepopulated with everyone in Iceland, so profiles can be created through various onboarding flows using the `findOrCreateUserProfile` method found throughout the project's code.

## Quickstart

Run these commands:

```bash
yarn dev-init services-user-profile
yarn dev services-user-profile
```

These are aliases for the commands listed in the Initial Setup section.

### Initial Setup

Ensure Docker is installed, then execute:

```bash
yarn dev-services services-user-profile
```

Run migrations:

```bash
yarn nx run services-user-profile:migrate
```

Serve the service locally:

```bash
yarn start services-user-profile
```

Access the API OpenAPI specs at:

```bash
http://localhost:3366/
```

## Getting Started

```bash
yarn start services-user-profile
```

## Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)