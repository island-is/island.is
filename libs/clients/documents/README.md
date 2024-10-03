# Documents Client (Pósthólf)

## About

This library implements a client for interacting with Documents APIs.

### Importing into Other NestJS Modules

To add this service to your module imports, use the following:

```typescript
import { DocumentsClientModule } from '@island.is/clients/documents'

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
export class YourModule {}
```

You will then have access to DocumentsClient APIs:

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
```

## Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda/members)
