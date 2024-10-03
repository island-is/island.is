```markdown
# Island UI

## About

This library is part of the Ísland.is design system, providing a collection of guides, components, and utilities to facilitate faster and easier development of new projects.

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

To start Storybook locally, run the following command:

```bash
yarn start island-ui-storybook
```

### Known Issues with Props

- Some components require importing React using `import * as React from 'react'` to ensure props, interfaces, and types are rendered correctly within Storybook. This serves as a temporary workaround for resolving component props when using the `FC` interface and displaying them in the documentation.

- By default, Storybook uses `react-docgen` to generate component prop documentation. (For more details, see [here](https://github.com/storybookjs/storybook/blob/master/addons/docs/react/README.md#typescript-props-with-react-docgen)). A [pull request](https://github.com/reactjs/react-docgen/pull/352) has been open for some time to address issues with imported interfaces and types, but it has not yet been merged. Currently, if an interface is imported from a deeply nested file, it will display as `any` instead of the correct type.

## Theme

The library includes shared styles that are applied to all Ísland.is projects.

## Utils

This library includes utility functions shared across multiple projects, specifically related to the UI library.

## Code Owners and Maintainers

- [Island UI Team](https://github.com/orgs/island-is/teams/island-ui/members)
```