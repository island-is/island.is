# User Profile

## About

A service that is responsible for providing and storing User profile info. With the users National Id stores contact info and preferred locale. Additional responsibility is a verification process of email and mobile phone.

### Initial setup

First, make sure you have docker, then run:

```bash
yarn dev-services services-user-profile
```

Then run the migrations:

```bash
yarn nx run services-user-profile:migrate
```

You can serve this service locally by running:

```bash
yarn start services-user-profile
```

Api open api specs will now be accessible at

```bash
http://localhost:3333/swagger/#/default
```

## Getting started

```bash
yarn start services-user-profile
```

## Code owners and maintainers

- [Sendiráðið](https://github.com/orgs/island-is/teams/sendiradid/members)
