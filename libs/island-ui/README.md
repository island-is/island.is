# Island UI

## About

This library is part of the Ísland.is design system and provides a collection of guides, components, and utilities to facilitate faster and easier development of new projects.

## URLs

- [Development Environment](https://ui.dev01.devland.is)
- [Staging Environment](https://ui.staging01.devland.is)
- [Production Environment](https://ui.devland.is)

## Core

This library contains components reused across most projects. You can view the entire list by visiting the UI library through the links above.

## Fonts

Ísland.is uses IBM Plex Sans as its primary font, applied consistently across all projects and provided within the Island UI library.

## Storybook

[Storybook](https://storybook.js.org) is employed to consolidate all core components and offer interactive documentation for exploration.

To start Storybook locally, run:

```bash
yarn start island-ui-storybook
```

### Props Issue

- Some components require importing React using `import * as React from 'react'` to properly render props, interfaces, and types within Storybook. This is a temporary workaround for using the `FC` interface to resolve component props and display them in the documentation.

- By default, Storybook employs `react-docgen` to generate component prop documentation (see [here](https://github.com/storybookjs/storybook/blob/master/addons/docs/react/README.md#typescript-props-with-react-docgen)). A [pull request](https://github.com/reactjs/react-docgen/pull/352) has been open for some time to address issues with imported interfaces and types, but it has not yet been merged. Currently, if an interface is imported from a deeply nested file, it will display as `any` instead of the correct type.

## Theme

The library contains shared styles that are applied to all Ísland.is projects.

## Utils

This library includes utility functions shared across multiple projects, specifically related to the UI library.

## Code Owners and Maintainers

- [Island UI Team](https://github.com/orgs/island-is/teams/island-ui/members)