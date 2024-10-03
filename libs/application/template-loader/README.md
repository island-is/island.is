# Application Template Loader

The sole purpose of this library is to lazily load application templates, data providers, forms, and fields. This ensures that bundle sizes are small, and only the currently viewed application template, form, and fields are part of the js bundle.

## Adding a new template

If you are building a new application template from scratch, add its type and import loader into `src/lib/templateLoaders.ts`. Then it can be used in the backend and frontend apps.

## Running unit tests

Run `ng test application-template-loader` to execute the unit tests via [Jest](https://jestjs.io).
