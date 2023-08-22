# Application UI Shell

This library contains the UI for rendering application forms. It has built in support for a multi-step form experience, progress indicators, field rendering, custom field rendering, storing answers, and more.

## Technology

This library uses [react-hook-form](https://react-hook-form.com/) for providing form validation, and general performance improvements.

## How to create a new field

New fields are either:

- reusable and should be added to the `application-ui-fields` library
- custom for a specific application. Then it should be added to the library containing said application template and exported under `getFields`.

## Running unit tests

Run `yarn nx test application-ui-shell` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `yarn nx lint application-ui-shell` to lint
