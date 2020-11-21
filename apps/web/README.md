# Web

## About

The web consolidates content from multiple sources and displays it in a user friendly way.

## URLs

- [Dev](https://beta.dev01.devland.is)
- [Staging](https://beta.staging01.devland.is)
- [Production](https://island.is)

## Getting started

You can start the web server by running:

```bash
yarn start web
```

This starts a server on `localhost:4200`

**You need to configure an api to fetch data from**

### Mock api

Just add `API_MOCKS=true` to your .env or .env.secret file.

You can tweak the mock data in `libs/api/mocks`.

### Local api

```bash
yarn start api
```

You must have env variables for the `cms` and `content-search` domains for the website to work.

## Code owners and maintainers

- [Kosmos & Kaos](https://github.com/orgs/island-is/teams/kosmos-kaos/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
