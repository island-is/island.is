```markdown
# Identity

This library implements a client that integrates the [National Registry V2 Client](https://docs.devland.is/libs/clients/national-registry) and the [RSK Company Client](https://docs.devland.is/libs/clients/rsk). It returns an Identity object depending on whether the provided nationalId belongs to an individual or a company.

## How to Connect to X-Road

To use this library, you need to proxy the X-Road socat service:

```bash
./scripts/run-xroad-proxy.sh
```

or

```bash
kubectl -n socat port-forward svc/socat-xroad 8080:80
```

Ensure the following environment variables are set: `XROAD_BASE_PATH_WITH_ENV`, `XROAD_TJODSKRA_MEMBER_CODE`, `XROAD_TJODSKRA_API_PATH`, `COMPANY_REGISTRY_XROAD_PROVIDER_ID`, and `XROAD_CLIENT_ID`.

### Import into Other NestJS Modules

Add the service to your module imports and ensure the required configuration is present:

```typescript
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config';
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2';
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry';
import { IdentityClientModule } from '@island.is/clients/identity';

@Module({
  imports: [
    IdentityClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        IdsClientConfig, // recommended
        NationalRegistryClientConfig,
        XRoadConfig,
        CompanyRegistryConfig,
      ],
    }),
  ],
})
```

With this setup, you'll have access to the Identity Client Service:

```typescript
import { Identity, IdentityClientService } from '@island.is/clients/identity';

@Injectable()
export class SomeService {
  constructor(private readonly identityService: IdentityClientService) {}

  async getPerson(nationalId: string): Promise<Identity> {
    return this.identityService.getIdentity(nationalId);
  }
}
```
```