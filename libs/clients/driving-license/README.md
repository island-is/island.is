# Clients Driving License

## About

This library implements a client to use Ríkislögreglustjóri's Driver's license API

The client is generated from a copy of the openApi document.

## Client generation gotcha

_Note_: There's a caveat/gotcha regarding the generation of the client. Since
the document contains a list of acceptable content-types for the request body in
post requests, the client generation will just pick the first one, erronously
injecting a content-type header into each generated request.

The current workaround for this issue is to edit and rearrange the acceptable
body types so that application/json is at the top.

When the client is updated/refetched it is vitally important to make sure that
the order of those don't get overwritten.

**Again: Make sure the order of the acceptable body types for the post requests is not changed**

Hopefully there will be a better fix in the future, or maybe an entirely different
client generator altogether, but for now, this is what we are working with.

## Usage

### Regenerating the client:

```sh
yarn nx run clients-driving-license:schemas/external-openapi-generator
```

### Updating the client doc:

```sh
curl -H 'X-Road-Client: IS-DEV/GOV/10000/island-is-client' \
  http://XROADHOST/r1/IS-DEV/GOV/10005/Logreglan-Protected/getOpenAPI?serviceCode=RafraentOkuskirteini-v1 \
  > libs/clients/driving-license/src/clientConfig.json \
  && yarn format --files libs/clients/driving-license/src/clientConfig.json
```

_And then, most importantly: Make sure to maintain the request body types order (see above)_

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
