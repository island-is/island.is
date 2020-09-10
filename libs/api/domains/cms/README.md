# CMS Api

This is mostly a wrapper around the
[contentful rest api](https://www.contentful.com/developers/docs/references/content-delivery-api/)

## Prerequisites

- You will need a `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN`. You can ask someone that may have it or [generate in contentful](https://app.contentful.com/spaces/8k0h54kbe6bj/api/cma_tokens)

- Don't run the api at the same time, it might creates a wrong `api.graphql`, when until the script is done to restart the api.

## Workflow

When adding new types/endpoints to the api:

- Create the contentType in the [contentful content model](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types)

- Run the following script

  ```bash
  yarn nx run api:contentType --args="--id=contentTypeId --sys=id --overwrite=false"
  ```

  The script take 3 arguments:

  - #### `--id`

    _required, string_

    The "contentTypeId" that you want to create types/models of

  - #### `--sys`

    _optional, string_

    **values: id, createdAt, updatedAt**

    A string of fields that you want to be added to each models (separated by a comma)

  - #### `--overwrite`

    _optional, boolean_

    **default: false**

    If you want to overwrite the existing models while generating contentType types/models

  The script will do the following steps:

  - Generate new contentful types using `contentful-typescript-codegen`
  - Create the models from the contentTypes and its linkContentTypes `contentType.ts`
  - Re-generate the types for the graphql api `yarn nx run api:codegen`

## Definition types

If you add a new field inside a contentType in Contentful you will need to run theses different steps to generate up-to-date definitions files

- `apps/api/src/api.graphql` is generated automatically when running the [local api server](https://github.com/island-is/island.is/blob/71c15cbc2c8276f8d635d4c2337d14fa845bfbe1/apps/api/src/app/app.module.ts#L18)

- `libs/api/domains/cms/src/lib/generated/contentfulTypes.d.ts` is generated within `yarn nx run api:contentType` script. It can also be run by itself with `yarn nx run api:contentful-types`

- `libs/api/schema/src/lib/schema.d.ts` is generated when running `yarn api:codegen`

- `apps/web/graphql/schema.ts` is generated when running `yarn web:codegen`
