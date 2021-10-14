# Clients Driving License V1 / V2

For V2 documentation, please refer to this document

## About

This library implements a client to use Ríkislögreglustjóri's
Driver's license API v1

The client is generated from a copy of the openApi document.

## Usage

### Regenerating the client:

```sh
yarn nx run clients-driving-license-v1:schemas/external-openapi-generator
```

### Updating the open api definition (clientConfig.json)

```sh
yarn nx run clients-driving-license-v1:update-openapi-document
```

### Import into other NestJS modules

Add the service to your module imports:

```typescript
import { DrivingLicenseApiV1Module } from '@island.is/clients/driving-license-v1'

@Module({
  imports: [
    DrivingLicenseApiV1Module.register({
      xroadBaseUrl: XROAD_BASE_URL,
      xroadPath: XROAD_PATH,
      xroadClientId: XROAD_CLIENT_ID,
      secret: DRIVING_LICENSE_SECRET,
    }),
  ],
})
```

Then you'll have access to RLS's Okuskirteini APIs - note that since the two
clients (v1 / v2) share the same api class name, nest can't deduplicate them
so you end up having to inject them using the exported symbol:

```typescript
import {
  OkuskirteiniV1Api,
  IDrivingLicenseApiV1,
} from '@island.is/clients/driving-license-v1'

@Injectable()
export class SomeService {
  constructor(
    @Inject(IDrivingLicenseApiV1)
    private readonly drivingLicenseApi: OkuskirteiniV1Api,
  ) {}

  // etc...
}
```

## Code owners and maintainers

- [Kosmos & Kaos](https://github.com/orgs/island-is/teams/kosmos-og-kaos/members)
