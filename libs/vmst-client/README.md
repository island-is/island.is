# VMST Client

## About

This library implements a client to use VMST APIs

### Import into other NestJS modules

Add the service to your module imports:

```typescript
import { VMSTClientModule } from '@island.is/vmst-client'

@Module({
  imports: [
    VMSTClientModule.register({
      xRoadBasePath: XROAD_BASE_PATH,
      xRoadClient: XROAD_CLIENT,
      apiKey: VMST_API_KEY,
    }),
  ],
})
```

Then you'll have access to VMST APIs:

```typescript
import { UnionApi } from '@island.is/vmst-client'

@Injectable()
export class SomeService {
  constructor(private unionApi: UnionApi) {}

  async getUnions(): Promise<Union[]> {
    const { unions } = await this.unionApi.unionGetUnions()

    if (unions) {
      return unions
    }

    // ....
  }
}
```

## Code owners and maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
