# Contentful Apps

This Next.js project is intended to host Contentful Apps that we use to extend and customize the functionality of Contentful.

To start the Contentful Apps Next.js server locally run the following command:
`yarn start contentful-apps`

Each app defines it's own page inside this project.

To create a Contentful app you can mostly follow Contentful documentation, here's an example app guide: https://www.contentful.com/developers/docs/extensibility/app-framework/tutorial/

The only change is that we aren't using the `create-contentful-app` script to bootstrap our Contentful app but instead you can simply add a new page inside the `/pages` folder.

To test out your application you can change over to an unused environment in Contentful, install the App there and try it out locally by running the Next.js server locally and setting the url to: `http://localhost:4200/page-that-contains-your-app`

Once the app has been tested and developed locally then you can create a Pull request and the Next.js server will be redeployed with your app in the next dev build.
