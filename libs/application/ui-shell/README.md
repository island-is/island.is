````markdown
# Application UI Shell

This library contains the UI components for rendering application forms. It includes built-in support for features such as a multi-step form experience, progress indicators, field rendering, custom field rendering, answer storage, and more.

## Technology

This library utilizes [react-hook-form](https://react-hook-form.com/) for form validation and general performance enhancements.

## How to Create a New Field

New fields can be categorized as:

- **Reusable Fields**: These should be added to the `application-ui-fields` library.
- **Custom Fields for Specific Applications**: These should be added to the library containing the respective application template and exported under `getFields`.

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run the following command:

```bash
yarn nx test application-ui-shell
```
````

## Running Lint

To perform linting, use the command below:

```bash
yarn nx lint application-ui-shell
```

```

```
