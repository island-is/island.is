# Island

## Working in the monorepo

### Development server

Run `yarn start web` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Build

Run `yarn build web` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `yarn test web` to execute the unit tests via [Jest](https://jestjs.io).

Run `yarn affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `yarn e2e web-e2e` to execute end-to-end tests via [Cypress](https://www.cypress.io).

Run `yarn affected:e2e` to execute the end-to-end tests affected by a change.

### Generate a component

Run `yarn generate @nrwl/react:component MyComponent --project=island-ui-core` to generate a new component in island-ui-core.

### Generate an application

Run `yarn generate @nrwl/react:app my-app` to generate a simple React application.

To get a React application with server-side-rendering, we recommend using Next.JS: `yarn generate @nrwl/next:app my-app`

To create an API, you can get started with Node.JS like this: `yarn generate @nrwl/node:app my-api`

### Generate a library

Run `yarn generate @nrwl/react:lib my-lib --linter eslint` to generate a React library.

To create a JS library that can be used on the server as well: `yarn generate @nrwl/node:lib my-lib`

Libraries are sharable across libraries and applications. They can be imported from `@island.is/my-lib`.

Applications and libraries can be structured in a hierarchy using subfolders:

```
yarn generate @nrwl/node:lib common/my-lib
```

### Migrations

Using the `sequelize-cli` we support version controlled migrations that keep track of changes to the database.

#### Generate a migrations

Run `yarn nx run <project>:migrate/generate`

#### Migrating

Run `yarn nx run <project>:migrate`

### Understand your workspace

Run `yarn nx dep-graph` to see a diagram of the dependencies of your projects.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
