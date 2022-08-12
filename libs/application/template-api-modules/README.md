<!-- gitbook-navigation: "Template API Modules" -->

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

Example of a template API service:

```typescript
import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateApplicationApprovedEmail } from './emailGenerators'

@Injectable()
export class ReferenceTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

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
- Add it to the modules array
- Export your service `export { YourService } from './your-module/your-module.service'`

Example:

```typescript
// Other module imports
import { ReferenceTemplateModule } from './reference-template/reference-template.module'

export const modules = [/* other modules , */ ReferenceTemplateModule]

// Other module service exports
export { ReferenceTemplateService } from './reference-template/reference-template.service'
```

<br/>

**Import your module from the template API module**

Example:

```typescript
import { ParentalLeaveModule, ReferenceTemplateModule } from './templates'
```

<br/>

**Add your module to the imports array**

```typescript

import { /* existing modules , */ yourModule } from './templates'

const templateModulesToLoad = [/* existing modules */, yourModule]

// ...
imports: [
  ...templateModulesToLoad.map((Module) => Module.register(config)),
],
```

### 4. Make it possible to call actions/methods from your new module

- Open `template-api.service.ts`
- Import your new module service
- Look at the `performAction` method
  - Add your service to the switch case when your template id is being used

```typescript
async performAction(
  action: ApplicationApiAction,
): Promise<PerformActionResult> {
  switch (action.templateId) {
    case ApplicationTypes.EXAMPLE:
      return this.tryRunningActionOnService(
        this.referenceTemplateService,
        action,
      )
    case ApplicationTypes.YOUR_TEMPLATE:
      return this.tryRunningActionOnService(this.yourModuleService, action)
  }

  return [false]
}
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
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: { /* ... */ },
      inReview: { /* ... */ },
      approved: {
        meta: {
          // ...
          onEntry: {
            apiModuleAction: TEMPLATE_API_ACTIONS.sendApplication,
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
          },
        },
      },
    },
  },
```

# Add a dataprovider to your application

This describes how you can add a shared and custom dataproviders to your application Template

## 1. Add your action to your template api

See documentation on how to add a new template api [here](#getting-started)

## 2. Set up your dataprovider definitions

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
    //Has to match the apiModule action in your template api added earlier
    apiModuleAction: 'getMyData',
    externalDataId: 'myData',
  },
} as MyApplicationDataProviders

export interface MyApplicationDataProviders {
  myDataProvider: ApplicationTemplateAPIAction
}
```

### Add your provider to the appropriate role in a state.

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

### Add the dataprovider to your external data form

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

## 3. Additional dataprovider settings

## Custom order

Forces the dataproviders to run sequentially in order. Responses are populated in external data and can be accessed by other providers during execution.
Each action with the same order number is run in parallel and actions.
Actions default to 0 and are run first in parallel.

```typescript
  myApplicationProvider: {
    dataProviderType: 'myDataProvider',
    //Has to match the apiModule action in your template api added earlier
    apiModuleAction: 'getMyData',
    externalDataId: 'myData',
    order: 1, //Runs first
  },
  myApplicationProvider2: {
    dataProviderType: 'myDataOtherProvider',
    //Has to match the apiModule action in your template api added earlier
    apiModuleAction: 'getMyOtherData',
    externalDataId: 'myOtherData',
    order: 2, //Waits till getMyData resolves
  }
```

## Custom error messages

You can add an error reason based on a problem type thrown by your apiModuleAction

```typescript
  myApplicationProvider: {
    dataProviderType: 'myDataProvider',
    //Has to match the apiModule action in your template api added earlier
    apiModuleAction: 'getMyData',
    externalDataId: 'myData',
    //Error messages to be displayed to the user. Maps to the ProblemType enum thrown by the Service
    errorReasons: [
      {
        problemType: ProblemType.HTTP_NOT_FOUND,
        reason: {
          title: 'Something was missing',
          summary: 'A more detailed summary of why',
        },
        statusCode: 404,
      },
    ],
```

Or you could add an error handler that catches a valid response

```typescript
  myApplicationProvider: {
    dataProviderType: 'myDataProvider',
    //Has to match the apiModule action in your template api added earlier
    apiModuleAction: 'getMyData',
    externalDataId: 'myData',
    //Conditonally return an error reason from a valid response from the provider
    errorReasonHandler: (data: PerformActionResult) => {
      if (data.success) {
        const s = data.response as NationalRegistryUser

        if (s.age < 18) {
          return {
            reason: {
              title: 'You have not reached 18 years of age',
              summary: 'Summary of just why ',
            },
            problemType: ProblemType.VALIDATION_FAILED,
            statusCode: 400,
          }
        }
      }
    },
```

## Parameters

You can add a custom parameter that can be passed into the apiModuleAction

```typescript
  myApplicationProvider: {
    dataProviderType: 'myDataProvider',
    //Has to match the apiModule action in your template api added earlier
    apiModuleAction: 'getMyData',
    externalDataId: 'myData',
    // Custom Parameters for the service
    params: {
      parameterName: 'value',
    },
```

The `params` object will be passed into the template api function

```typescript
@Injectable()
export class SomeService {
  constructor(private someApi: API) {}

  async getMyData({ params }: TemplateApiModuleActionProps): Promise<SomeData> {
    const value = params?.parameterName as string

    const data = await this.someApi.get(value)

    return data
  }
}
```

## Set up a shared DataProvider

### 1. Create a shared provider definition

Add your definition to `libs/application/core/src/constants/sharedDataProviders.ts`

```typescript
export const SharedDataProviders = {
  ...
  mySharedProvider: {
    apiModuleAction: 'mySharedProviderAction',
    namespace: 'MySharedProvider',
    dataProviderType: 'mySharedProvider',
  },
} as AvailableSharedDataProviders

export interface AvailableSharedDataProviders {
  mySharedProvider: ApplicationTemplateAPIAction
}
```

### 2. Create a module and a service

[See step 2](#2-Create-the-module-and-a-service) from above. Shared data provider modules should be located `/lib/modules/shared/data-providers`

### 3. Register and include your module

Import your module in `/lib/modules/data-providers/data-providers.module.ts`

And include your service in `/lib/modules/data-providers/data-providers.service.ts` :

```typescript

 export type SharedServiceType =
  ...
  | MySharedService

@Injectable()
export class SharedDataProviderService {


  constructor(
    ...
    private readonly myService: MySharedService,
  ) {}

  getProvider(namespace: string): SharedServiceType {
    switch (namespace) {
      ...
      case SharedDataProviders.mySharedProvider.namespace:
        return this.myService

      default:
        throw new Error(`Service with the namespace : ${namespace} not found`)
    }
  }
}

```
