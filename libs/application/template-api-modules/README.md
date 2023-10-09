# Application Template API Modules

When applications in the application system require API business logic they can invoke template API modules.

Template API modules run within the application system API.

## Getting started

### 1. Create a new directory for the API module

To create a new template API module you should start by creating a folder inside `src/lib/modules/templates` with the same name as your template

### 2. Create the module and a service

Your API module consists of a NestJS [module](https://docs.nestjs.com/modules) and a service.

Start by creating `{your_template_name}.module.ts` and `{your_template_name}.service.ts` in your newly created directory.

Example of a template API module:

```typescript
import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
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

Create your service class that extends the `BaseTemplateApiService` and provide the application type to the `super` constructor. \
Example:

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
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Use the shared service to send an email using a custom email generator
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }
}
```

### 3. Register your new module

To start using your new module it has to be imported/registered by the central template API module found in `src/lib/modules/template-api.module.ts`, this is the module imported by the application-system-api module.

**Export your new module and service**

- Open `src/lib/modules/templates/index.ts`
- Import your module `import { YourModule } from './your-module/your-module.module'`
- Add it to the modules export array
- Import your service `import { YourService } from './your-module/your-module.service'`
- Add it to the services export array

Example:

```typescript
// Other module imports
import { ReferenceTemplateModule } from './reference-template/reference-template.module'
// Other module service imports
export { ReferenceTemplateService } from './reference-template/reference-template.service'

export const modules = [/* other modules , */ ReferenceTemplateModule]
export const services = [/* other services , */ ReferenceTemplateService]
```

### 5. Invoke your new module actions from the template state machine

```typescript
/* In a constant file */
enum TEMPLATE_API_ACTIONS {
  // Has to match name of action in template API module
  // (will be refactored when state machine is a part of API module)
  sendApplication = 'sendApplication'
}

/* inside state machine ... */
import { defineTemplateApi } from '@island.is/application/types'

  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: { /* ... */ },
      inReview: { /* ... */ },
      approved: {
        meta: {
          // ...
          // onEntry and onExit support either a single api or a list of apis.
          onEntry:  defineTemplateApi({
            action: TEMPLATE_API_ACTIONS.sendApplication,
            // (Optional) Should the response/error be persisted to application.externalData
            // Defaults to true
            shouldPersistToExternalData: false,
            // (Optional) Id that will store the result inside application.externalData
            // Defaults to value of apiModuleAction
            externalDataId: 'string',
            // (Optional) Should the state transition be blocked if this action errors out?
            // Will revert changes to answers/assignees/state
            // Defaults to true
            throwOnError: false,
          }),
        },
      },
    },
  },
```

# Add a dataprovider to your application

This describes how you can add a shared and custom dataproviders to your application Template

## 1. Add your action to your template api

See documentation on how to add a new template api [above](#getting-started)

## 2. Set up your dataprovider definitions

Create your definition in your template lib (eg. `libs/application/templates/your-applicatoin/src/dataProviders/index.ts`) and make your definitions available to your Templates' state

```typescript
import { defineTemplateApi } from '@island.is/application/types'

export const ReferenceDataApi = defineTemplateApi({
  action: 'getData',
})
```

### Add your provider to the appropriate role in a state.

```diff
import { ReferenceDataApi } from '../dataProviders'
...

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
+             ReferenceDataApi
+           ]
        },
        ...
    ...
    },
```

### Add the dataprovider to your external data form

Include your provider in buildDataProviderItem object.

```typescript
import { ReferenceDataApi } from '../dataProviders' // <---

 buildExternalDataProvider({
      title: externalData.dataProvider.pageTitle,
      id: 'approveExternalData',
      subTitle: externalData.dataProvider.subTitle,
      description: externalData.extraInformation.description,
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: ReferenceDataApi, // <----
          title: externalData.MyApplicationDataProviders.title,
          subTitle: externalData.MyApplicationDataProviders.description,
        }),
      ],
    }),
```

## 3. Additional dataprovider settings

## Custom order

Forces the dataproviders to run sequentially in order. Responses are populated in external data and can be accessed by other providers during execution.
Each action with the same order number is run in parallel and actions.
Actions default to 0 and are run first in parallel.

```typescript
import { defineTemplateApi } from '@island.is/application/types'

export const runsFirst = defineTemplateApi({
  action: 'actionName',
  order: 1, // runs first
})

export const runsSecond = defineTemplateApi({
  action: 'actionName',
  order: 2, // Waits until "runsFirst" resolves
})
```

## Custom error messages and error handling

Within your service you can throw a TemplateApiError and provide it with an `ErrorReason` object and a status code.

```typescript
throw new TemplateApiError(
  {
    title: coreErrorMessages.nationalRegistryAgeLimitNotMetTitle,
    summary: coreErrorMessages.couldNotAssignApplicationErrorDescription,
  },
  400,
)
```

If the service throws an unexpected error the template runner catches it logs the error and throws a New TemplateApiError with a default message and a 500 error code.

## Parameters

You can add a custom parameter that can be passed into the your action.
First define your api with a parameter type

```typescript
export interface MyParameterType {
  id: number
}

export const ReferenceDataApi = defineTemplateApi<MyParameterType>({
  action: 'someAction',
  params: {
    id: 12,
  },
})
```

The `params` object will be passed into the template api function like so:

```typescript
@Injectable()
export class SomeService extends BaseTemplateApiService {
  constructor(private someApi: API) {
    super(ApplicationTypes.SOME_APPLICATION)
  }

  async someAction({
    params,
  }: TemplateApiModuleActionProps<MyParameterType>): Promise<SomeData> {
    const myId = params?.id

    const data = await this.someApi.get(myId)

    return data
  }
}
```

## Set up a shared DataProvider

### 1. Create a shared provider definition

Add your definition to `libs/application/types/src/lib/template-api/shared-api/shared-api-definitions`

```typescript
export interface SharedApiParameters {
  ageToValidate?: number
}
export const NationalRegistryUserApi = defineTemplateApi<SharedApiParameters>({
  action: 'getUser',
  namespace: 'SharedApi',
})
```

### 2. Create a module and a service

[See step 2](#2-Create-the-module-and-a-service) identical setup from above exluding.

- Shared data provider modules should be located in `/lib/modules/shared/api` and modules and service exported from `/lib/modules/shared/api/index.ts`
- The namspace set in the `defineTemplateApi` in step 1 should be passed into the `super` constructor

```typescript
@Injectable()
export class SomeService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super('SharedApi') // <---- namespace
  }
```

## Configuring TemplateApis

```typescript
export interface MyParameterType {
  id: number
}

export const newApi = defineTemplateApi<MyParameterType>({
  // Has to match name of action in template API module
  action: 'actionName',
  // (Optional) Sets the order in which this action should run
  order: 2, // Waits until "runsFirst" resolves.
  // (Optional) Id that will store the result inside application.externalData
  // Defaults to value of apiModuleAction
  externalDataId: 'someValue',
  // (Optional) Used for shared providers that do not belong to an Applicaion
  // This value is passed to the super constructor of the extended BaseTemplateApiService containing the action defined
  namespace: 'SomeNamespace',
  // (Optional) Parameters passed into the action, The parameters' type is set in the defineTemplateApi function call
  params: {
    //params is now of the type MyParameterType
    id: 1,
  },
  // (Optional) Should the response/error be persisted to application.externalData
  // Defaults to true
  shouldPersistToExternalData: false,
  // (Optional) Should the state transition be blocked if this action errors out?
  // Will revert changes to answers/assignees/state
  // Defaults to true
  throwOnError: false,
})
```

The api can then be overridden with the configure function with the following optional attributes:

```typescript
export const overriddenApi = newApi.configure({
  externalDataId: 'newId',
  order: 0,
  params: {
    id: 2,
  },
  shouldPersistToExternalData: true,
  throwOnError: true,
})
```

This can be useful when importing Shared Apis and you need to your own configuration of the api.

```typescript
export interface SharedApiParameters {
  id?: number
}
export const SharedApi = defineTemplateApi<SharedApiParameters>({
  action: 'getData',
  namespace: 'SharedApi',
}) // the parameter Id is not set yet.

/// Your template file
import { SharedApi } from '@island.is/application/types'

...
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
          api: [
            // The api is now set to be invoked with id parameter with the value of 2
            SharedApi.configure({
              params: {
                id: 2,
              },
            })
         ]
        },
        ...
    ...
    },

```
