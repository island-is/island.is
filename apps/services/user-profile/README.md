## User Profile

### Overview

This service manages and stores user profile information, utilizing the user's National Registration ID for storing contact details and preferred locale settings. It also manages email and mobile phone verification. User profiles are not prepopulated for all Iceland residents; instead, they can be created through various onboarding processes. The function `findOrCreateUserProfile` is utilized throughout the codebase.

### Quickstart

Execute the following commands:

```bash
yarn dev-init services-user-profile
yarn dev services-user-profile
```

These commands match the setup procedures outlined below.

### Initial Setup

Ensure Docker is installed, then run:

```bash
yarn dev-services services-user-profile
```

Afterward, apply migrations with:

```bash
yarn nx run services-user-profile:migrate
```

To start the service locally, execute:

```bash
yarn start services-user-profile
```

The API's OpenAPI specifications can be accessed at:

```
http://localhost:3366/
```

### Getting Started

To start the service, use:

```bash
yarn start services-user-profile
```

### Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
