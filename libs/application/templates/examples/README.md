# The example templates

Those example templates serve as a reference for how all application template libraries should be structured.

## Making a new application

There are multiple requirements needed for a new template to be usable by the application system:

1. Run `yarn generate-application-template <name-of-application>` to generate a new template
2. Run `yarn generate-application-template-api-module <name-of-application>` to generate a new template api module
3. Add an application type to `libs/application/types/src/lib/ApplicationTypes.ts`
4. Make sure the new application type matches in the constructor of the service in `libs/application/template-api-modules/src/lib/modules/templates/<new-application>/<new-application>.service.ts` and in `libs/application/templates/<new-application>/src/lib/template.ts`
5. Add to `libs/application/types/src/lib/institutionMapper.ts`
6. Add the application type to `libs/application/template-loader/src/lib/templateLoaders.ts` so that library knows how to import this new application template.
7. Run `yarn codegen`
8. View your new application at `/umsoknir/<slug-from-application-types>`

Note: It also works to create nested applications by running:

1. `yarn generate-application-template <folder-name>/<name-of-application>`
2. `yarn generate-application-template-api-module <folder-name>/<name-of-application>`

## Capabilities

Each application template is an extension of the `ApplicationTemplate` interface. It can include as many forms as desired, and as custom components as well. All code for a application flow resides within the same library.

## Running unit tests

Run `nx test <name-as-it-is-in-the-project.json>` to execute the unit tests via [Jest](https://jestjs.io).

## Custom API functionality

Should your template require custom API actions, like calling an external API or sending an email you should head over to `libs/application/template-api-modules/README.md`

## Applications that support delegations

Applications do not support user delegations by default, however it is simple to add this feature to your application type, see /examples/example-auth-delegation.

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
  allowedDelegations: [{ type: DelegationType.LegalGuardian }],
  ...
}

```

To access the list of national ids for applicantActors that have come in contact with the application:

```ts
const applicantActors = application.applicantActors
```
