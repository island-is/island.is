# Judicial System

## URLs

- [Dev](https://judicial-system.dev01.devland.is)
- [Staging](https://judicial-system.staging01.devland.is)
- [Production](https://rettarvorslugatt.island.is)

## Backend

### Initial Setup

Ensure Docker is installed, then run:

```bash
yarn dev-services judicial-system-backend
```

```bash
yarn dev-services judicial-system-message-handler
```

Run migrations and seed the database:

```bash
yarn nx run judicial-system-backend:migrate
```

```bash
yarn nx run judicial-system-backend:seed
```

### Running Locally

Start the backend service:

```bash
yarn start judicial-system-backend
```

To enable SMS notifications for an on-call judge:

```bash
NOVA_PASSWORD=<SMS password> COURTS_MOBILE_NUMBERS='{ <court-id>: mobileNumbers: <judge mobile number> }' yarn start judicial-system-backend
```

Enable electronic signatures with a Dokobit access token: `DOKOBIT_ACCESS_TOKEN=<token>`

For email previews, check URLs in logs. To send emails via AWS SES, authenticate against AWS:

```bash
EMAIL_USE_TEST_ACCOUNT=false EMAIL_REGION=eu-west-1 yarn start judicial-system-backend
```

For prison notifications, provide email addresses: `PRISON_EMAIL=<email> PRISON_ADMIN_EMAIL=<email>`

Enable AWS S3 writing and court system communication via xRoad by configuring `environment.ts`.

Fetch latest texts from Contentful using `CONTENTFUL_ACCESS_TOKEN`.

### Unit Tests

```bash
yarn test judicial-system-backend
```

### OpenAPI and Swagger

Visit `localhost:3344/api/swagger`

### Database Changes

Migrations must be created manually.

#### Generate an empty migration file

```bash
npx sequelize-cli migration:generate --name update-case
```

Run migrations locally:

```bash
# Apply migrations
yarn nx run judicial-system-backend:migrate
# Revert migrations
yarn nx run judicial-system-backend:migrate/undo
```

## API

### Running Locally

Start the API service:

```bash
yarn start judicial-system-api
```

Fetch latest texts from Contentful using `CONTENTFUL_ACCESS_TOKEN`.

### GraphQL Playground

Visit `localhost:3333/api/graphql`

## Web

A platform for data exchange within the Icelandic judicial system.

### Start Locally

Ensure the backend is running.

Start the application:

```bash
yarn start judicial-system-web
```

The project runs at <https://localhost:4200/>.

Provide `LAWYERS_ICELAND_API_KEY` to fetch lawyers.

Navigate directly to `/api/auth/login?nationalId=<national_id>` to bypass authentication.

### Testing Strategy

Uses unit tests and e2e tests with Jest, React Testing Library, and Playwright.

#### Running Tests

##### Unit Tests

```bash
yarn test judicial-system-web
```

##### E2E Tests

Run within VSCode from the "Testing" panel.

## Message Extraction from Contentful

Run `yarn nx extract-strings judicial-system-{namespace}` to create/update a Contentful Namespace.

Set `CONTENTFUL_ENVIRONMENT=test` or `CONTENTFUL_ENVIRONMENT=master` based on environment.

### Example for Web Namespaces

```bash
yarn nx extract-strings judicial-system-web
```

Updates for backend use:

```bash
yarn nx extract-strings judicial-system-backend
```

## Testing Authentication Locally

Install [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy):

- `npm install -g local-ssl-proxy`
- Modify `auth.controller.ts` for secure cookies.
- Add .env in web project and set `PORT=4202`
- Start the project
- Run `local-ssl-proxy --source 4200 --target 4202`

## XRD API

### Running Locally

Start the service:

```bash
yarn start judicial-system-xrd-api
```

## Robot API

### Running Locally

Start the service:

```bash
yarn start judicial-system-robot-api
```

## Digital Mailbox API

### Running Locally

Start the service:

```bash
yarn start judicial-system-digital-mailbox-api
```

## Scheduler

### Running Locally

Start the service:

```bash
yarn start judicial-system-scheduler
```

## Message Handler

### Initial Setup

Ensure Docker is installed, then run:

```bash
yarn dev-services judicial-system-message-handler
```

### Running Locally

Start the service:

```bash
yarn start judicial-system-message-handler
```

## Feature Flags

Hide UI elements in specific environments with feature flags. Add `SECRET_FEATURE` to `Feature` in `/libs/judicial-system/types/src/lib/feature.ts` and update Helm charts.

Run:

```bash
yarn charts
```

Use `FeatureContext` to conditionally display features in the UI.

## Code Owners and Maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)

