## ⚠️ Disclaimer! The @island.is/ui library is not officially release and is only available as an alpha version at the moment. We are going to improve it and provide a better support in the future. Proceed with cautious, things might break.

# Ísland UI

Ísland UI is powered by [React](https://reactjs.org/) for building the components and [Treat](https://github.com/seek-oss/treat) to handle the styles.

## Storybook

You can see all the components available and their use cases [here](https://ui.devland.is/).

## Getting started

```bash
yarn add @islandis/ui -E
```

## Peer dependencies

A couple of dependencies are required to use the UI library. The following are the `peerDependencies` needed:

```json
"peerDependencies": {
  "@rehooks/component-size": "^1.0.3",
  "animejs": "^3.2.1",
  "classnames": "^2.2.6",
  "date-fns": "^2.14.0",
  "downshift": "^5.4.3",
  "hypher": "^0.2.5",
  "lodash": "^4.17.20",
  "markdown-to-jsx": "^7.1.1",
  "react": "^17.0.1",
  "react-animate-height": "^2.0.21",
  "react-datepicker": "^3.1.3",
  "react-dropzone": "^11.0.3",
  "react-keyed-flatten-children": "^1.2.0",
  "react-select": "^3.1.0",
  "react-toastify": "^6.0.8",
  "react-use": "^15.3.3",
  "reakit": "^1.0.2",
  "treat": "1.6.0"
}
```

### Treat files

If you need to import theme or utils from `@island.is/ui`, you will need to use the following import.

```typescript
import { theme } from '@island.is/ui/treat'
```

### Usage with `Next.js`

The alpha version of the library is shipped as Typescript. You will need to transpile it and add the Treat plugin to handle `.treat.ts` files. An example repository is available [here](https://github.com/island-is/island-ui-next-example).

### Usage with `Create React App`

As stated above for Next.js, you will also need to transpile the library for Create React App. We need to eject the setup to access the webpack config and be able to configure Treat and transpile the TypeScript library. An example repository is available [here](https://github.com/island-is/island-ui-cra-example).
