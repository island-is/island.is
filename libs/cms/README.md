## CMS

### About

This project serves primarily as a wrapper around the [Contentful REST API](https://www.contentful.com/developers/docs/references/content-delivery-api/).

### Update Content Type in Contentful

When updating a field within a content type in Contentful, you need to regenerate the `contentfulTypes.d.ts` file. Execute the following command and commit your changes:

```bash
yarn nx run api:contentful-types
```

> **Note:**  
> We keep the `contentfulTypes.d.ts` file in the repository. This ensures that even if Contentful is down, the pipeline won’t fail, and we can still build our application without relying on an external service.

The `CONTENTFUL_ENVIRONMENT` environment variable determines which Contentful environment is used for generating types.

### Generate Models for a New Content Type

When creating a new content type in [Contentful](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types), a script is available for generating models based on the content type's JSON from Contentful.

```bash
yarn nx run api:contentType --id contentTypeId
```

The script takes the following arguments:

- #### `--id`

  **Type:** _string_ **(required)**

  The `contentTypeId` that you want to create types/models for.

- #### `--sys`

  **Type:** _string_ **(optional)**

  **Values:** `id`, `createdAt`, `updatedAt`

  A comma-separated string of system fields to include in the root model.

- #### `--overwrite`

  **Type:** _boolean_ **(optional)**

  **Default:** `false`

  Set to `true` to overwrite existing models while generating content type types/models.

> **Warning:**  
> You need a `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` to run the script locally. Ensure the API is not running simultaneously; wait for the script to finish before restarting the API with `yarn start api`.

### Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
