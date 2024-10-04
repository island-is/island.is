# Contentful Apps

This Next.js project hosts Contentful Apps for extending and customizing Contentful.

## Starting the Server Locally

To start the Next.js server locally, run:

```bash
yarn start contentful-apps
```

Each app defines its own page within this project.

## Creating a Contentful App

To create a Contentful app, follow [Contentful documentation](https://www.contentful.com/developers/docs/extensibility/app-framework/tutorial/). Note that we do not use the `create-contentful-app` script. Instead, add a new page in the `/pages` folder.

## Testing Your App

To test your app:

1. Switch to an unused Contentful environment.
2. Install the App and run the Next.js server locally.
3. Set the URL to `http://localhost:4200/page-that-contains-your-app`.

After testing locally, create a pull request. The Next.js server will redeploy with your app.

We host the contentful-apps server in both dev and prod environments. Use prod URLs inside Contentful for stability, but switch to dev if testing.

## Translation Namespace App

The Translation Namespace content type uses the Contentful app located at `/apps/contentful-apps/pages/fields/translation-namespace-json-field.tsx`.

This app manages translations for application namespaces, in conjunction with the [localization library](/libs/localization/README.md).
