# User Profile

## About

A service that is responsible for providing and storing User profile info. With
the users National Registration id stores contact info and preferred locale.
Additional responsibility is a verification process of email and mobile phone.
The user-profile table is not pre-populated with everyone in Iceland, therefore
due to multiple onboarding-flows the user-profile can be created under a
variety of circumstances, you will see the `findOrCreateUserProfile` method a
variety of places in this project's code.

## Quick start

Simply run:

```bash
yarn dev services-user-profile
```

They are a quick alias for running the commands below.

### Initial setup

First, make sure you have docker, then run:

```bash
yarn nx run services-user-profile:dev:services
```

Then run the migrations:

```bash
yarn nx run services-user-profile:migrate
```

You can serve this service locally by running:

```bash
yarn nx run services-user-profile:serve
```

The OpenAPI specs will now be accessible at

```bash
http://localhost:3366/
```

## Getting started

```bash
yarn nx run services-user-profile:serve
```

## Code owners and maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
