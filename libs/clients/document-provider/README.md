# Document Provider Client

## Overview

This library provides a client for interacting with DocumentProvider APIs.

### Integration with NESTJS Modules

To integrate the Document Provider client into a NESTJS module, include the service in your module's imports as follows:

```typescript
import { ClientsDocumentProviderModule } from '@island.is/clients/document-provider'

@Module({
  imports: [
    ClientsDocumentProviderModule.register({
      basePath: SERVICE_DOCUMENTS_BASEPATH,
    }),
  ],
})
export class YourModuleName {}
```

## Code Owners and Maintainers

- [Advania](https://github.com/orgs/island-is/teams/advania-silicon-valley/members)
