# island-ui-storybook

## Running locally

You can start the storybook locally by running:

```
yarn start island-ui-storybook
```

## Props issue

- Some components needs to use `import * as React from 'react'` to be able to renders props, interfaces and types inside the storybook.

  It's a temporary solution when using the `FC` interface to be able to resolve the component' props and display them in the documentation.

- Storybook uses by default `react-docgen` to generate props used by components for the documentation, see [here](https://github.com/storybookjs/storybook/blob/master/addons/docs/react/README.md#typescript-props-with-react-docgen).

  A [PR](https://github.com/reactjs/react-docgen/pull/352) has been open a long time ago to resolve imported interfaces and types but it hasn't been merged yet. At the moment, if an interface is imported from a deep-level file, it will show a `any` instead of the type.
