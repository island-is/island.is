# Monorepo

The [Technical Direction](technical-direction.md) lays out a directive that front facing solutions of island.is is to be developed in a monorepo. This follows best practices from companies like Google, Facebook and Microsoft that operate large scale applications across thousands of developers with monorepos.

## Why?

Why do big companies like to manage their code in monorepos, or in other words, use a single code base to manage multiple apps and libraries. The simple answer is that this approach helps manage complexity by applying best practices organization wide. This delivers consistency and predictability in our code, while also maximising the ability to share code between projects.

### Best practices

In monorepos, it is easier to configure code validation and tests that is performed for all projects. Teams work together across projects to discuss and implement best practices, which increases the overall consistency and quality of the code.

For example, shared `prettier` and `eslint` configurations enforce that all code has the same style and follow the same rules.

### Code sharing

In multi-repo systems, there is always an overhead to reusing code. It involves creating new repositories with significant boilerplate, publishing packages into package registries, dealing with versioning and managing changes that cross multiple repositories.

This overhead hurts the amount of code sharing between projects. This affects not only reuse of obvious things like utilities and components, but also testing helpers, CI logic, CD pipelines, code generators and more.

In a monorepo, we can move any piece of code into a shared package and immediately start reusing it.

It's also much easier to make changes to shared code in a monorepo, since we can find and test all usage, with most changes automatically verified in CI. Compared to a multi-repo setup where we need to version every change, where different projects end up depending on different versions of the package, and need to manually update, which gets more risky the farther they fall behind.

### Less code rot

When projects live in their own repositories, its code is mostly seen by its maintainers. When they move on, the code usually lies untouched and starts to rot, where it falls behind on best practices and dependencies.

When it depends on older versions of libraries and components, at best it has inconsistent design and logic from newer projects, at worst it can have major security issues.

Making changes to an old project is difficult when it isn't consistent with newer projects. It takes longer to get into the project, and it requires complex effort/value/risk evaluation between working in the old environment vs upgrading the project in parts or whole.

In a monorepo, best practices, dependencies and shared code are updated for all projects at the same time.

## How?

In the previous sections we've enumerated many of the long term benefits of using monorepos. However, they skimp on the challenges of monorepos. The good news is that how we deal with these challenges brings even more benefits.

### CI/CD

When all projects, old and new, are constantly kept up to date with best practices, shared code and dependencies, we need a high degree of confidence that nothing breaks when we change something.

Also, we need to know which projects are affected by a change and should be deployed. I.e. we don't want to deploy all projects when someone pushes a change `README.md`.

This is where automatic testing and a smart CI/CD setup comes in.

All code should be strongly typed with TypeScript, so we can verify that interfaces and schemas match between projects and dependencies. Depending on the code, it needs to have unit tests, integration tests, contract tests or E2E tests to verify that everything works. This includes our web-apps, which should have Cypress E2E tests that verify primary flows.

The CI runs these tests on every change. By using a monorepo tool that provides a caching layer and tracks dependency graphs, the CI can be optimised to only test projects which are affected by a change. This also allows us to deploy only the projects that are affected by a change.

### Sharing NPM dependencies

Across all of our projects we should strive to have as few dependencies as possible with as few versions as possible. This is important not only for consistency and security but also for performance, especially in web-apps where it's easy to end up with huge bundles of redundant dependencies. So we should try to end up with one ORM, one date manipulation library, one form library etc.

These are [Architectural Decisions](adr/README.md) that need to be well documented. It's completely fine, and expected, that these decisions don't last forever. When we decide on a specific dependency, we'll have a migration period during which the monorepo is using different dependencies for the same task. The important thing is to have a direction and a plan.

To enforce this, we have a single package.json in the root of the monorepo, which lists all dependencies for all projects. Having a single package.json eliminates a lot of issues when multiple projects depend on different versions of the same package, including having redundant code in website bundles.

### Code ownership

Even though all code is in the same repository, it is important to set virtual boundaries. Teams should be free to work on code for their own projects. If they need to modify other code, especially shared code, those changes should be reviewed by other teams.

Generally project code is owned by the teams working on the project while shared code is managed by specific teams or [Disciplines](teamwork.md#disciplines).

Using [Protected Branch](https://help.github.com/en/github/administering-a-repository/about-protected-branches) and [Code Owner](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners) features in GitHub, we can enforce code ownership on a file and folder level. Each pull request automatically notifies and requests reviews from the teams responsible for the changed code. These pull requests can not be merged unless they are reviewed by the respective parties.

## Branching strategy

We use [OneFlow](https://www.endoflineblog.com/oneflow-a-git-branching-model-and-workflow) to organise branches during feature development and release management.

Everything on main should be stable and ready for release.

Work is performed on feature branches, which need to pass Continuous Integration checks and code reviews before they can be merged to main. Larger features can be managed in two ways:

1. If the feature is isolated and unlikely to have conflicts, it can be developed on a long-lasting feature branch until it is ready for deployment.
2. If the feature touches a lot of code and is likely to have conflicts, we should try to split it into smaller feature branches that are reviewed and merged independently. The overall feature can be disabled in production, eg using feature flags.

We use "squash and merge" to compress features into one commit on main. This gives us a clean git history and allows us to easily revert unstable features.

When it's time to deploy to production, we create a release branch from main. There we can test, approve and hotfix the release without blocking main. When a release goes live, we tag the release branch and merge it to main.

If we need to deploy a hotfix to production, we create a hotfix branch from the latest release tag. When the hotfix is ready, we deploy it, tag it and merge the branch to main.

## Release strategy

All work is organised and synchronised in 7 week cycles, each of which consist of three 2-week sprints and a reflection week. We use release trains, set against this schedule to plan releases into the future.

Each release is versioned using cycle, sprint and hotfix numbers:

```
{cycle}.{sprint}.{hotfix}

The major version grows by one after every 7 week cycle.
The minor version grows by one for every sprint of a cycle, then resets.
The patch version grows by one for every hotfix after a major/minor release.
```

Sprints generally start on Mondays and end with a demo a week later on Friday.

- On the Monday after the first sprint of the first cycle, we release version 0.1.0.
- If we release a hotfix for 0.1.0, it gets the version 0.1.1.
- On the Monday after the second sprint of the first cycle, we release version 0.2.0.
- On the Monday after the third and final sprint of the first cycle, we release version 1.0.0, since that's the end of the cycle.
- After the reflection week, a new cycle starts.
- On the Monday after the first week of the second cycle, we release version 1.1.0.

To catch a release train, you need to finish your feature and get it approved and merged to main before the train departs. Larger features usually launch on a cycle (major) release. Smaller features can launch on a sprint (minor) release.

Before a release goes into production, it gets deployed to a pre-production environment. Each team has a release manager that reviews and signs off on the changes.

### Continuous Delivery

We have the following deployment environments:

- feature branches: Manually deployed to a sandbox environment.
- main: Automatically deployed to the development environment, with dev data and all feature flags turned on.
- main: Automatically deployed to the staging environment, with some production data and all feature flags turned on.
- release and hotfix branches: Automatically deployed to the pre-production environment, with production data and all feature flags turned off.
- release tags: Manually deployed to production.
