# clients-farmers

This library provides a NestJS client for the Farmers API (Búnaðarskrá).

## Overview

The Farmers client integrates with the Farmers API to provide access to farm information for authenticated users.

## Features

- **List Farms**: Retrieve a list of farms associated with the authenticated user

## Usage

Import the module in your NestJS application:

```typescript
import { FarmersClientModule } from '@island.is/clients/farmers'

@Module({
  imports: [FarmersClientModule],
})
export class YourModule {}
```

Use the service:

```typescript
import { FarmersClientService } from '@island.is/clients/farmers'

constructor(
  private readonly farmersService: FarmersClientService,
) {}

async getFarms(user: User) {
  return await this.farmersService.getListFarms(user)
}
```

## Configuration

The client requires the following environment variables:

- `XROAD_FARMERS_PATH`: X-Road service path (default: `IS-DEV/GOV/10000/Farmers-Protected/FarmersApi-v1`)

## Running unit tests

Run `nx test clients-farmers` to execute the unit tests via [Jest](https://jestjs.io).
