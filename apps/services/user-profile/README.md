# User Profile

## Overview

This service manages user profile information using the National Registration ID to store contact details and locale preferences. It handles email and mobile verification. Profiles are created through onboarding processes and are not prepopulated for all Iceland residents. The `findOrCreateUserProfile` function is frequently used across the codebase.

## Quickstart

Run the following commands:

```bash
yarn dev-init services-user-profile
yarn dev services-user-profile
```

These commands align with the setup instructions below.

## Initial Setup

Ensure Docker is installed, then initiate:

```bash
yarn dev-services services-user-profile
```

Apply database migrations with:

```bash
yarn nx run services-user-profile:migrate
```

Start the service locally using:

```bash
yarn start services-user-profile
```

You can now access the [Swagger UI](localhost:3366/api/swagger).

## Getting Started

Launch the service with:

```bash
yarn start services-user-profile
```

## Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
