# VMST Client

## About

This library implements a client to interact with VMST APIs.

### Import into Other NestJS Modules

To use the VMST client within your NestJS modules, include the service in your module imports:

```typescript
import { VMSTModule } from '@island.is/clients/vmst';

@Module({
  imports: [
    VMSTModule.register({
      xRoadBasePath: XROAD_BASE_PATH,
      xRoadClient: XROAD_CLIENT,
      apiKey: VMST_API_KEY,
    }),
  ],
})
```

### Usage

Once imported, you'll have access to the VMST APIs through the client:

```typescript
import { UnionApi } from '@island.is/clients/vmst';

@Injectable()
export class SomeService {
  constructor(private unionApi: UnionApi) {}

  async getUnions(): Promise<Union[]> {
    const { unions } = await this.unionApi.unionGetUnions();

    if (unions) {
      return unions;
    }

    // Handle case where no unions are returned
    return [];
  }
}
```

Ensure that you handle cases where the API might not return data as expected.

## Code Owners and Maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)