# Based on create Contentful app

https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/

# Deployment

This is a Contentful extension. It is hosted by Contentful as long as its compilation remains under 512 kb. After that point the extension will have to be hosted in a similar fashion to the `contentful-translation-extension` found in the Monorepo.

## Configure and environment variables

You will need to configure your environment variables for Contentful.
This can easily be done with `npm run login` and then `npm run configure`. Make sure you select the correct space and environment.
You will need to have login access to Contentful to do this.

After that, you will have to set the `MIDEIND_TOKEN` which allows for connecting to their API.
The build step will detect a `.env` file at the root directory.

```bash
# .env
MIDEIND_TOKEN=ABCDEFGHIJKLMNOPQRSTUVXYZ.123456789
```

## Deployment to Contentful

After having run `npm run configure` you can deploy the extension with `npm run deploy`.
