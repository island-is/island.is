# CMS

## About

This is primarily a wrapper around the [Contentful REST API](https://www.contentful.com/developers/docs/references/content-delivery-api/).

## Update Content Type in Contentful

When updating a field in a Contentful content type, regenerate the `contentfulTypes.d.ts` file and commit your changes using the command:

```bash
yarn nx run api:contentful-types
```

> **Note:** The file is kept in the repository to ensure builds can still occur even if Contentful is down, avoiding reliance on external services.

The `CONTENTFUL_ENVIRONMENT` variable specifies the Contentful environment for type generation.

## Generate Models for a New Content Type

To generate models for a new content type in Contentful, run the following script:

```bash
yarn nx run api:contentType --id contentTypeId
```

### Script Arguments:

- **`--id`** (required): The "contentTypeId" for which to create types/models.
- **`--sys`** (optional): Fields to add to the root model (comma-separated). Options: id, createdAt, updatedAt.
- **`--overwrite`** (optional, default `false`): Overwrites existing models during generation.

> **Warning:** A `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` is required to run the script locally. Ensure the API is not running simultaneously to avoid conflicts. Restart the API with `yarn start api` after the script completes.

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)