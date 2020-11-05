# Ísland.is web

The web consolidates content from multiple sources and displays it in a user friendly way.

## Getting started

You can start the web server by running `yarn start web`
This starts a server on `localhost:4200`

**You need to configure an api to fetch data from**

### Mock api

Just add `API_MOCKS=true` to your .env or .env.secret file.

You can tweak the mock data in `libs/api/mocks`.

### Local api

Run `yarn start api`. You must have env variables for the `cms` and `content-search` domains for the website to work.
