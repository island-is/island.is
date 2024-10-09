# Driving License Book Client

## Overview

This library provides a client to access Ökunámsbók's Driver's License API via x-road. The client is generated from an OpenAPI document available on x-road.

## Usage

### Update OpenAPI Definition

To update the OpenAPI definition (`clientConfig.json`):

```bash
yarn nx run clients-driving-license-book:update-openapi-document
```

### Regenerate Client

To regenerate the client:

```bash
yarn nx run clients-driving-license-book:codegen/backend-client
```

### Import into NestJS Modules

#### Example: `app.module.ts`

```typescript
import { ConfigModule } from '@island.is/nest/config';
import { DrivingLicenseBookClientModule, DrivingLicenseBookClientConfig } from '@island.is/clients/driving-license-book';

@Module({
  imports: [
    DrivingLicenseBookClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DrivingLicenseBookClientConfig, XRoadConfig],
    }),
  ],
})
```

#### Example: `module-name.module.ts`

```typescript
import { DrivingLicenseBookClientModule } from '@island.is/clients/driving-license-book';

imports: [
  DrivingLicenseBookClientModule
],
```

#### Example: `module-name.service.ts`

```typescript
import { DrivingLicenseBookClientApiFactory } from '@island.is/clients/driving-license-book'

@Injectable()
export class SomeService {
  constructor(
    @Inject(DrivingLicenseBookClientApiFactory)
    private readonly drivingLicenseBookClientApiFactory: DrivingLicenseBookClientApiFactory,
  ) {}

  async someMethod() {
    const api = await this.drivingLicenseBookClientApiFactory.create()
    return api.apiStudentGetLicenseBookListSsnGet({ ssn: nationalId })
  }
}
```

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
