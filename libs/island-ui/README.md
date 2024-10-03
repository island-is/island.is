```markdown
# Island UI

## About

Island UI is a library that is part of the Ísland.is design system. It provides a collection of guides, components, and utilities designed to facilitate faster and easier development of new projects.

## Environments

- **Development Environment:**  
  Access it at [ui.dev01.devland.is](https://ui.dev01.devland.is)
- **Staging Environment:**  
  Access it at [ui.staging01.devland.is](https://ui.staging01.devland.is)
- **Production Environment:**  
  Access it at [ui.dev.land.is](https://ui.dev.land.is)

## Core

The library contains components reused across most projects. You can explore the entire list of components by visiting the UI library through the links provided in the **Environments** section.

## Fonts

Ísland.is uses IBM Plex Sans as its primary font, consistently applied across all projects and available within the Island UI library.

## Storybook

[Storybook](https://storybook.js.org) is used to consolidate all core components and to provide interactive documentation for component exploration.

To start Storybook locally, execute the command:

```bash
yarn start island-ui-storybook
```

### Known Issues with Props

- Some components require importing React using `import * as React from 'react'` to ensure correct rendering of props, interfaces, and types within Storybook. This is a temporary workaround for resolving component props when using the `FC` interface and displaying them in documentation.

- By default, Storybook uses `react-docgen` for generating prop documentation. For more details, see the [React Docgen Documentation](https://github.com/storybookjs/storybook/blob/main/addons/docs/react/README.md#typescript-props-with-react-docgen). A [pull request](https://github.com/reactjs/react-docgen/pull/352) has been open for some time to address issues with imported interfaces and types, and it has not yet been merged. Currently, if an interface is imported from a deeply nested file, it will display as `any` instead of the correct type.

## Theme

The library includes shared styles applicable to all Ísland.is projects.

## Utils

The library includes utility functions shared across multiple projects, specifically related to the UI library.

## Code Owners and Maintainers

- [Island UI Team](https://github.com/orgs/island-is/teams/island-ui/members)
```