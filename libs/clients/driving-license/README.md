# Clients Driving License V1 / V2

## About

This library implements a client to use Ríkislögreglustjóri's
Driver's license API v1 and v2 through x-road

The client is generated from a copy of the openApi document provided in x-road.

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
yarn nx run clients-driving-license:schemas/external-openapi-generator
```

### Import into other NestJS modules

Add the service to your module imports:

```typescript
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'

@Module({
  imports: [
    DrivingLicenseApiModule.register({
      xroadBaseUrl: XROAD_BASE_URL,
      xroadClientId: XROAD_CLIENT_ID,
      secret: DRIVING_LICENSE_SECRET,
      xroadPathV1: DRIVING_LICENSE_XROAD_PATH,
      xroadPathV2: DRIVING_LICENSE_XROAD_PATH_V2,
    }),
  ],
})
```

Since the generated class names are pretty similar for v1 / v2 of the API, and neither
is a subset of the other, all the API calls are wrapped, so that they share a uniform API,
and the intent is that the consumer of the client does not need to be aware of which version
of the API they are communicating with

```typescript
import { DrivingLicenseApi } from '@island.is/clients/driving-license'

@Injectable()
export class SomeService {
  constructor(private readonly drivingLicenseApi: DrivingLicenseApi) {}

  // etc...
}
```

## Code owners and maintainers

- [Kosmos & Kaos](https://github.com/orgs/island-is/teams/kosmos-og-kaos/members)
