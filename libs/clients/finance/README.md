# Finance Client

## About

This library provides a client for interacting with Finance APIs.

### Import into other NestJS modules

To use the Finance Client in your module, you need to add the service to your module imports as follows:

```typescript
import { FinanceClientModule } from '@island.is/clients/finance'

@Module({
  imports: [FinanceClientModule],
})
export class YourModule {}
```

### Accessing Finance APIs

Once imported, you can access the Finance APIs through the `FinanceClientService`. Here's an example of how to use the service:

```typescript
import { FinanceClientService } from '@island.is/clients/finance'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SomeService {
  constructor(private readonly financeService: FinanceClientService) {}

  async getStatus(user: { nationalId: string }): Promise<FinanceStatus> {
    const financeStatus = await this.financeService.getFinanceStatus(
      user.nationalId,
      user,
    )

    if (financeStatus) {
      return financeStatus
    }

    // Handle the case where financeStatus is undefined or null
  }
}
```

## Code Owners and Maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan)

## Additional Information

For response examples, refer to the [mock data examples](/libs/api/mocks/src/domains/finance/index.ts).

## Running Unit Tests

To execute the unit tests via [Jest](https://jestjs.io), run the following command:

```bash
nx test clients-finance
```
