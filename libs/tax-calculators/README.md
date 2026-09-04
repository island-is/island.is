# Tax Calculators

Shared configuration contract for the Contentful `calculator` content type.

The Zod schema in this library is the single source of truth for the `configJson`
field: `apps/contentful-apps` validates against it before saving, and `apps/web`
parses against it before rendering the calculator form.

## Running unit tests

Run `nx test tax-calculators` to execute the unit tests via [Jest](https://jestjs.io).
