# Document Provider

## About

This module is a management portal for Document Providers, where they can:

- See statistics for their documents.
- Manage document's categories and types.
- Manage settings, such as set the endpoint to their API where documents are provided.

### Document Providers

Document Providers are those who can send document references to the mailbox on island.is and provide the document on their servers when asked for. Documents are never stored on island.is' servers.

## How to show in navigation

Since the development of the institutions service portal hasn't stared yet, this module doesn't belong anywhere at the moment.

For development purposes you can add it to the individual's service portal navigation by adding a navigation object to `libs/service-portal/core/src/lib/navigation/masterNavigation.ts`

```ts
{
  name: defineMessage({
    id: 'service.portal:document-provider',
    defaultMessage: 'Skjalaveita',
  }),
  path: ServicePortalPath.DocumentProviderRoot,
  icon: {
    type: 'outline',
    icon: 'receipt',
  },
},
```

and then add the module to `apps/service-portal/src/store/modules.ts`

```ts
import { documentProviderModule } from '@island.is/service-portal/document-provider'

export const modules: ServicePortalModule[] = [
  // ...
  documentProviderModule,
]
```
