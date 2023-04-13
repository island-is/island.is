# Ísland.is

This [GitHub organization](https://github.com/island-is) is the center of development for digital government services on `island.is`. It is managed by the [Digital Iceland](https://stafraent.island.is/) department inside the [Ministry of Finance and Economic Affairs](https://www.government.is/ministries/ministry-of-finance-and-economic-affairs/).

These solutions are [FOSS](https://en.wikipedia.org/wiki/Free_and_open-source_software) and open to contributions, but most development will be performed by teams that win tenders to develop new functionality for Digital Iceland.

The repository is a [monorepo](../technical-overview/monorepo.md) that has multiple apps (something that can be built and run) and libraries (which other apps and libraries can depend on). All custom-written services are also stored there.

## GitBook

The apps and libraries documentation and our handbook are hosted on [GitBook](https://www.gitbook.com) and is publicly available at [docs.devland.is](https://docs.devland.is).

## Storybook

The Ísland.is design system is developed and showcased using [Storybook](https://storybook.js.org) and is publicly available at [ui.devland.is](https://ui.devland.is).

## Reading material

To get more technical information about the project please make sure to read this [overview](handbook/technical-overview/README.md).

## External contributors

If you want to contribute to the repository, please make sure to follow [this guide](handbook/repository/external-contribute.md).

## Prerequisites

- You have Node installed `^14.17.0` and Yarn at `^1.22.0`.
- You have [Docker](https://docs.docker.com/desktop/) installed.
- You have [direnv](https://direnv.net/) installed.
- You have [Java](https://www.java.com/en/download/manual.jsp) `>= 1.8` installed (for schema generation).
- Run `yarn` to install the dependencies.

{% hint style="info" %}
If you are running on Windows we recommend using [Docker and WSL2](https://docs.docker.com/desktop/windows/wsl/)
{% endhint %}

### For fetching secrets

- You have [AWS command line tools v2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed.
  - `brew install awscli`
- You have [jq](https://stedolan.github.io/jq/) installed.
  - `brew install jq`

## Usage

There are many projects that can be built and run. [Click here to see the full list](https://github.com/island-is/island.is/blob/main/nx.json).

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

### Running end-to-end tests (deprecated)
**Note: We no longer encourage writing these tests, please consider writing System E2E test (see below)**

To execute end-to-end tests via [Cypress](https://www.cypress.io):

```bash
yarn e2e <project>-e2e
```

To execute the end-to-end tests affected by a change:

```bash
yarn affected:e2e
```

### Running System E2E tests

To execute end-to-end tests via [Playwright](https://playwright.dev), run one or more files. The way to specify these, is similar as described in the docs [here](https://playwright.dev/docs/running-tests). 

```bash
yarn system-e2e myfile.spec.ts
```

To see the execution of your tests in the browser:
```bash
yarn system-e2e myfile.spec.ts --headed
```
To run in debug mode:
```bash
yarn system-e2e myfile.spec.ts --debug
```

For a more detailed guide on writing System E2E tests, please see this [internal Notion page](https://www.notion.so/System-E2E-testing-workshop-29c089c182844933b992015c4ef24791?pvs=4).


### Running System E2E tests with mocks

Running System E2E tests which rely on mocking external dependencies is the same, except the local development environment must support wire-mocking(mountebank). To prepare such a local environment it is best to use the command that discovers the dependencies of the component(s) you will be testing and prepares configuration for running them. To get a list of the services you might need to run as well as the mountebank configuration:

```bash
yarn infra render-local-env  --service=<service-name-1> ... --service=<service-name-N> 
```

For example, if you are running `application-system-form` you would run
```bash
yarn infra render-local-env  --service=application-system-form
```
And you would get something similar to this:
```bash
{
  services: {
    'application-system-form': '(source ./.env.application-system-form && yarn start application-system-form)',
    'services-documents': '(source ./.env.services-documents && yarn start services-documents)',
    'endorsement-system-api': '(source ./.env.endorsement-system-api && yarn start endorsement-system-api)',
    'application-system-api': '(source ./.env.application-system-api && yarn start application-system-api)',
    'icelandic-names-registry-backend': '(source ./.env.icelandic-names-registry-backend && yarn start icelandic-names-registry-backend)',
    'air-discount-scheme-backend': '(source ./.env.air-discount-scheme-backend && yarn start air-discount-scheme-backend)',
    'service-portal-api': '(source ./.env.services-user-profile && yarn start services-user-profile)',
    'services-sessions': '(source ./.env.services-sessions && yarn start services-sessions)',
    api: '(source ./.env.api && yarn start api)'
  },
  mocks: 'docker run -it --rm -p 2525:2525 -p 9388:9388 -p 9372:9372 -v ./infra/mountebank-imposter-config.json:/app/default.json:z docker.io/bbyars/mountebank:2.8.1 start --configfile=/app/default.json'
}
```
Each service will get the secrets it is configured to use, still you will need to run local DB setup for the services you are running - dev-init, etc. Additionally, any local dev proxies will also need to be run manually.

It is not necessary to run all the dependencies/services, only the one that will be actually used.

Make sure to have an [AWS session](handbook/repository/aws-secrets.md#using-aws-session) loaded in the shell, so the script is able to retrieve the secrets from AWS Dev environment.

### Schemas

If your project is generating schemas files from an OpenAPI, Codegen or is an API, check out [this documentation](handbook/repository/schemas.md).

### Understand your workspace

To see a diagram of the dependencies of your projects:

```bash
yarn nx dep-graph
```

### AWS Secrets

A dedicated documentation about fetching shared development secrets or creating new secrets, using AWS secrets is available [here](handbook/repository/aws-secrets.md).

### Running proxy against development service

If you have AWS access to our development account, you can connect to development databases and services using a proxy. We've set up a proxy and connection helpers for our development Postgres, Elastic Search, Redis and X-Road Security Server.

To do so, you can run for example:

```bash
./scripts/run-db-proxy.sh
```

It will try to get your AWS credentials from your environment variables and from your `~/.aws/credentials` file. You can find more instructions [here](handbook/repository/aws-secrets.md#using-aws-session).

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
