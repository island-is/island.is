```markdown
# National Registry V2 Client

This library provides a client for interacting with Þjóðskrá APIs.

For more information about the Þjóðskrá API, please refer to the [API documentation](https://api-dev.skra.is).

## How to Connect to X-Road

To connect, you need to proxy the X-Road socat service. Use one of the following commands:

```bash
./scripts/run-xroad-proxy.sh
```

or

```bash
kubectl -n socat port-forward svc/socat-xroad 8080:80
```

Ensure the following environment variables are set: `XROAD_BASE_PATH_WITH_ENV`, `XROAD_TJODSKRA_MEMBER_CODE`, `XROAD_TJODSKRA_API_PATH`, and `XROAD_CLIENT_ID`.

### Importing into Other NestJS Modules

To use the service in your NestJS module, follow these steps to import the service and configure it correctly:

```typescript
import { NationalRegistryModule } from '@island.is/clients/national-registry-v2'

@Module({
  imports: [
    NationalRegistryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        IdsClientConfig, // recommended
        NationalRegistryClientConfig,
        XRoadConfig,
      ],
    }),
  ],
})
```

Once configured, you can access the National Registry Client Service:

```typescript
import {
  NationalRegistryClientService,
  IndividualDto,
} from '@island.is/clients/tjodskra'

@Injectable()
export class SomeService {
  constructor(private nationalRegistryClient: NationalRegistryClientService) {}

  async getPerson(nationalId: string): Promise<IndividualDto> {
    return this.nationalRegistryClient.getIndividual(nationalId)
  }
}
```

## Code Owners and Maintainers

- [Kolibri-Modern-Family](https://github.com/orgs/island-is/teams/kolibri-modern-family/members)
```