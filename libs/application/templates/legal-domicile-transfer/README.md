# Reference Template

This library is a reference how all application template libraries can be.

## Requirements

There are multiple requirements needed for a new template to be usable by the application system:

1. Add a unique application type to `application/core/src/types/ApplicationType.ts`
2. Build a new library similar to this one under the folder `application/templates/`
3. The default export of this library has to be an object that extends the `ApplicationTemplate` interface
4. Add to `application/template-loader/src/lib/templateLoaders.ts` so that library knows how to import this new application template.
5. If the template includes custom fields only used by this application, export a submodule `getFields` (see `application/templates/parental-leave`):

```ts
import ParentalLeaveTemplate from './lib/ParentalLeaveTemplate'

export const getFields = () => import('./fields/')

export default ParentalLeaveTemplate
```

## Capabilities

Each application template is an extension of the `ApplicationTemplate` interface. It can include as many custom fields as desired, and as many forms as well. All code for this application flow resides within the same library.

## Running unit tests

Run `ng test application-templates-reference-template` to execute the unit tests via [Jest](https://jestjs.io).
