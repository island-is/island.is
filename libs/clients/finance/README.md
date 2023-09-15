# Finance Client

## About

This library implements a client to use Finance APIs

### Import into other NestJS modules

Add the service to your module imports:

```typescript
import { FinanceClientModule } from '@island.is/clients/finance'

@Module({
  imports: [
    FinanceClientModule
  ],
})
```

Then you'll have access to Finance APIs:

```typescript
import { FinanceClientService } from '@island.is/clients/finance'

@Injectable()
export class SomeService {
  constructor(private readonly financeService: FinanceClientService) {}

  async getStatus(): Promise<FinanceStatus> {
    const financeStatus = await this.financeService.getFinanceStatus(
      user.nationalId,
      user,
    )

    if (financeStatus) {
      return financeStatus
    }

    // ....
  }
}
```

## Code owners and maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan)

## Extra

See response [examples](/libs/api/mocks/src/domains/finance/index.ts) in mock data.

## Running unit tests

Run `nx test clients-finance` to execute the unit tests via [Jest](https://jestjs.io).
