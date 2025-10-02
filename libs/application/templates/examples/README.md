# Example application templates

This libraries serve as examples for how all application template libraries should be structured.

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

## Preferred folder structure of templates and template-api-modules

Rule of thumb should be that every application (at least new ones) should live within an institution folder that lives within /templates

For example:

- /templates/hms/rental-agreement
- /templates/aosh/practical-exam

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
  allowedDelegations: [{ type: DelegationType.LegalGuardian }],
  ...
}

```

To access the list of national ids for applicantActors that have come in contact with the application:

```ts
const applicantActors = application.applicantActors
```

## Coding guidelines

The aim is to have all applications to be coded in a similar way, so that every developer that is familiar with the application system can open any application and everything is consistent and feels familiar.

- Reduce the amount of custom components to a minimum.
- Reduce the use of the "as" and "any" keywords as much as possible. Both of those keywords are tricking the linter to accept code that would otherwise throw errors and might cause hard to trace bugs.
- Try to use the `getValueViaPath` function to access the answers of the application. It makes accessing nested values easier and the code more readable. Note that this function is generic and a type can be provided to make sure the type of the value is correct E.g:

`getValueViaPath<string>(application.answers, 'some.nested.value', 'optional fallback')`

- Don't use fake steps, stepper should only be showing steps of the current form. On the first step in the main form, there shouldn't be a back button or the illusion that you can go back to the prerequsites step.

## Folder structure

|-- assets/--------------------------------# optional folder for assets like images, icons, etc. \
|------------------------------------------# \
|-- components/----------------------------# optional folder for React components that are used by custom components.\
|------------------------------------------# \
|-- dataProviders/-------------------------# folder for data providers.\
|------------------------------------------# \
|-- fields/--------------------------------# optional folder for custom components if the application needs any.\
|-- |-- index.ts---------------------------# Exports all fields from the folder.\
|-- |-- myCustomComponent/-----------------# Folder for a custom component, camelCase.\
|-- |-- |-- MyCustomComponent.tsx----------# React component file, PascalCase.\
|-- |-- |-- MyCustomComponent.css.ts-------# CSS file, PascalCase.\
|------------------------------------------# \
|-- forms/---------------------------------# folder for forms. More about form folder structure in the form folder README.\
|-- |-- prerequisitesForm/
|-- |-- mainForm/
|-- |-- conclusionForm/--------------------# More forms if needed\
|------------------------------------------# \
|-- graphql/-------------------------------# optional folder for graphql queries and mutations.\
|------------------------------------------# \  
|-- lib/-----------------------------------# folder for data schema, messages, and the main template file.\
|-- |-- dataScema.ts-----------------------# Validation for the application.\
|-- |-- mainTemplate.ts--------------------# Main template file. State machine for the application, mapUsersToRole and more\
|-- |-- messages.ts------------------------# File for all text that appears on the screen, synced with Contentful.\
|-- |-- messages/--------------------------# optional folder for messages if there is a need to have the messages more organized.\
|------------------------------------------# \
|-- shared/--------------------------------# optional folder for code that might be needed in the template-api-modules or other places outside the template.\
|------------------------------------------# \
|-- utils/---------------------------------# folder for utility functions, constants, enums and types.\
|-- |-- constants.ts-----------------------# Constants for the application.\
|-- |-- enums.ts---------------------------# Enums for the application.\
|-- |-- types.ts---------------------------# Types for the application.\
|-- |-- helperFunctions.ts-----------------# Helper functions for the application, this can be many files.\
