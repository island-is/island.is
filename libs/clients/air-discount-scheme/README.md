```markdown
# Air Discount Scheme Client

This client interacts with the Air Discount Scheme Backend. It exposes certain private methods intended for internal or machine client use.

To generate the client, run the following command:

```bash
yarn nx run clients-air-discount-scheme:codegen/backend-client
```

## Simple Usage

In your module, set up the imports as follows:

```ts
// your.module.ts
import { AirDiscountSchemeClientModule } from '@island.is/clients/air-discount-scheme'

@Module({
  providers: [YourService],
  imports: [AirDiscountSchemeClientModule],
})
export class YourModule {}
```

In your service, inject the API:

```ts
// your.service.ts
import { UsersApi as AirDiscountSchemeApi } from '@island.is/clients/air-discount-scheme'

export class YourService {
  constructor(private readonly airDiscountSchemeApi: AirDiscountSchemeApi) {}

  // Define your methods here
}
```
```