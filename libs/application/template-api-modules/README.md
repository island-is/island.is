````markdown
# Application Template API Modules

Applications needing API business logic can invoke template API modules, which run within the application system API.

## Getting Started

### 1. Create Directory for API Module

Create a folder inside `src/lib/modules/templates` named after your template.

### 2. Create Module and Service

Create `{your_template_name}.module.ts` and `{your_template_name}.service.ts` in your directory.

Example of a template API module:

```typescript
import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { ReferenceTemplateService } from './reference-template.service'

export class ReferenceTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ReferenceTemplateModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [ReferenceTemplateService],
      exports: [ReferenceTemplateService],
    }
  }
}
```
````

Example service class:

```typescript
import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { generateApplicationApprovedEmail } from './emailGenerators'

@Injectable()
export class ReferenceTemplateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.EXAMPLE)
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }
}
```

### 3. Register New Module

Import/register your module in `src/lib/modules/template-api.module.ts`.

- Open `src/lib/modules/templates/index.ts`
- Import your module and service.
- Add them to modules and services export arrays.

Example:

```typescript
import { ReferenceTemplateModule } from './reference-template/reference-template.module'
export { ReferenceTemplateService } from './reference-template/reference-template.service'

export const modules = [/* other modules , */ ReferenceTemplateModule]
export const services = [/* other services , */ ReferenceTemplateService]
```

### 5. Invoke Module Actions

```typescript
enum TEMPLATE_API_ACTIONS {
  sendApplication = 'sendApplication'
}

import { defineTemplateApi } from '@island.is/application/types'

stateMachineConfig: {
  initial: 'draft',
  states: {
    draft: { /* ... */ },
    inReview: { /* ... */ },
    approved: {
      meta: {
        onEntry: defineTemplateApi({
          action: TEMPLATE_API_ACTIONS.sendApplication,
          shouldPersistToExternalData: false,
          externalDataId: 'string',
          throwOnError: false,
        }),
      },
    },
  },
}
```

## Add a DataProvider to Application

### 1. Add Action to Template API

Refer to the above documentation.

### 2. Set Up DataProvider Definitions

Create definition in your template lib and available to your Templates' state.

```typescript
import { defineTemplateApi } from '@island.is/application/types'

export const ReferenceDataApi = defineTemplateApi({
  action: 'getData',
})
```

Add provider to the appropriate role:

```diff
import { ReferenceDataApi } from '../dataProviders'

  [States.DRAFT]: {
    meta: {
      roles: [
      {
          id: Roles.APPLICANT,
          formLoader: () =>
          import('../forms/Draft').then((val) =>
              Promise.resolve(val.Draft),
          ),
          read: 'all',
          write: 'all',
+         api: [
+           ReferenceDataApi
+         ]
      },
    },
```

Add provider to external data form:

```typescript
import { ReferenceDataApi } from '../dataProviders'

buildExternalDataProvider({
  title: externalData.dataProvider.pageTitle,
  id: 'approveExternalData',
  dataProviders: [
    buildDataProviderItem({
      provider: ReferenceDataApi,
      title: externalData.MyApplicationDataProviders.title,
    }),
  ],
}),
```

### Additional Settings

#### Custom Order

For sequential execution of dataproviders:

```typescript
import { defineTemplateApi } from '@island.is/application/types'

export const runsFirst = defineTemplateApi({ action: 'actionName', order: 1 })
export const runsSecond = defineTemplateApi({ action: 'actionName', order: 2 })
```

#### Error Handling

Throw `TemplateApiError` with `ErrorReason` and status code:

```typescript
throw new TemplateApiError(
  {
    title: coreErrorMessages.nationalRegistryAgeLimitNotMetTitle,
    summary: coreErrorMessages.couldNotAssignApplicationErrorDescription,
  },
  400,
)
```

### Parameters

Define API with parameter type:

```typescript
export interface MyParameterType {
  id: number
}

export const ReferenceDataApi = defineTemplateApi<MyParameterType>({
  action: 'someAction',
  params: { id: 12 },
})
```

In the service:

```typescript
@Injectable()
export class SomeService extends BaseTemplateApiService {
  async someAction({
    params,
  }: TemplateApiModuleActionProps<MyParameterType>): Promise<SomeData> {
    const myId = params?.id
    const data = await this.someApi.get(myId)
    return data
  }
}
```

## Set Up a Shared DataProvider

### 1. Create a Shared Provider Definition

Add definition to `libs/application/types/src/lib/template-api/shared-api/shared-api-definitions`.

```typescript
export interface SharedApiParameters {
  ageToValidate?: number
}
export const NationalRegistryUserApi = defineTemplateApi<SharedApiParameters>({
  action: 'getUser',
  namespace: 'SharedApi',
})
```

### 2. Create a Module and Service

For shared data provider modules, locate them in `/lib/modules/shared/api` and export from `/lib/modules/shared/api/index.ts`. Pass namespace to the `super` constructor.

```typescript
@Injectable()
export class SomeService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super('SharedApi') // namespace
  }
}
```

## Configuring TemplateApis

Example configuration:

```typescript
export const newApi = defineTemplateApi<MyParameterType>({
  action: 'actionName',
  order: 2,
  externalDataId: 'someValue',
  namespace: 'SomeNamespace',
  params: { id: 1 },
  shouldPersistToExternalData: false,
  throwOnError: false,
})
```

Override with:

```typescript
export const overriddenApi = newApi.configure({
  externalDataId: 'newId',
  order: 0,
  params: { id: 2 },
  shouldPersistToExternalData: true,
  throwOnError: true,
})
```

Useful for importing Shared APIs:

```typescript
export interface SharedApiParameters {
  id?: number
}

export const SharedApi = defineTemplateApi<SharedApiParameters>({
  action: 'getData',
  namespace: 'SharedApi',
})

import { SharedApi } from '@island.is/application/types'

...

  [States.DRAFT]: {
    meta: {
      roles: [
      {
        id: Roles.APPLICANT,
        api: [
          SharedApi.configure({
            params: { id: 2 },
          })
       ]
      },
    },
```

## Enable Payment Mocking

To enable payment mocking, add `enableMockPayment: true` to `buildExternalDataProvider`.

Example in `libs/application/templates/example-payment/src/forms/draft.ts`:

```typescript
buildExternalDataProvider({
  title: m.draft.externalDataTitle,
  id: 'approveExternalData',
  enableMockPayment: true,
  dataProviders: [
    buildDataProviderItem({
      provider: PaymentCatalogApi,
      title: m.draft.feeInfo,
    }),
  ],
}),
```

This adds a checkbox to skip the payment step.

```

```
