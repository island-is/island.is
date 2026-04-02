# Ísland.is

This [GitHub organization](https://github.com/island-is) is the center of development for digital government services on `island.is`. It is managed by the [Digital Iceland](https://stafraent.island.is/) department inside the [Ministry of Finance and Economic Affairs](https://www.government.is/ministries/ministry-of-finance-and-economic-affairs/).

These solutions are [FOSS](https://en.wikipedia.org/wiki/Free_and_open-source_software) and open to contributions, but most development will be performed by teams that win tenders to develop new functionality for Digital Iceland.

The repository is a [monorepo](https://docs.devland.is/technical-overview/monorepo) that has multiple apps (something that can be built and run) and libraries (which other apps and libraries can depend on). All custom-written services are also stored there.

## Storybook

The Ísland.is design system is developed and showcased using [Storybook](https://storybook.js.org) and is publicly available at [ui.devland.is](https://ui.devland.is).

## Reading material

To get more technical information about the project please make sure to read this [overview](https://docs.devland.is/technical-overview/technical-overview).

## New developers

Make sure to follow [this guide](https://docs.devland.is/development/getting-started) to get up and running.

## External contributors

If you want to contribute to the repository, please make sure to follow [this guide](https://docs.devland.is/repository/external-contribute).

## Prerequisites

- You have Node installed `^24` and Yarn at `^3.2.3`.
- You have [Docker](https://docs.docker.com/desktop/) installed.
- You have [direnv](https://direnv.net/) installed.
- You have [Java](https://www.java.com/en/download/manual.jsp) `>= 1.8` installed (for schema generation).
- You have [CMake](https://cmake.org/) installed.
- You have [gcc](https://gcc.gnu.org/) installed (Linux MacOs).
- You have [g++](https://gcc.gnu.org/) installed (Linux MacOs).

> [!NOTE]
> If you are running on Windows we recommend using [Docker and WSL2](https://docs.docker.com/desktop/windows/wsl/)

### For fetching secrets

- You have [AWS command line tools v2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed.
  - `brew install awscli`
- You have [jq](https://stedolan.github.io/jq/) installed.
  - `brew install jq`

## Devcontainers

Devcontainers provide a consistent development environment using Docker containers, ensuring all developers have the same setup.

### Setup

1. **Requirements**:

   - Docker
   - Visual Studio Code (VS Code) with the Remote - Containers extension

2. **Using Devcontainers**:
   - Refer to the [Devcontainers documentation](https://code.visualstudio.com/docs/remote/containers) for detailed instructions on setting up and using Devcontainers with VS Code.

### devcontainers-cli Tool

`devcontainers-cli` offers command-line management of devcontainers.

1. **Installation and Usage**:
   - Refer to the [devcontainers-cli documentation](https://github.com/devcontainers/cli) for detailed instructions on installation and usage.

Using Devcontainers and the `devcontainers-cli` tool ensures a uniform development environment, reducing setup time and discrepancies between machines.

## Setting up Digital Iceland

There are many projects that can be built and run. [Click here to see the full list](https://github.com/island-is/island.is/blob/main/nx.json).

### Fresh start/changing branches

Run on whenever you check out a branch:

```bash
yarn install
(cd infra/ && yarn install)
yarn codegen
```

When you clone the repo for the first time, and whenever you change branches, you need to update your dependencies to match your current branch using `yarn install`.
In addition, API schemas change frequently, so you will also need to run codegen using `yarn codegen`.

If you want run codegen on every install you can set the environment variable `RUN_CODEGEN_ON_INSTALL=true`.
Note that this will run codegen when rebuilding the workspace in the post-install phase, with no output, so the `install` script seems to hang.

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

### Formatting your code

You need to format all files to follow NX code conventions. To do so run:

```bash
yarn nx format:write
```

### Running lint checks

We have many lint rules to help having a unify code all over the project. To execute the linting:

```bash
yarn lint <project>
```

> Running lint locally is slow and fill up heap memory. This is related to Typescript compilation and NX lint builder being slow. As a result you might get a `JavaScript heap out of memory`. NX is working on fixing this for an upcoming update. In the meantime you can do `NODE_OPTIONS=“--max-old-space-size=4096” yarn lint <project>` to raise the memory limit.

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

### Codegen

If your project is generating an API schema or API client using OpenAPI or GraphQL, check out [this documentation](https://docs.devland.is/repository/codegen).

### Understand your workspace

To see a diagram of the dependencies of your projects:

```bash
yarn nx dep-graph
```

### AWS Secrets

A dedicated documentation about fetching shared development secrets or creating new secrets, using AWS secrets is available [here](https://docs.devland.is/repository/aws-secrets).

### Running proxy against development service

If you have AWS access to our development account, you can connect to development databases and services using a proxy. We've set up a proxy and connection helpers for our development Postgres, Elastic Search, Redis and X-Road Security Server.

To do so, you can run for example:

```bash
./scripts/run-db-proxy.sh
```

It will try to get your AWS credentials from your environment variables and from your `~/.aws/credentials` file. You can find more instructions [here](https://docs.devland.is/repository/aws-secrets#using-aws-session).

{% hint style="info" %}
If you want to run your app against one of this service (e.g. `db`), you may need to edit your app environment or sequelize config to pass the proxy credentials.
{% endhint %}

{% hint style="warning" %}
The following services will run on the associated ports: `db:5432`, `es:9200`, `redis:6379`, `xroad:80`. If you have docker running on theses ports or any others services you will need to stop them in order to run the proxies.
{% endhint %}

### Environment variables with static websites

To be able to access environment variables in purely static projects, you need to do the following:

1. In the index.html file, add `<!-- environment placeholder -->`.
2. Use the `getStaticEnv` function from the `@island.is/shared/utils`
   library to fetch your environment variables.
3. Prefix your environment variables with `SI_PUBLIC_`, for example
   `SI_PUBLIC_MY_VARIABLE`.

NOTE: This is only to get environment variables when running in kubernetes, not for when running locally. So you should only use `getStaticEnv` in your `environment.prod.ts` file.

What happens behind the scenes is that static projects have a bash script that runs when the docker container starts up. This script searches for references of `SI_PUBLIC_*` in the code and tries to find a match in the environment. It then puts all the matches inside the index.html which is then served to the client.
