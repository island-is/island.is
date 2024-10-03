````markdown
# Driving License Book Client

## Overview

This library provides a client to interact with Ökunámsbók's Driver's License API via x-road. The client is auto-generated using an OpenAPI document available on x-road.

## Usage

### Updating the OpenAPI Definition (`clientConfig.json`)

To update the OpenAPI definition, execute:

```sh
yarn nx run clients-driving-license-book:update-openapi-document
```
````

### Regenerating the Client

To regenerate the client, execute:

```sh
yarn nx run clients-driving-license-book:codegen/backend-client
```

### Importing into Other NestJS Modules

#### `app.module.ts`

Example setup for importing the module:

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import {
  DrivingLicenseBookClientModule,
  DrivingLicenseBookClientConfig,
} from '@island.is/clients/driving-license-book'

@Module({
  imports: [
    DrivingLicenseBookClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DrivingLicenseBookClientConfig, XRoadConfig],
    }),
  ],
})
export class AppModule {}
```

#### `module-name.module.ts`

To use the Driving License Book Client in a specific module:

```typescript
import { Module } from '@nestjs/common'
import { DrivingLicenseBookClientModule } from '@island.is/clients/driving-license-book'

@Module({
  imports: [DrivingLicenseBookClientModule],
})
export class SomeModule {}
```

#### `module-name.service.ts`

Implementation within a service:

```typescript
import { Injectable, Inject } from '@nestjs/common'
import { DrivingLicenseBookClientApiFactory } from '@island.is/clients/driving-license-book'

@Injectable()
export class SomeService {
  constructor(
    @Inject(DrivingLicenseBookClientApiFactory)
    private readonly drivingLicenseBookClientApiFactory: DrivingLicenseBookClientApiFactory,
  ) {}

  async someMethod(): Promise<any> {
    const api = await this.drivingLicenseBookClientApiFactory.create()
    return api.apiStudentGetLicenseBookListSsnGet({ ssn: nationalId })
  }
}
```

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)

```

```
