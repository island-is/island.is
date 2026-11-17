# api/domains/form-system

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test api/domains/form-system` to execute the unit tests via [Jest](https://jestjs.io).

To generate the schema run yarn nx run api:codegen/backend-schema

`updateFormSystemOrganizationLogo` saves an HTTPS Contentful image URL to the
organization's `logo.is` field, preserving `logo.en`. Organization owners and
form-system administrators can update the logo.
The mutation requires the form-system scope.
Logo defaults are `{ is: '', en: '' }`. Enabling PDF downloads refreshes
`logo.is` from Contentful, resetting it to `''` when no logo is returned.
Fetch failures leave the stored logo unchanged.
