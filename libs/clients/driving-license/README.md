# Driving License Client

## About

This library provides a client for Ríkislögreglustjóri's Driver's License API v1 and v2 via X-Road. The client is generated from an OpenAPI document copy available on X-Road.

## Quickstart

Ensure the X-Road proxy is running locally:

```sh
./scripts/run-xroad-proxy.sh
```

Start developing with:

```sh
yarn nx run clients-driving-license:dev
```

This updates the API definition and regenerates the client. Ensure the environment variables `DRIVING_LICENSE_SECRET`, `XROAD_DRIVING_LICENSE_PATH`, `XROAD_DRIVING_LICENSE_V2_PATH`, `XROAD_BASE_PATH`, and `XROAD_CLIENT_ID` are set.

## Usage

### Update the OpenAPI Definition (clientConfig.json)

To update the definition for a specific API version:

```sh
yarn nx run clients-driving-license:update-openapi-document --apiVersion=v1
# or
yarn nx run clients-driving-license:update-openapi-document --apiVersion=v2
```

### Regenerate the client:

```sh
yarn nx run clients-driving-license:codegen/backend-client
```

### Import into other NestJS modules

#### app.module.ts

```typescript
import { ConfigModule } from '@island.is/nest/config';
import { DrivingLicenseApiModule, DrivingLicenseApiConfig } from '@island.is/clients/driving-license';

@Module({
  imports: [
    DrivingLicenseApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DrivingLicenseApiConfig],
    }),
  ],
})
```

#### module-name.module.ts

```typescript
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license';

imports: [
  DrivingLicenseApiModule
],
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
