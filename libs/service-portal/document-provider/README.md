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
    children: [
      {
        name: defineMessage({
          id: 'service.portal:document-provider-document-providers',
          defaultMessage: 'Skjalaveitendur',
        }),
        path: ServicePortalPath.DocumentProviderDocumentProviders,
      },
      {
        name: defineMessage({
          id: 'service.portal:document-provider-my-categories',
          defaultMessage: 'Mínar flokkar',
        }),
        path: ServicePortalPath.DocumentProviderMyCategories,
      },
      {
        name: defineMessage({
          id: 'service.portal:document-provider-settings',
          defaultMessage: 'Stillingar',
        }),
        path: ServicePortalPath.DocumentProviderSettingsRoot,
      },
      {
        name: defineMessage({
          id: 'service.portal:document-provider-technical-info',
          defaultMessage: 'Tæknilegar upplýsingar',
        }),
        path: ServicePortalPath.DocumentProviderTechnicalInfo,
      },
    ],
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

and add the paths to to `libs/service-portal/core/src/lib/navigation/paths.ts`

```ts
  DocumentProviderDocumentProviders = '/skjalaveita/skjalaveitendur',
  DocumentProviderMyCategories = '/skjalaveita/minir-flokkar',
  DocumentProviderSettingsRoot = '/skjalaveita/skjalaveita-stillingar',
  DocumentProviderSettingsEditInstituion = '/skjalaveita/skjalaveita-stillingar/breyta-stofnun',
  DocumentProviderSettingsEditResponsibleContact = '/skjalaveita/skjalaveita-stillingar/breyta-abyrgdarmanni',
  DocumentProviderSettingsEditTechnicalContact = '/skjalaveita/skjalaveita-stillingar/breyta-taeknilegum-tengilid',
  DocumentProviderSettingsEditUserHelpContact = '/skjalaveita/skjalaveita-stillingar/breyta-notendaadstod',
  DocumentProviderSettingsEditEndpoints = '/skjalaveita/skjalaveita-stillingar/breyta-endapunkt',
  DocumentProviderTechnicalInfo = '/skjalaveita/taeknilegar-upplysingar',
```
