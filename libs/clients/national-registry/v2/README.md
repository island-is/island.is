# Clients National Registry V2

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

Add the service to your module imports:

```typescript
import { NationalRegistryModule } from '@island.is/clients/national-registry-v2'

@Module({
    imports: [
        NationalRegistryModule.register({
            xRoadPath: createXRoadAPIPath(
            config.xRoadBasePathWithEnv,
            XRoadMemberClass.GovernmentInstitution,
            config.xRoadTjodskraMemberCode,
            config.xRoadTjodskraApiPath,
            ),
            xRoadClient: config.xRoadClientId,
        }),
    ],
})
```

Then you'll have access to Þjóðskrá APIs:

```typescript
import {
  EinstaklingarApi,
  FasteigniApi,
  LyklarApi,
} from '@island.is/clients/tjodskra'

@Injectable()
export class SomeService {
  constructor(private personApi: EinstaklingarApi) {}

  async getPerson(
    nationalId: string,
    xRoadClientId: string,
  ): Promise<Einstaklingsupplysingar> {
    return await this.personApi.einstaklingarGetEinstaklingur({
      id: nationalId,
      xRoadClient: xRoadClientId,
    })
  }
}
```

## Code owners and maintainers

- [Kolibri-Modern-Family](https://github.com/orgs/island-is/teams/kolibri-modern-family/members)
