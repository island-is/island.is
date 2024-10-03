```markdown
# User Profile

## About

The User Profile service is responsible for providing, storing, and managing user profile information. It stores contact information and preferred locales using the user's National Registration ID. The service is also responsible for verifying email and mobile phone details. Note that the user-profile table is not prepopulated with data for every individual in Iceland. Due to the variety of onboarding flows, the user profile can be created under different circumstances. Therefore, you will find the `findOrCreateUserProfile` method utilized in multiple locations within this project's codebase.

## Quickstart

To get started quickly, execute the following commands:

```bash
yarn dev-init services-user-profile
yarn dev services-user-profile
```

These commands are shortcuts for the detailed steps listed below.

### Initial setup

Ensure you have Docker installed before proceeding. Run the following command to initialize the service:

```bash
yarn dev-services services-user-profile
```

Next, execute the database migrations with the command:

```bash
yarn nx run services-user-profile:migrate
```

To serve this service locally, use:

```bash
yarn start services-user-profile
```

After starting the service, the API documentation and specifications will be available at:

```bash
http://localhost:3366/
```

## Getting started

To start the User Profile service locally, run:

```bash
yarn start services-user-profile
```

## Code owners and maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
```