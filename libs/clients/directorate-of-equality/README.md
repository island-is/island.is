# @island.is/clients/directorate-of-equality

NestJS client library for the Directorate of Equality API, accessed via X-Road.

## Prerequisites

- X-Road proxy running on `localhost:8081`
- `XROAD_CLIENT_ID` env var set (for spec fetching)
- `XROAD_DIRECTORATE_OF_EQUALITY_PATH` env var (defaults to `IS-DEV/GOV/10014/DMR-Protected/directorate-of-equality`)

## Features

- X-Road integration via `createEnhancedFetch`
- Citizen auth context (`authSource: 'context'`) with optional token exchange
- Auto-generated types and SDK from OpenAPI spec

## Usage

```typescript
import {
  DirectorateOfEqualityClientModule,
  DirectorateOfEqualityClientConfig,
} from '@island.is/clients/directorate-of-equality'

// In your NestJS module:
@Module({
  imports: [DirectorateOfEqualityClientModule],
})

// In ConfigModule.forRoot() load array:
load: [DirectorateOfEqualityClientConfig]
```

## Updating the OpenAPI spec

```bash
npx nx run clients-directorate-of-equality:update-openapi-document
```

Requires the X-Road proxy to be running on port 8081. After fetching, verify `src/clientConfig.json` contains an `"openapi"` field before running codegen.

## Regenerating the client

```bash
npx nx run clients-directorate-of-equality:codegen/backend-client
```

## Running tests

```bash
nx test clients-directorate-of-equality
```
