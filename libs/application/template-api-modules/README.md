# Template API Modules

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
