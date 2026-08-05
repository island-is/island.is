# MMS Primary School Client

NestJS client library for MMS (Miðstöð menntunar og skólaþjónustu) Primary School API, accessed via X-Road.

## Usage

Import `PrimarySchoolClientModule` and inject `PrimarySchoolClientService`:

```typescript
import { PrimarySchoolClientModule } from '@island.is/clients/mms/primary-school'

@Module({
  imports: [PrimarySchoolClientModule],
})
export class MyModule {}
```

## Configuration

Requires the following environment variable:

| Variable                              | Default (dev)                                                  |
| ------------------------------------- | -------------------------------------------------------------- |
| `XROAD_MMS_PRIMARY_SCHOOL_SERVICE_ID` | `IS-DEV/GOV/10066/MMS-Protected/data-gateway-backend-internal` |

## Running unit tests

Run `nx test primary-school` to execute the unit tests via [Jest](https://jestjs.io).
