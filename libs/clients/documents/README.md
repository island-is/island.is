# Documents Client (Pósthólf)

## About

This library implements a client to use Documents APIs

### Import into other NestJS modules

Add the service to your module imports:

```typescript
import {
  DocumentsClientModule,
} from '@island.is/clients/documents'

@Module({
  imports: [
    DocumentsClientModule.register({
      basePath: BASE_PATH,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      tokenUrl: TOKEN_URL,
    }),
  ],
})

```

Then you'll have access to DocumentClient APIs:

```typescript
import { DocumentClient } from '@island.is/clients/documents'

@Injectable()
export class SomeService {
   constructor(
    @Inject(DocumentClient)
    private readonly documentClient: DocumentClient,
  ) {}

    // ....
  }
}
```

## Code owners and maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda/members)
