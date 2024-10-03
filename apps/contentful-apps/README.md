````markdown
# Contentful Apps

This Next.js project is designed to host Contentful Apps, which extend and customize Contentful's functionality.

## Running Locally

To start the Contentful Apps Next.js server locally, run the following command:

```bash
yarn start contentful-apps
```
````

Each app defines its own page within this project.

## Creating a Contentful App

To create a Contentful app, follow the Contentful documentation. Here is a sample app guide: <https://www.contentful.com/developers/docs/extensibility/app-framework/tutorial/>.

The primary difference is that we do not use the `create-contentful-app` script to bootstrap our Contentful app. Instead, you can add a new page inside the `/pages` directory.

## Testing Your Application

To test your application, switch to an unused environment in Contentful, install the App there, and try it out locally. Run the Next.js server locally and set the URL to:

```
http://localhost:4200/page-that-contains-your-app
```

Once the app is tested and developed locally, you can create a pull request. The Next.js server will then redeploy with your app.

## Deployment

We host the contentful-apps server on both development and production environments. For a stable user experience, we prefer using the production URLs inside Contentful, as the development environment tends to have more downtime. However, you can use the development URL while testing.

## Translation Namespace App

The Translation namespace content type uses the Contentful app located here: `/apps/contentful-apps/pages/fields/translation-namespace-json-field.tsx`.

It manages translations for namespaces in your application. This app works in conjunction with the [localization](/libs/localization/README.md) library.

```

```
