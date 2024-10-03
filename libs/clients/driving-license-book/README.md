# Driving License Book Client

## About

This library implements a client to use Ökunámsbók's
Driver's license API through x-road

The client is generated from a copy of the openApi document provided in x-road.

## Usage

### Updating the open api definition (clientConfig.json)

```sh
yarn nx run clients-driving-license-book:update-openapi-document
```

### Regenerating the client:

```sh
yarn nx run clients-driving-license-book:codegen/backend-client
```

### Import into other NestJS modules

#### app.module.ts

```typescript
import { ConfigModule } from '@island.is/nest/config'
import { DrivingLicenseBookClientModule, DrivingLicenseBookClientConfig } from '@island.is/clients/driving-license-book'

@Module({
  imports: [
      DrivingLicenseBookClientModule,
      ConfigModule.forRoot({
        isGlobal:true,
        load:[DrivingLicenseBookClientConfig,XRoadConfig]
      })
    ],
})
```

#### module-name.module.ts

```typescript
import { DrivingLicenseBookClientModule } from '@island.is/clients/driving-license-book'

  imports: [
    DrivingLicenseBookClientModule
  ],
```

#### module-name.service.ts

```typescript
import { DrivingLicenseBookClientApiFactory } from '@island.is/clients/driving-license-book'


@Injectable()
export class SomeService {
  constructor(
    @Inject(DrivingLicenseBookClientApiFactory)
    private readonly drivingLicenseBookClientApiFactory: DrivingLicenseBookClientApiFactory,
  ) {}

  async someMethod()
      const api = await this.drivingLicenseBookClientApiFactory.create()
      return api.apiStudentGetLicenseBookListSsnGet({ssn:nationalId})

```

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
