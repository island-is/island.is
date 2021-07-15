# Clients Driving License

## About

This library implements a client to use Ríkislögreglustjóri's Driver's license API

The client is generated from a copy of the openApi document

```sh
yarn nx run clients-driving-license:schemas/openapi-generator
```

### Import into other NestJS modules

Add the service to your module imports:

```typescript
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'

@Module({
  imports: [
    DrivingLicenseApiModule.register({
      xroadBaseUrl: XROAD_BASE_URL,
      xroadPath: XROAD_PATH,
      xroadClientId: XROAD_CLIENT_ID,
      secret: DRIVING_LICENSE_SECRET,
    }),
  ],
})
```

Then you'll have access to VMST APIs:

```typescript
import { OkuskirteiniApi } from '@island.is/clients/vmst'

@Injectable()
export class SomeService {
  constructor(private drivingLicenseApi: OkuskirteiniApi) {}

  // etc...
}
```

## Code owners and maintainers

- [Kosmos & Kaos](https://github.com/orgs/island-is/teams/kosmos-og-kaos/members)
