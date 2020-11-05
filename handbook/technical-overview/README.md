# Overview

Hi there, you are probably new to the project. Here you can find a quick overview of what you can expect and what is expected from you as a contributor.

## General info

[island.is](https://github.com/island-is/island.is) is the center of development for digital government services on `island.is`. It is managed by the [Digital Iceland](https://stafraent.island.is/) department inside the [Ministry of Finance and Economic Affairs](https://www.government.is/ministries/ministry-of-finance-and-economic-affairs/).

These solutions are [FOSS](https://en.wikipedia.org/wiki/Free_and_open-source_software) and open to contributions, but most development is performed by teams that win tenders to develop new functionality for Digital Iceland. The repository is a [monorepo](../technical-overview/monorepo.md) that has multiple apps (something that can be built and run) and libraries (which other apps and libraries can depend on). All custom-written services is stored in there.

## Technology

### General

The codebase is all [TypeScript](https://www.typescriptlang.org) and [NodeJS](https://nodejs.org/en/). For more info please see the [Technical Direction](technical-direction.md). We use [NX](https://nx.dev) to manage the monorepo structure. We have one set of NodeJS modules used by all code and any changes in there affect potentially multiple services.

| Tool                                          | Description                         |
| --------------------------------------------- | ----------------------------------- |
| [NodeJS](https://nodejs.org/en/)              | scripts and server-side framework   |
| [TypeScript](https://www.typescriptlang.org/) | programming language                |
| [NX](https://nx.dev/react)                    | monorepo tools and code scaffolding |

### Frontend

| Tool                                                          | Description                                                |
| ------------------------------------------------------------- | ---------------------------------------------------------- |
| [React](https://reactjs.org/)                                 | UI framework                                               |
| [NextJS](https://nextjs.org/)                                 | front-end framework with routing and server side rendering |
| [Treat](https://seek-oss.github.io/treat/)                    | css-in-js                                                  |
| [Storybook](https://storybook.js.org/)                        | develop and document React components in isolation         |
| [Apollo Client](https://www.apollographql.com/docs/react/)    | graphql client                                             |
| [GraphQL Code Generator](https://graphql-code-generator.com/) | generate GraphQL clients and types                         |
| [Cypress](https://www.cypress.io/)                            | automated browser testing tool                             |
| [MirageJS](https://miragejs.com/)                             | API mocking for webapps                                    |

### Backend

We use [NestJS](https://nestjs.com) for the backend. Use the pre-packaged setup that we have and you will save us all some time. You can find the latest and greatest in how we setup a backend in our [reference-backend](https://github.com/island-is/island.is/blob/master/apps/reference-backend)

| Tool                                                 | Description                                 |
| ---------------------------------------------------- | ------------------------------------------- |
| [NestJS](https://nestjs.com/)                        | server-side framework for NodeJS            |
| [Sequelize](https://sequelize.org/)                  | database object relational mapper           |
| [OpenAPI Generator](https://openapi-generator.tech/) | generate clients and types for OpenAPI APIs |

### Code Quality

| Tool                             | Description            |
| -------------------------------- | ---------------------- |
| [Jest](https://jestjs.io/)       | automated testing tool |
| [ESLint](https://eslint.org/)    | code checker           |
| [Prettier](https://prettier.io/) | code formatter         |

### Protocols and specifications

| Tool                                           | Description                            |
| ---------------------------------------------- | -------------------------------------- |
| [GraphQL](https://graphql.org/)                | api protocol for our frontend projects |
| [OpenAPI](https://www.openapis.org/)           | specification to describe rest apis    |
| [Open ID Connect](https://openid.net/connect/) | authentication protocols               |

### Repositories

| Tool                                      | Description                        |
| ----------------------------------------- | ---------------------------------- |
| [PostgreSQL](https://www.postgresql.org/) | SQL database                       |
| [Contentful](https://www.contentful.com/) | headless content management system |

### Infrastructure

Applications are composed of services that are [packaged in Docker containers](welcome.md#dockerizing) and then deployed in a Kubernetes cluster using Helm. You will hardly need to know about this if you follow the path everyone else in the organization is walking. All our environments are hosted in [AWS](devops/environment-setup.md).

| Tool                                 | Description                                                          |
| ------------------------------------ | -------------------------------------------------------------------- |
| [Docker](https://www.docker.com/)    | virtual machine containers for continuous integration and deployment |
| [Kubernetes](https://kubernetes.io/) | host docker containers in production                                 |
| [Helm](https://helm.sh/)             | kubernetes deployment configuration                                  |

## Practices

To contribute you need to follow the standard [GitHub Pull Request (PR)](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) workflow. When you open a PR, your code will be run through the [CI process](adr/0002-continuous-integration.md) automatically. Ask for a [code-review](code-reviews.md) and when you get an approval, merge to `master`. Rinse and repeat.

When a code change gets on `master`, that will create Docker containers for all services and everything will get deployed to `Dev` env. For more info please see the [Continuous Delivery process](devops/continuous-delivery.md).

We expect contributors to deliver the following:

- the business logic
- the tests
- documentation
- [logs](devops/logging.md)
- [metrics](devops/metrics.md)

## Starting a new project/application

If you are adding a new application, please follow the instructions [here](../island-is-repository/generate.md).

## Dockerizing

You simply need to add an NX target to your service to enable creating a Docker image for it. For more info see [dockerizing](devops/dockerizing.md).

## Kubernetes

We have a Helm chart template that should fit most services. You pretty much only need to add your ingress (optional), environment variables(optional) and secrets(optional) and your service can get deployed to Dev. For more info, please see [Helm charts](https://github.com/island-is/helm). For a read-only view of the Kubernetes cluster and the services running there head over to

- [Dev](https://kubenav.dev01.devland.is)
- [Staging](https://kubenav.staging01.devland.is)
