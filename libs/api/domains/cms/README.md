# CMS Api

This is mostly a wrapper around the
[contentful rest api](https://www.contentful.com/developers/docs/references/content-delivery-api/)

## Workflow

When adding types/endpoints to the api:

- Create the the types in the
  [contentful content model](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types)
- Generate the typescript types for the contentful api response types with
  `yarn run nx codegen-cms-types api`.
  You will need a `CONTENTFUL_MANAGEMENT_TOKEN` environment variable (ask a
  colleague or create one
  [from here](https://app.contentful.com/spaces/8k0h54kbe6bj/api/cma_tokens))
- Create the graphql types in `src/lib/models` and a function to convert from
  the contentful type to the graphql type in `src/lib/mappers.ts`. To save time
  you can copy-paste the "json preview" from the contentul content type and
  pipe into `typegen.ts` (e.g. on mac os:
  `pbpaste | npx ts-node libs/api/domains/cms/typegen.ts`). You will need to
  make adjustments. It's not meant to be perfect (yet), only meant to save you
  some time.
- Generate the types from the graphql server with `yarn run codegen api`
