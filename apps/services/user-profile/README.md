## User Profile

### About

A service responsible for providing and storing User profile information. It uses the user's National Registration ID to store contact details and preferred locale. It also handles email and mobile phone verification. The user profile table is not prepopulated with everyone in Iceland; hence, profiles can be created through various onboarding flows. The method `findOrCreateUserProfile` appears in multiple parts of the code.

### Quickstart

Run these commands:

```bash
yarn dev-init services-user-profile
yarn dev services-user-profile
```

These are aliases for the setup commands below.

### Initial Setup

Ensure you have Docker, then execute:

```bash
yarn dev-services services-user-profile
```

Next, run migrations:

```bash
yarn nx run services-user-profile:migrate
```

To serve the service locally, use:

```bash
yarn start services-user-profile
```

API OpenAPI specs are available at:

```
http://localhost:3366/
```

### Getting Started

```bash
yarn start services-user-profile
```

### Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)