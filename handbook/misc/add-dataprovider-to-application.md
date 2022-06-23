# Guide: Add a dataprovider to your application template

This document describes how you can add a shared and custom dataproviders to your application Template

### 1. Set up your dataprovider definitions

Make your definitions available to your Template

```typescript
import {
  ApplicationTemplateAPIAction,
  SharedDataProviders,
} from '@island.is/application/core'

export { SharedDataProviders } from '@island.is/application/core'

export const MyApplicationDataProviders = {
  myApplicationProvider: {
    dataProviderType: 'myDataProvider',
    apiModuleAction: 'getMyData',
    externalDataId: 'myData',
  },
} as MyApplicationDataProviders

export interface MyApplicationDataProviders {
  myDataProvider: ApplicationTemplateAPIAction
}
```

## Add your provider to the appropriate role in a state.

```diff
  [States.DRAFT]: {
    meta: {
        name: States.DRAFT,
        ...
        roles: [
        ...
        {
            id: Roles.APPLICANT,
            formLoader: () =>
            import('../forms/Draft').then((val) =>
                Promise.resolve(val.Draft),
            ),
            read: 'all',
            write: 'all',
+           api: [
+             MyApplicationDataProviders.myDataProvider
+           ]
        },
        ...
    ...
    },
```

## Add the dataprovider to your external data form

Include your provider in buildDataProviderItem object.

```typescript
 buildExternalDataProvider({
      title: externalData.dataProvider.pageTitle,
      id: 'approveExternalData',
      subTitle: externalData.dataProvider.subTitle,
      description: externalData.extraInformation.description,
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          id: 'myDataProvider',
          provider: MyApplicationDataProviders.myDataProvider,
          title: externalData.MyApplicationDataProviders.title,
          subTitle: externalData.MyApplicationDataProviders.description,
        }),
      ],
    }),
```
