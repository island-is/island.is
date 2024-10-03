# Driving License Client

## About

This library implements a client for using Ríkislögreglustjóri's Driver's License API v1 and v2 through x-road. The client is generated from an OpenAPI document provided in x-road.

## Quickstart

You need to have the x-road proxy running locally. Start it by executing:

```sh
./scripts/run-xroad-proxy.sh
```

Run the following command and begin developing:

```sh
yarn nx run clients-driving-license:dev
```

This command updates the API definition and regenerates the client. Ensure that the environment variables `DRIVING_LICENSE_SECRET`, `XROAD_DRIVING_LICENSE_PATH`, `XROAD_DRIVING_LICENSE_V2_PATH`, `XROAD_BASE_PATH`, and `XROAD_CLIENT_ID` are set.

## Usage

### Updating the OpenAPI Definition (`clientConfig.json`)

To update the OpenAPI definition, run:

```sh
yarn nx run clients-driving-license:update-openapi-document --apiVersion=v1
```

or

```sh
yarn nx run clients-driving-license:update-openapi-document --apiVersion=v2
```

### Regenerating the Client

To regenerate the client, execute:

```sh
yarn nx run clients-driving-license:codegen/backend-client
```

### Import into Other NestJS Modules

#### app.module.ts

```typescript
import { ConfigModule } from '@island.is/nest/config';
import { DrivingLicenseApiModule, DrivingLicenseApiConfig } from '@island.is/clients/driving-license';

@Module({
  imports: [
    DrivingLicenseApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DrivingLicenseApiConfig]
    })
  ],
})
```

#### module-name.module.ts

```typescript
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license';

@Module({
  imports: [
    DrivingLicenseApiModule
  ],
})
```

#### module-name.service.ts

```typescript
import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class SomeService {
  constructor(
    @Inject(DrivingLicenseApi)
    private readonly drivingLicenseApi: DrivingLicenseApi,
  ) {}

  async someMethod() {
    return this.drivingLicenseApi.getTeachers()
  }
}
```

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
