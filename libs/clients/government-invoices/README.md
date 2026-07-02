# Government Invoices Client

NestJS client library for fetching open invoices and organization employee data from the FJS Elfur API.

## Features

- Fetch open invoice groups (filtered by supplier, customer, type, and date range)
- Fetch a single invoice group for a specific supplier-customer pair
- List suppliers, customers, invoice types, and payment types
- Fetch employees for a government organization

## Configuration

| Environment Variable | Description | Default |
|---|---|---|
| `ELFUR_BASE_PATH` | Base URL for the Elfur API | `https://fjs-cdn-endpoint-elfur-test-hhesbzhxabbwbqen.a03.azurefd.net` |
| `ELFUR_BASE_IDS_URL` | Identity server URL for token auth | `https://identity-server.staging01.devland.is` |
| `ELFUR_CLIENT_ID` | OAuth2 client ID | `@fjs.is/stafraent-island-api-elfur` |
| `ELFUR_CLIENT_SECRET` | OAuth2 client secret | _(empty)_ |

## Usage

Import `GovernmentInvoicesClientModule` in your domain module and inject `GovernmentInvoicesClientService`:

```typescript
import {
  GovernmentInvoicesClientModule,
  GovernmentInvoicesClientService,
} from '@island.is/clients/government-invoices'
```

Register `GovernmentInvoicesClientConfig` in `apps/api/src/app/app.module.ts` under `ConfigModule.forRoot()`.
