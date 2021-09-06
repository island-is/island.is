# Judicial System

## About

TODO

## URLs

- [Dev](https://judicial-system.dev01.devland.is)
- [Staging](https://judicial-system.staging01.devland.is)
- [Production](https://rettarvorslugatt.island.is)

## Backend

### Initial setup

First, make sure you have docker, then run:

```bash
yarn dev-services judicial-system-backend
```

Then run the migrations and seed the database:

```bash
yarn nx run judicial-system-backend:migrate
```

```bash
yarn nx run judicial-system-backend:seed
```

### Running locally

You can serve this service locally by running:

```bash
yarn start judicial-system-backend
```

To enable SMS notifications to an on-call judge provide a password for the SMS service and court mobile numbers:

```bash
NOVA_PASSWORD=<SMS password> COURTS_MOBILE_NUMBERS='{ <court-id>: mobileNumbers: <judge mobile number> }' yarn start judicial-system-backend
```

Similarly, you can enable electronic signatures of judge rulings by providing a Dokobit access token: `DOKOBIT_ACCESS_TOKEN=<Dokobit access token>`

To enable email sending via AWS SES turn off email test account and provide an email region:

```bash
EMAIL_USE_TEST_ACCOUNT=false EMAIL_REGION=eu-west-1 yarn start judicial-system-backend
```

You need to be authenticated against AWS for this to work. Alternatively, you can view ethereal nodemailer messages by following the urls shown in the logs.

To enable prison and prison administration email notifications provide email addresses: `PRISON_EMAIL=<prison email> PRISON_ADMIN_EMAIL=<prison administration email>`

To enable writing to AWS S3 you need to be authenticated against AWS.

Finally, you can enable communication with the court system via xRoad by providing appropriate values for the environment variables specified in the `xRoad` and `courtClientOptions` sections in `environment.ts`.

## API

### Running locally

You can serve this service locally by running:

```bash
yarn start judicial-system-api
```

You can enable communication with the court system via xRoad by providing appropriate values for the environment variables specified in the `xRoad` and `courtClientOptions` sections in `environment.ts`.

To get latest texts from Contentful you need to provide an appropriate value for the environment variable `CONTENTFUL_ACCESS_TOKEN`.

### Graphql playground

Visit

```text
localhost:3333/api/graphql
```

### OpenApi and Swagger

Visit

```bash
localhost:3344/api/swagger
```

### Database changes

Migrations need to be created by hand.

## Web

A platform for the exchange of data, information, formal decisions and notifications between parties in the Icelandic judicial system.

### Start the application locally

Start the backend locally. Instructions on how to do that can be found [in the backend project](projects/judicial-system/backend.md).

Start the application

```bash
yarn start judicial-system-web
```

Then the project should be running on https://localhost:4200/.

{% hint style="info" %}
To skip authentication at innskraning.island.is navigate to `/api/auth/login?nationalId=<national_id>` in the web project where `<national_id>` is the national id of a known user.
Known users:

- Áki Ákærandi
  - NationalId: 0000000009
  - Role: Prosecutor
- Dalli Dómritari
  - NationalId: 0000001119
  - Role: Registrar
- Dóra Dómari
  - NationalId: 0000002229
  - Role: Judge
    {% endhint %}

### Testing strategy

This project uses two types of automated tests, unit tests and e2e tests. We use [Jest](https://jestjs.io/) to write unit tests against code like utility functions. If we need to test custom components in isolation, we use [React testing library](https://testing-library.com/docs/react-testing-library/intro/). Finally, to test entire screens in our project we use [Cypress](https://www.cypress.io/).

#### Running the tests

##### Unit tests

```bash
yarn test judicial-system-web
```

##### e2e tests

```bash
yarn nx e2e judicial-system-web-e2e --watch
```

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
