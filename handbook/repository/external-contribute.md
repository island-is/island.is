# External Contributions

{% hint style="warning" %}
While we are still heavily working on improving this section, we appreciate, for now, assistance with security reviews (more eyes = better), documentation, and small fixes.
{% endhint %}

## Getting started

Ísland.is repository contains many projects and libraries. As you can imagine, it depends of many external services and APIs. In result, we need many credentials if we want to run all the projects.

While we are still working on solutions to help external developers to run all the projects, we already implemented some solutions for you.

We have a [Mock library](../../libs/shared/mocking/README.md) that can be setup individually on project to replace the usage of external services, like contentful, and run dummy data instead.

### API and Web

At the moment, only the [`api`](https://github.com/island-is/island.is/tree/main/apps/api) project is using the Mock library, but as a result, it allows you to run the [`web`](https://github.com/island-is/island.is/tree/main/apps/web) project.

To run a project with the Mock library, add the following to your `.env` file:

```bash
API_MOCKS=true
```

To find out how to run the website, check out the detail on [its documentation](../../apps/web/README.md#getting-started).

## Workflow

{% hint style="info" %}
You can follow this free videos series on [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) if you are not familiar with the github development workflow.
{% endhint %}

Many people are working on the project and any PR will be noticed very quickly. When doing changes to a specific file, a code owner will be found and assigned as a reviewer for your PR. When the necessary approval will be reached, the PR will be in a state of merging. In this case, we will add a `auto-merge` label that will handle the merge with `main` automatically.

Before you submit your PR, please make sure to follow the following steps:

- Base your work on the `main` branch.
- If you fixed a bug or added a new feature, and existing tests already existed, make sure the tests are still passing, and add more if needed.
- Run the [tests](../../README.md#running-unit-tests) and [lint](../../README.md#running-lint-checks) for you changes locally.
- [Format](../../README.md#formatting-your-code) your changes to follow NX code conventions.
- You are ready to go.

## Style Guide

We use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) to automatically enforce most of our [Code Standards](../technical-overview/code-standards.md).

- To [format](../../README.md#formatting-your-code) your code.
- To [lint](../../README.md#running-lint-checks) your code.
