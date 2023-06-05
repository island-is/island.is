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

```bash
yarn dev-services judicial-system-message-handler
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

In local development you can preview emails with ethereal nodemailer previews by following the urls in the logs.
Alternatively, you can enable email sending via AWS SES turn off email test account and provide an email region:

```bash
EMAIL_USE_TEST_ACCOUNT=false EMAIL_REGION=eu-west-1 yarn start judicial-system-backend
```

You need to be authenticated against AWS for this to work.

To enable prison and prison administration email notifications provide email addresses: `PRISON_EMAIL=<prison email> PRISON_ADMIN_EMAIL=<prison administration email>`

To enable writing to AWS S3 you need to be authenticated against AWS.

Finally, you can enable communication with the court system via xRoad by providing appropriate values for the environment variables specified in the `xRoad` and `courtClientOptions` sections in `environment.ts`.

To get latest texts from Contentful you need to provide an appropriate value for the environment variable `CONTENTFUL_ACCESS_TOKEN`.

### Unit tests

```bash
yarn test judicial-system-backend
```

### OpenApi and Swagger

Visit

```bash
localhost:3344/api/swagger
```

### Database changes

Migrations need to be created by hand.

#### Generate a empty migration file you can simply run:

```
npx sequelize-cli migration:generate --name update-case
```

this will generate a migration file with empty exports for up (Altering commands) and down (Reverting commands).

To run the migrations on the local database run:

```
# for UP migrations
yarn nx run judicial-system-backend:migrate
# for DOWN migrations
yarn nx run judicial-system-backend:migrate/undo
```

## API

### Running locally

You can serve this service locally by running:

```bash
yarn start judicial-system-api
```

To get latest texts from Contentful you need to provide an appropriate value for the environment variable `CONTENTFUL_ACCESS_TOKEN`.

### Graphql playground

Visit

```text
localhost:3333/api/graphql
```

## Web

A platform for the exchange of data, information, formal decisions and notifications between parties in the Icelandic judicial system.

### Start the application locally

Start the backend locally. Instructions on how to do that can be found [in the backend project](projects/judicial-system/backend.md).

Start the application

```bash
yarn start judicial-system-web
```

Then the project should be running on https://localhost:4200/.

To be able to fetch a list of lawyers you need to provide a value for the environment variable `LAWYERS_ICELAND_API_KEY`

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

## Message Extraction from Contentful

Running `yarn nx extract-strings judicial-system-{namespace}` in the root folder `/island.is` will extract messages from the project and create or update a Namespace entry in Contentful.
Make sure you have the env `CONTENTFUL_ENVIRONMENT=test` to update the strings against `dev` and `staging` and `CONTENTFUL_ENVIRONMENT=master` to update against `prod`.

### Example for namespaces in web:

```
yarn nx extract-strings judicial-system-web
```

will update namespaces:

- judicial.system.core
- judicial.system.restriction_cases
- judicial.system.investigation_cases

### For backend:

```
yarn nx extract-strings judicial-system-backend
```

will update namespaces:

- judicial.system.backend

## To test authentication locally

Install <https://github.com/cameronhunter/local-ssl-proxy>:

- `npm install -g local-ssl-proxy`

- change defaultcookie in apps/judicial-system/api/src/app/modules/auth/auth.controller.ts:

  const defaultCookieOptions: CookieOptions = {
  secure: true,
  }

- add .env to web project and change PORT to 4202
- start project
- `local-ssl-proxy --source 4200 --target 4202`

## XRD API

This service is for access from xRoad.

### Running locally

You can serve this service locally by running:

```bash
yarn start judicial-system-xrd-api
```

## Scheduler

This service is for running scheduled tasks. Currently, archiving old cases is the only task.

### Running locally

You can serve this service locally by running:

```bash
yarn start judicial-system-scheduler
```

## Message Handler

This service handles messages posted by other services for downstream processing.

### Initial setup

First, make sure you have docker, then run:

```bash
yarn dev-services judicial-system-message-handler
```

### Running locally

You can serve this service locally by running:

```bash
yarn start judicial-system-message-handler
```

## Feature flags

If you want to hide some UI element in certain environments you can use a feature flag. Lets say you want to hide the `SECRET_FEATURE` in STAGING and PROD but still be able to see it on DEV. Start by adding it to `Feature` in `/libs/judicial-system/types/src/lib/feature.ts`

```
export enum Feature {
  NONE = 'NONE', // must be at least one
  SECRET_FEATURE = 'SECRET_FEATURE',
}
```

Then you need to update the Helm charts. Add `SECRET_FEATURE` to `HIDDEN_FEATURES` in `./apps/judicial-system/api/infra/judicial-system-api.ts`.

Then run the script

```
./infra/scripts/generate-chart-values.sh judicial-system
```

You can now use the `FeatureContext` to hide `SECRET_FEATURE` in the UI.

```
  const Component = () => {
    const { features } = useContext(FeatureContext)

    return (
      if (features.includes(Feature.SECRET_FEATURE)) {
        <p>This will only show on DEV, not STAGING or PROD</p>
      }
    )
  }

```

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
