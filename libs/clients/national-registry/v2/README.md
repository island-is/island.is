# National Registry V2 Client

This library implements a client to use Þjóðskrá APIs

Documentation about [Þjóðskrá api](https://api-dev.skra.is)

## How to connect to X-Road

To use it you need to have proxy the X-Road socat service:

```bash
  ./scripts/run-xroad-proxy.sh
```

or

```bash
  kubectl -n socat port-forward svc/socat-xroad 8080:80
```

and make sure the environment variables `XROAD_BASE_PATH_WITH_ENV`, `XROAD_TJODSKRA_MEMBER_CODE`, `XROAD_TJODSKRA_API_PATH` and `XROAD_CLIENT_ID` are available.

### Import into other NestJS modules

Add the service to your module imports and make sure you have the required configuration:

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
      ]
    })
  ],
})
```

Then you'll have access to the National Registry Client Service:

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

## Code owners and maintainers

- [Kolibri-Modern-Family](https://github.com/orgs/island-is/teams/kolibri-modern-family/members)
