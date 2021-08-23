# CMS

## About

This is mostly a wrapper around the [contentful rest api](https://www.contentful.com/developers/docs/references/content-delivery-api/).

## Update content type into Contentful

When you are updating a field inside a content type in Contentful you will need to re-generate the `contentfulTypes.d.ts` file and commit it with your changes with the following command:

```bash
yarn nx run api:contentful-types
```

{% hint style="info" %}
We keep this file in the repository because in case contentful is down, the whole pipeline would fail and we won’t be able to build island.is. By keeping it in the repo, we ensure we can still build and we don't have to rely on an external service.
{% endhint %}

The `CONTENTFUL_ENVIRONMENT` environment variable is used to determine which Contentful environment is used to generate types.

## Generate models for a new content type

When creating a new content type in [contentful](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types), you can run a script that will generate models based on the content type's JSON from contentful.

```bash
yarn nx run api:contentType --id contentTypeId
```

The script take 3 arguments:

- #### `--id`

  _required, string_

  The "contentTypeId" that you want to create types/models of

- #### `--sys`

  _optional, string_

  **values: id, createdAt, updatedAt**

  A string of fields that you want to be added to the root model (separated by a comma)

- #### `--overwrite`

  _optional, boolean_

  **default: false**

  If you want to overwrite the existing models while generating content type types/models

<br />

{% hint style="warning" %}
You will need a `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` to run the script locally. Don't run the api at the same time, wait until the script is done to restart the api `yarn start api`.
{% endhint %}

## Code owners and maintainers

- [Kosmos & Kaos](https://github.com/orgs/island-is/teams/kosmos-kaos/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
