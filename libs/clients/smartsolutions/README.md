# Smart Solutions

This library was generated with [Nx](https://nx.dev).

## Usage

To use the module, you have to import it and call the registerAsync function. This enables us to leverage the ConfigModule to inject the proper parameters, depending on the callers configuration.

The calling module must supply a factory function that provides the configuration object when called. This allows us to both use the module, and create the configuration, dynamically.

## Running unit tests

Run `nx test clients-smartsolutions` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint clients-smartsolutions` to execute the lint via [ESLint](https://eslint.org/).
