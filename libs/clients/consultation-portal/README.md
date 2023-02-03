# Consultation Portal Client

This library implements a client to use Samradsgatt APIs

Documentation about [Samradsgatt api](https://)

### Import into other NestJS modules

Add the service to your module imports and make sure you have the required configuration:

```typescript
import { ConsultationPortalModule } from '@island.is/clients/consultation-portal'

@Module({
  imports: [
    ConsultationPortalModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        IdsClientConfig, // recommended
        ConsultationPortalModuleClientConfig,
      ]
    })
  ],
})
```

Then you'll have access to the Consultation Portal Client Service:

```typescript
import {
  ConsultationPortalClientService,
  IndividualDto,
} from '@island.is/clients/tjodskra'

@Injectable()
export class SomeService {
  constructor(
    private consultationPortalClient: ConsultationPortalClientService,
  ) {}

  async getPerson(nationalId: string): Promise<IndividualDto> {
    return this.consultationPortalClient.getIndividual(nationalId)
  }
}
```

## Code owners and maintainers

- [Gladvania-in-wonderland](https://github.com/orgs/island-is/teams/gladvania-in-wonderland)
