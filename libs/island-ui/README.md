# Island UI

## About

This library is part of the Ísland.is design system and is a collection of guides, components and units to help you build new projects faster and easier.

## URLs

- [Dev](https://ui.dev01.devland.is)
- [Staging](https://ui.staging01.devland.is)
- [Production](https://ui.devland.is)

## Core

The lib contains all the components that are reused across most of the projects. You can see the whole list by visiting the UI library with the links above.

## Fonts

Ísland.is is using IBM Plex Sans as font, it is uses on every project and shared here in the Island UI lib.

## Storybook

The [Storybook](https://storybook.js.org) is used to gather all the core components and create an interactive documentation to explore all of it.

You can start the storybook locally by running:

```bash
yarn start island-ui-storybook
```

### Props issue

- Some components needs to use `import * as React from 'react'` to be able to renders props, interfaces and types inside the storybook. It's a temporary solution when using the `FC` interface to be able to resolve the component' props and display them in the documentation.

- Storybook uses by default `react-docgen` to generate props used by components for the documentation, see [here](https://github.com/storybookjs/storybook/blob/master/addons/docs/react/README.md#typescript-props-with-react-docgen). A [PR](https://github.com/reactjs/react-docgen/pull/352) has been open a long time ago to resolve imported interfaces and types but it hasn't been merged yet. At the moment, if an interface is imported from a deep-level file, it will show a `any` instead of the type.

## Theme

This lib contains all the shared styles that apply to every Ísland.is projects.

## Utils

This lib contains utils that are shared across multiple projects and related to the UI library.

## Code owners and maintainers

- [Island UI](https://github.com/orgs/island-is/teams/island-ui/members)
