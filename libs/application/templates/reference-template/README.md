````markdown
# Reference Template

This library serves as a reference for how all application template libraries should be structured.

## Requirements

To integrate a new template within the application system, please adhere to the following steps:

1. Generate a new library by executing:
   ```bash
   yarn generate @nrwl/react:library application/templates/NAME_OF_APPLICATION
   ```
````

2. Ensure the default export of this library is an object extending the `ApplicationTemplate` interface.
3. Introduce a unique application type in `application/types/src/lib/ApplicationTypes.ts`.
4. Update `application/template-loader/src/lib/templateLoaders.ts` to ensure the library recognizes how to import the newly created application template.
5. If the template includes custom fields that are exclusive to this application, ensure the export of a submodule `getFields`. Refer to `application/templates/parental-leave` as an example.
6. Update `application/types/src/lib/institutionMapper.ts`:

   ```ts
   import ParentalLeaveTemplate from './lib/ParentalLeaveTemplate'

   export const getFields = () => import('./fields/')

   export default ParentalLeaveTemplate
   ```

## Capabilities

Each application template is an extension of the `ApplicationTemplate` interface. It allows for the inclusion of any number of custom fields and forms. All code related to the application flow resides within the same library.

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run:

```bash
ng test application-templates-reference-template
```

## Custom API Functionality

If your template requires custom API functionalities, such as calling an external API or sending an email, please refer to `libs/application/template-api-modules/README.md`.

## Applications Supporting Delegations

By default, applications do not support user delegations, but this feature can be added easily.

For applications supporting specific delegation types, a user with actor delegations for these types will be prompted to select the user for whom they are applying before initiating a new application. Users can switch to a subject from their actor delegations, making the subject the applicant for the new application, while the actor's national ID will be saved in the `applicantActors` field.

If a user accesses a drafted application where the applicant is a user they have delegation rights for, they'll be prompted to adopt the subject role.

If another user with proper delegation rights updates the application, they will be added to the `applicantActors` list.

To enable user delegation support, configure the delegation types your application should accommodate:

```ts
import { DelegationType } from '@island.is/auth-api-lib'

const ExampleApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ExampleTemplateEvent>,
  ExampleTemplateEvent
> = {
  ...
  // Legal guardian delegation type configured as permissible for the example application
  allowedDelegations: [{ type: DelegationType.LegalGuardian }],
  ...
}
```

To access the list of national IDs of `applicantActors` that have come in contact with the application, use:

```ts
const applicantActors = application.applicantActors
```

```

```
