# Rental Agreement

(application-templates-rental-agreement)

## About

[Introduction about the project and its purpose]

## URLs

- [Dev](https://rental-agreement-application-beta.dev01.devland.is/umsoknir/leigusamningur)
- [Staging](https://beta.staging01.devland.is)
- [Production](https://island.is)

## API

To run the api

```bash
yarn start api
```

To build the production bundle

```bash
yarn build api --prod
```

## Web

To run the dev server

```bash
yarn start web
```

### Localisation

{% hint style="warning" %}
When creating new text strings or making changes in the messages.ts file for the application, be sure to update Contentful by running this command:
`yarn nx run application-templates-rental-agreement:extract-strings`

For more info see [message extraction](../../../localization/README.md#message-extraction).
{% endhint %}

## Running unit tests

Run `nx test application-templates-rental-agreement` to execute the unit tests via [Vitest](https://vitest.dev/).

## Project owner

- [Húsnæðis- og mannvirkjastofnun](http://www.hms.is)

## Code owners and maintainers

- [Kolibri Kotid](https://github.com/orgs/island-is/teams/kolibri-kotid)
