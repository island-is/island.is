# api-domains-farmers

GraphQL API domain for farmer lands data from the Agricultural University of Iceland (LBHI).

## Overview

This domain provides access to farmer land information through the `@island.is/clients/farmers` client.

## Prerequisites

For this domain to work in a specific app, **both** of the following must be present in that app:

1. The domain module (`FarmersModule`) must be imported in the app module
2. The client config (`FarmersClientConfig`) must be added to the `ConfigModule.forRoot()` load array in the app's config module

**Note:** Different apps have separate configurations. The domain currently works in the `api` app because both requirements are met. To use this domain in another app (e.g., `application-system`), you must add `FarmersClientConfig` to that app's `ConfigModule.forRoot()` load array.

## Features

- **farmerLands** query - Returns paginated list of farmer lands

## Usage

**1. Add the domain module to the app module:**

In the target app's module (e.g., `apps/api/src/app/app.module.ts`):

```typescript
import { FarmersModule } from '@island.is/api/domains/farmers'

@Module({
  imports: [
    // ... other imports
    FarmersModule,
    // ...
  ],
})
export class AppModule {}
```

**2. Add the client config to the ConfigModule:**

In the same app module, ensure the client config is loaded:

```typescript
import { FarmersClientConfig } from '@island.is/clients/farmers'

ConfigModule.forRoot({
  isGlobal: true,
  load: [
    // ... other configs
    FarmersClientConfig,
    // ...
  ],
})
```

## Running unit tests

Run `nx test api-domains-farmers` to execute the unit tests via [Jest](https://jestjs.io).
