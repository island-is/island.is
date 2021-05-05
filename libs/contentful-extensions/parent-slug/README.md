# Contentful parent-slug extension

This is the Contentful extension that makes sure that parent-slug relationships are preserved through content changes.

## Deployment

This extension is hosted by Contentful as long as its compilation remains under 512 KB. After that point the extension will have to be hosted in a similar fashion to the [translation](../translation/README.md) extension.

### Configuration and environment variables

You will need to configure your environment variables for Contentful.
This can be done with `yarn run login` and then `yarn run configure`. Make sure you select the correct space and environment.
You will need to have login access to Contentful to do this.

### Deployment to Contentful

After having run `yarn run configure` you can deploy the extension with `yarn run deploy`. This will publish a new version on Contentful. Make sure the extension name matches the expected name in the affected content models.
