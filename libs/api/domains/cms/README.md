# CMS Api

This is mostly a wrapper around the
[contentful rest api](https://www.contentful.com/developers/docs/references/content-delivery-api/)

## Workflow

When adding new types/endpoints to the api:

- Create the contentType in the [contentful content model](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types)

- Run the following script

  You will need a `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` [secret](https://app.contentful.com/spaces/8k0h54kbe6bj/api/cma_tokens)

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
