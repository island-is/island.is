# Driving License Client

## About

This library implements a client to use Ríkislögreglustjóri's
Driver's license API v1 and v2 through x-road

The client is generated from a copy of the openApi document provided in x-road.

## Quickstart

you need to have the xroad proxy running locally

```sh
 ./scripts/run-xroad-proxy.sh
```

Run the following and start developing:

```sh
yarn nx run clients-driving-license:dev
```

This command bundles updating the api definition and regenerating the client.

and make sure the environment variables `DRIVING_LICENSE_SECRET`, `XROAD_DRIVING_LICENSE_PATH`, `XROAD_DRIVING_LICENSE_V2_PATH`, `XROAD_BASE_PATH` and `XROAD_CLIENT_ID` are available.

## Usage

### Updating the open api definition (clientConfig.json)

```sh
yarn nx run clients-driving-license:update-openapi-document --apiVersion=v1
```

or

```sh
yarn nx run clients-driving-license:update-openapi-document --apiVersion=v2
```

### Regenerating the client:

```sh
yarn nx run clients-driving-license:codegen/backend-client
```

### Import into other NestJS modules

#### app.module.ts

```typescript
import { ConfigModule } from '@island.is/nest/config'
import { DrivingLicenseApiModule, DrivingLicenseApiConfig } from '@island.is/clients/driving-license'

@Module({
  imports: [
      DrivingLicenseApiModule,
      ConfigModule.forRoot({
        isGlobal:true,
        load:[DrivingLicenseApiConfig]
      })
    ],
})
```

#### module-name.module.ts

```typescript
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'

  imports: [
    DrivingLicenseApiModule
  ],
```

#### module-name.service.ts

```typescript
import { DrivingLicenseApi } from '@island.is/clients/driving-license'


@Injectable()
export class SomeService {
  constructor(
    @Inject(DrivingLicenseApi)
    private readonly drivingLicenseApi: DrivingLicenseApi,
  ) {}

  async someMethod()
      return this.drivingLicenseApi.getTeachers()

```

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
