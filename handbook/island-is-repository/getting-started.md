# Getting started

## Setup

Before starting you will need an up-to-date NodeJS (`>= 12`) and [Docker](https://docs.docker.com/desktop/) installed.

## Usage

{% hint style="info" %}
There is many projects that can be build and run. You can find the list [here](https://github.com/island-is/island.is/blob/master/nx.json#L29-L368).
{% endhint %}

### Development server

For a dev server:

```bash
yarn start <project>
```

The app will automatically reload if you change any of the source files.

### Build

To build the project:

```bash
yarn build <project>
```

The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

To execute the unit tests via [Jest](https://jestjs.io):

```bash
yarn test <project>
```

To execute the unit tests affected by a change:

```bash
yarn affected:test
```

### Running end-to-end tests

To execute end-to-end tests via [Cypress](https://www.cypress.io):

```bash
yarn e2e <project>-e2e
```

To execute the end-to-end tests affected by a change:

```bash
yarn affected:e2e
```

### Understand your workspace

To see a diagram of the dependencies of your projects:

```bash
yarn nx dep-graph
```

### Making dev secrets available locally

Environment variables that should not be tracked but needed locally should be added to the `.env.secret` file.
Additionally if that same variable is also stored in AWS Parameter Store, the secret can be labeled with the `dev` label from `History` -> `Attach labels`.

All secrets labeled with the `dev` label can be fetched using `yarn env-secrets`.

### Fetch development secrets for your project

```bash
yarn env-secrets <project> [options]
```

**Example**:

```bash
yarn env-secrets gjafakort --reset
```
