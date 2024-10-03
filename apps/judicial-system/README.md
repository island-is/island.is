# Judicial System

## About

TODO

## URLs

- [Dev](https://judicial-system.dev01.devland.is)
- [Staging](https://judicial-system.staging01.devland.is)
- [Production](https://rettarvorslugatt.island.is)

## Backend

### Initial Setup

Ensure you have Docker installed, then execute:

```bash
yarn dev-services judicial-system-backend
```

```bash
yarn dev-services judicial-system-message-handler
```

Proceed to run migrations and seed the database:

```bash
yarn nx run judicial-system-backend:migrate
```

```bash
yarn nx run judicial-system-backend:seed
```

### Running Locally

Serve this service locally by executing:

```bash
yarn start judicial-system-backend
```

To enable SMS notifications for an on-call judge, provide a password for the SMS service and court mobile numbers:

```bash
NOVA_PASSWORD=<SMS password> COURTS_MOBILE_NUMBERS='{ <court-id>: mobileNumbers: <judge mobile number> }' yarn start judicial-system-backend
```

Enable electronic signatures for judge rulings by providing a Dokobit access token: `DOKOBIT_ACCESS_TOKEN=<Dokobit access token>`

For local development, preview emails with ethereal nodemailer by following URLs in the logs. Alternatively, send emails via AWS SES by disabling the email test account and providing an email region:

```bash
EMAIL_USE_TEST_ACCOUNT=false EMAIL_REGION=eu-west-1 yarn start judicial-system-backend
```

Ensure AWS authentication is configured for this to work.

To enable prison and administration email notifications, provide addresses: `PRISON_EMAIL=<prison email> PRISON_ADMIN_EMAIL=<prison administration email>`

Authenticate against AWS to enable writing to AWS S3.

Provide values for the environment variables specified in the `xRoad` and `courtClientOptions` sections in `environment.ts` for communication with the court system via xRoad.

To retrieve the latest texts from Contentful, provide a value for `CONTENTFUL_ACCESS_TOKEN`.

### Unit Tests

```bash
yarn test judicial-system-backend
```

### OpenAPI and Swagger

Access the endpoint:

```text
localhost:3344/api/swagger
```

### Database Changes

Migrations need to be created manually.

#### Generate an Empty Migration File

Run:

```bash
npx sequelize-cli migration:generate --name update-case
```

This generates a migration file with empty exports for up (Altering commands) and down (Reverting commands).

To execute migrations on the local database, run:

```bash
# for UP migrations
yarn nx run judicial-system-backend:migrate
# for DOWN migrations
yarn nx run judicial-system-backend:migrate/undo
```

## API

### Running Locally

Serve this service locally by executing:

```bash
yarn start judicial-system-api
```

To retrieve the latest texts from Contentful, provide a value for `CONTENTFUL_ACCESS_TOKEN`.

### GraphQL Playground

Access the endpoint:

```text
localhost:3333/api/graphql
```

## Web

A platform for exchanging data, information, formal decisions, and notifications within the Icelandic judicial system.

### Start the Application Locally

Begin by starting the backend locally. Instructions are available [in the backend project](projects/judicial-system/backend.md).

Start the application:

```bash
yarn start judicial-system-web
```

The project should be running on <https://localhost:4200/>.

To fetch a list of lawyers, provide a value for the environment variable `LAWYERS_ICELAND_API_KEY`

{% hint style="info" %}
To skip authentication at innskraning.island.is, navigate to `/api/auth/login?nationalId=<national_id>` in the web project. Use a known user's national ID:

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

### Testing Strategy

This project uses two types of automated tests: unit tests and e2e tests. We use [Jest](https://jestjs.io/) for unit tests on utility functions. For testing custom components in isolation, we use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). For testing entire screens, we use [Playwright](https://playwright.dev/).

#### Running the Tests

##### Unit Tests

```bash
yarn test judicial-system-web
```

##### E2E Tests

Run the e2e test from the "Testing" panel within VSCode.

## Message Extraction from Contentful

Run `yarn nx extract-strings judicial-system-{namespace}` from the root folder `/island.is`. This extracts messages from the project and updates a Namespace entry in Contentful. Ensure the environment variable `CONTENTFUL_ENVIRONMENT` is set to `test` for updating against `dev` and `staging`, or `master` for `prod`.

### Example for Namespaces in Web

```bash
yarn nx extract-strings judicial-system-web
```

This updates namespaces:

- judicial.system.core
- judicial.system.restriction_cases
- judicial.system.investigation_cases

### For Backend

```bash
yarn nx extract-strings judicial-system-backend
```

This updates namespaces:

- judicial.system.backend

## To Test Authentication Locally

Install <https://github.com/cameronhunter/local-ssl-proxy>:

- `npm install -g local-ssl-proxy`

- Change `defaultcookie` in `apps/judicial-system/api/src/app/modules/auth/auth.controller.ts`:

  ```typescript
  const defaultCookieOptions: CookieOptions = {
    secure: true,
  }
  ```

- Add `.env` to the web project and set PORT to 4202
- Start the project
- `local-ssl-proxy --source 4200 --target 4202`

## XRD API

This service facilitates access from xRoad.

### Running Locally

Serve this service locally by executing:

```bash
yarn start judicial-system-xrd-api
```

## Robot API

This service facilitates access through xRoad.

### Running Locally

Serve this service locally by executing:

```bash
yarn start judicial-system-robot-api
```

## Digital Mailbox API

This service facilitates access through xRoad.

### Running Locally

Serve this service locally by executing:

```bash
yarn start judicial-system-digital-mailbox-api
```

## Scheduler

This service runs scheduled tasks. Currently, it archives old cases.

### Running Locally

Serve this service locally by executing:

```bash
yarn start judicial-system-scheduler
```

## Message Handler

This service processes messages posted by other services.

### Initial Setup

Ensure you have Docker installed, then execute:

```bash
yarn dev-services judicial-system-message-handler
```

### Running Locally

Serve this service locally by executing:

```bash
yarn start judicial-system-message-handler
```

## Feature Flags

To hide a UI element in certain environments, use a feature flag. For example, to hide `SECRET_FEATURE` in STAGING and PROD, but not in DEV, start by adding it to `Feature` in `/libs/judicial-system/types/src/lib/feature.ts`

```typescript
export enum Feature {
  NONE = 'NONE', // must be at least one entry
  SECRET_FEATURE = 'SECRET_FEATURE',
}
```

Update the Helm charts by adding `SECRET_FEATURE` to `HIDDEN_FEATURES` in `./apps/judicial-system/api/infra/judicial-system-api.ts`.

Run the script:

```bash
yarn charts
```

Use the `FeatureContext` to manage `SECRET_FEATURE` visibility in the UI.

```typescript
const Component = () => {
  const { features } = useContext(FeatureContext)

  if (features.includes(Feature.SECRET_FEATURE)) {
    return <p>This will only show on DEV, not STAGING or PROD</p>
  }
}
```

## Code Owners and Maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
