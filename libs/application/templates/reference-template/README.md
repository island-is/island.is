# Reference Template

This library is a reference how all application template libraries can be.

## Requirements

There are multiple requirements needed for a new template to be usable by the application system:

1. Add a unique application type to `application/core/src/types/ApplicationTypes.ts`
2. Build a new library similar to this one under the folder `application/templates/` (yarn generate @nrwl/react:library application/templates/NAME_OF_APPLICATION)
3. The default export of this library has to be an object that extends the `ApplicationTemplate` interface
4. Add to `application/template-loader/src/lib/templateLoaders.ts` so that library knows how to import this new application template.
5. Add a project reference to the `nx.json` [NX](https://github.com/island-is/island.is/blob/main/nx.json) (skip if you used yarn to generate application)

```json
"application-templates-${template-directory-name}": {
  "tags": []
},
```

6. Add a path to the new directory to `tsconfig.base.json` [TSConfig](https://github.com/island-is/island.is/blob/main/tsconfig.base.json) (skip if you used yarn to generate application)

```json
"@island.is/application/templates/${template-directory-name}": [
  "libs/application/templates/${template-directory-name}/src/index.ts"
],
```

7. Add template to `workspace.json` [Workspace]()

```json
"application-templates-${template-directory-name}": {
  "root": "libs/application/templates/${template-directory-name}",
  "sourceRoot": "libs/application/templates/${template-directory-name}/src",
  "projectType": "library",
  "schematics": {},
  "architect": {
    "lint": {
      "builder": "@nrwl/linter:lint",
      "options": {
        "linter": "eslint",
        "tsConfig": [
          "libs/application/templates/${template-directory-name}/tsconfig.lib.json",
          "libs/application/templates/${template-directory-name}/tsconfig.spec.json"
        ],
        "exclude": [
          "**/node_modules/**",
          "!libs/application/templates/${template-directory-name}/**/*"
        ]
      }
    }
  }
},
```

8. If the template includes custom fields only used by this application, export a submodule `getFields` (see `application/templates/parental-leave`):

```ts
import ParentalLeaveTemplate from './lib/ParentalLeaveTemplate'

export const getFields = () => import('./fields/')

export default ParentalLeaveTemplate
```

## Capabilities

Each application template is an extension of the `ApplicationTemplate` interface. It can include as many custom fields as desired, and as many forms as well. All code for this application flow resides within the same library.

## Running unit tests

Run `ng test application-templates-reference-template` to execute the unit tests via [Jest](https://jestjs.io).

## Custom API functionality

Should your template require custom API actions, like calling an external API or sending an email you should head over to `libs/application/template-api-modules/README.md`

## Applications that support delegations

Applications do not support user delegations by default, however it is simple to add this feature to your application type.

When an application supports user delegations of a specific type then a user with actor delegations of the corresponding delegation type will be prompted to choose what user they are applying for before creating a new application. They can choose to switch to a subject from their actor delegations and the subject will be the applicant for a new application and the actor's national id will be stored in the applicantActors field on the application.

If a user should open up a drafted application where the applicant is a user they have correct delegation for the user will be prompted to switch to the correct subject.

If another user with the correct delegation rights for the applicant should update the application they will be added to the applicantActors list.

Should your template require user delegation support you will need to configure the types of delegations that the application should support to the template:

```ts
import { DelegationType } from '@island.is/auth-api-lib'

const ExampleApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ExampleTemplateEvent>,
  ExampleTemplateEvent
> = {
  ...
  // In this example we configure the legal guardian delegation type as an allowed delegation type for the example application
  allowedDelegations: [DelegationType.LegalGuardian],
  ...
}

```

To access the list of national ids for applicantActors that have come in contact with the application:

```ts
const applicantActors = application.applicantActors
```
