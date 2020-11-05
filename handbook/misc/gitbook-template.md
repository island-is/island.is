# Template

{% hint style="info" %}
If you project is composed of an API, backend and web part for example, make sure to create a README.md for each of them.
{% endhint %}

For composed project:

Root readme:

```md
# Project name

## About

[Quick introduction about the project and its purpose]

## URLs

{% hint style="info" %}

- Dev: [beta.dev01.devland.is/](https://beta.dev01.devland.is)
- Staging: [beta.staging01.devland.is](https://beta.staging01.devland.is)
- Production: [island.is](https://island.is)
  {% endhint %}

## Services

- API: Run the api service
- Web: Consume the api and display the needed data

## Owner

[Company or individuals]

## Maintainers

[List of individuals]

- [Jérémy Barbet — @jeremybarbet](https://github.com/jeremybarbet)
```

Folder readme:

````md
# Service name

## Getting started

To start the dev server

```bash
yarn start <project>
```
````

For a single project:

````md
# Project name

## About

[Quick introduction about the project and its purpose]

## Getting started

To start the dev server

```bash
yarn start <project>
```

## URLs

{% hint style="info" %}

- Dev: [beta.dev01.devland.is/](https://beta.dev01.devland.is)
- Staging: [beta.staging01.devland.is](https://beta.staging01.devland.is)
- Production: [island.is](https://island.is)
  {% endhint %}

## Owner

[Company or individuals]

## Maintainers

[List of individuals]

- [Jérémy Barbet — @jeremybarbet](https://github.com/jeremybarbet)
````
