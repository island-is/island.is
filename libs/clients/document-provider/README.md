# Document Provider Client

## About

This library implements a client to use DocumentProvider APIs

### Import into other NESTJS modules

Add the service to your module imports:

```typescript
import { ClientsDocumentProviderModule } from '@island.is/clients/document-provider'

@Module({
  imports: [
    ClientsDocumentProviderModule.register({
      basePath: SERVICE_DOCUMENTS_BASEPATH,
    }),
  ],
})
```

## Code owners and maintainers

- [Advania](https://github.com/orgs/island-is/teams/advania-silicon-valley/members)
