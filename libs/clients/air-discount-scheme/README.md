# Air Discount Scheme Client

This client relies on the Air Discount Scheme Backend.
This client exposes some private methods for said backend and is intended for internal or machine client use.

To generate the client run

```bash
yarn nx run clients-air-discount-scheme:codegen/backend-client
```

## Simple usage

Then in your module you can set up the imports

```ts
//your.module.ts
import { AirDiscountSchemeClientModule } from '@island.is/clients/air-discount-scheme'

@Module({
  providers: [YourService],
  imports: [AirDiscountSchemeClientModule],
})
```

```ts
//your.service.ts
import { UsersApi as AirDiscountSchemeApi } from '@island.is/clients/air-discount-scheme'

export class YourService {
  constructor(private airDiscountSchemeApi: AirDiscountSchemeApi) {}

  // your methods here
}
```
