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
import { AirDiscountSchemeClientService } from '@island.is/clients/air-discount-scheme'

export class YourService {
  constructor(
    private airDiscountSchemeClient: AirDiscountSchemeClientService,
  ) {}

  getRelations(user: User) {
    return this.airDiscountSchemeClient.getUserRelations(user)
  }
}
```

`AirDiscountSchemeClientService` forwards the user's auth and maps 403/404 responses to `null` (or `[]` for lists). Other errors are rethrown unchanged.

For endpoints the service doesn't wrap, inject the generated API directly:

```ts
//your.service.ts
import { UsersApi as AirDiscountSchemeApi } from '@island.is/clients/air-discount-scheme'

export class YourService {
  constructor(private airDiscountSchemeApi: AirDiscountSchemeApi) {}

  // your methods here
}
```
