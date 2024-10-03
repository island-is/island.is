```markdown
# Application Template Loader

The primary goal of this library is to lazily load application templates, data providers, forms, and fields. This approach helps reduce bundle sizes by ensuring that only the currently viewed application templates, forms, and fields are included in the JavaScript bundle.

## Adding a New Template

To create a new application template from scratch, add its type and import loader to `src/lib/templateLoaders.ts`. Once added, it can be utilized in both the backend and frontend applications.

## Running Unit Tests

Execute unit tests by running `ng test application-template-loader` using [Jest](https://jestjs.io).
```