# Document Provider Client

## About

This library implements a client to use DocumentProvider APIs

> NOTE: Since there is a race condition while creating schemas in the build process, the documents-service has to be treated as external service.
> Therefore, the yaml has to be copied from `apps/services/documents/src/openapi.yaml` and pasted into the `clientConfig.yaml`.

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
