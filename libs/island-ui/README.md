````markdown
# Island UI

## About

Island UI is a library within the Ísland.is design system, providing a collection of guides, components, and utilities to streamline the development of new projects.

## Environments

- **Development Environment:**  
  Access at [ui.dev01.devland.is](https://ui.dev01.devland.is)
- **Staging Environment:**  
  Access at [ui.staging01.devland.is](https://ui.staging01.devland.is)
- **Production Environment:**  
  Access at [ui.dev.land.is](https://ui.dev.land.is)

## Core

The library contains components reused across most projects. Explore the complete component list by visiting the UI library through the links in the **Environments** section.

## Fonts

Ísland.is utilizes IBM Plex Sans as its primary font, consistently used across all projects and available within the Island UI library.

## Storybook

[Storybook](https://storybook.js.org) consolidates all core components, providing interactive documentation for component exploration.

To start Storybook locally, execute:

```bash
yarn start island-ui-storybook
```
````

### Known Issues with Props

- Some components require importing React with `import * as React from 'react'` for correct rendering of props, interfaces, and types within Storybook. This temporary workaround resolves component props when using the `FC` interface, displaying them in documentation.

- By default, Storybook uses `react-docgen` for generating prop documentation. For more information, see the [React Docgen Documentation](https://github.com/storybookjs/storybook/blob/main/addons/docs/react/README.md#typescript-props-with-react-docgen). A [pull request](https://github.com/reactjs/react-docgen/pull/352) has been open to address issues with imported interfaces and types, which has not yet been merged. Currently, if an interface is imported from a deeply nested file, it may display as `any` instead of the correct type.

## Theme

The library includes shared styles applicable to all Ísland.is projects.

## Utils

The library incorporates utility functions shared across multiple projects, specifically related to the UI library.

## Code Owners and Maintainers

- [Island UI Team](https://github.com/orgs/island-is/teams/island-ui/members)

```

```
