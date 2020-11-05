# Use NX

- Status: accepted
- Deciders: devs
- Date: 03.05.2020

## Context and Problem Statement

We want a monorepo tool to help us to scale development up for multiple projects and teams. It should not be too much in the way, but help us manage code, dependencies and CI/CD.

## Decision Drivers

- Low complexity and overhead in development.
- Fit for our stack.
- Optimize CI/CD with dependency graphs and/or caching.
- Flexible.

## Considered Options

- [Bazel](https://bazel.build/)
- [Nx](https://nx.dev/)
- [Lerna](https://lerna.js.org/)

## Decision Outcome

Chosen option: "Nx", because:

- It's specially designed around our stack (TypeScript, React, Node.JS, NPM, ESLint, Prettier, Cypress, Jest, NextJS).
- It's relatively easy to learn with focused documentation.
- It has schematics to generate apps, libraries and components that includes all of our tools.
- It is opinionated, which gives us a good base to start developing faster. Many things can still be configured or extended.

## Pros and Cons of the Options

### [Bazel](https://bazel.build/)

- Good, because it's created and maintained by Google
- Good, because it supports multiple programming languages and platforms.
- Bad, because it's difficult to learn, with a custom BUILD files.
- Bad, because JS support is hacky.

### [Nx](https://nx.dev/)

- Good, because it has built in support for our stack.
- Good, because it's been around for a while, originating in the Angular world.
- Good, because it's designed with best practices for large scale web applications.
- Good, because it supports elaborate code generation.
- Good, because it helps optimise CI/CD for large projects.
- Bad, because it's fairly opinionated.
- Bad, because it's an open source project maintained by an agency.

### [Lerna](https://lerna.js.org/)

- Good, because it integrates with NPM and Yarn.
- Good, because it's used by a lot of open source projects.
- Bad, because it's primarily designed for managing and publishing open source projects, not building and deploying large scale applications.

## Links

- [Why you should switch from Lerna to Nx](https://blog.nrwl.io/why-you-should-switch-from-lerna-to-nx-463bcaf6821)
