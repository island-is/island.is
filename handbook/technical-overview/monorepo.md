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
