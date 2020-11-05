# Branching and release strategy

- Status: accepted
- Deciders: devs, devops
- Date: 2020-05-24

## Context and Problem Statement

How do we want to organise work in branches and how should changes be released? How should different branches be continuously deployed for QA?

## Decision Drivers

- We need to have confidence in our releases.
- We want more structured releases while we're still getting our footing in a shared monorepo.
- We need simplicity and clear [takt time](https://kanbanize.com/continuous-flow/takt-time) so different teams can plan for what is going out the door from them.
- It should work well with our agile work environment.

## Considered Options

Branching strategies:

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [OneFlow](https://www.endoflineblog.com/oneflow-a-git-branching-model-and-workflow)

Release strategies:

- [Continuous delivery](https://martinfowler.com/bliki/ContinuousDelivery.html)
- [Release trains](https://martinfowler.com/articles/branching-patterns.html#release-train)

## Decision Outcome

Chosen option: "OneFlow" because it provides a single eternal branch with well structured releases.

We'll implement OneFlow with these details:

- Release branches are set up the Monday after each sprint. This is sometimes called release trains, where features line up for different release trains.
- Release and quality managers from each team are responsible for reviewing and approving releases.
- Releases apply to all apps in the monorepo.
- Releases are versioned like this: `{cycle}.{sprint}.{hotfix}`. So version 3.1.2 is the release after cycle 3, sprint 1 with two hot fixes applied.
- Feature branches are merged using "Squash and merge", so they can be easily reverted.
- There are two ways to build larger features.
  - If the feature is isolated and not likely to cause conflicts, they can stay on long-living feature branches until they are ready to be released.
  - If the feature touches many parts of the codebase, it can be useful to merge changes more often but hide the feature in production with feature flags.
- If a project needs to deploy updates outside of the sprint rhythm, they should use hotfix branches.

### Future strategy

With time, we expect to build up better testing capabilities which gives us more confidence in the health of our monorepo. Then we can move quicker, with a simpler GitHub Flow branching strategy and continuous delivery into production.

### Hosting environments

We'll set up continuous delivery to different hosting environments:

| Environment | Git source            | Databases/services | Features |
| ----------- | --------------------- | ------------------ | -------- |
| sandbox     | feature branch        | Test               | All      |
| dev         | master                | Test               | All      |
| staging     | master                | Prod               | All      |
| pre-prod    | release/hotfix branch | Prod               | Finished |
| prod        | latest release tag    | Prod               | Finished |

We'll probably start with dev, staging, pre-prod and prod environments, since feature branch deployments are more dynamic and difficult to manage.

## Pros and Cons of Branching Options

### Git Flow

- Good, when there needs to be multiple versions in production.
- Good, because it enforces an easy to comprehend naming convention for branches.
- Good, because it has good support in popular git tools.
- Bad, because the git history becomes unreadable.
- Bad, because the master/develop split is redundant.

### GitHub Flow

- Good, because it fits well with Continuous Delivery and Continuous Integration.
- Good, a simpler alternative to Git Flow.
- Good, when we need to maintain a single version in production.
- Bad, because production code can become unstable most easily.
- Bad, if we need release plans.

### One Flow

- Good, because it has a clean git history (with squash-and-merge).
- Good, because it has a structured release process without multiple long running branches.
- Good, because it has good parts from GitHub Flow (simple history with one branch + feature branches) and Git Flow (releases and hot fixes).
- Bad, because it makes continuous integration more difficult.

## Pros and Cons of Release Options

### Continous Delivery

- Good, because it is simpler and leaner, allowing changes to be deployed quicker.
- Bad, because it can easily break something in production if our CI isn't good enough.

### Release trains

- Good, because it has more structured releases, which helps with planning and QA.
- Good, because it can be synchronised to organisational schedule.
- Good, because it gives us a process to verify and test each release.
- Bad, because it is fairly rigid and complicated to implement organisation-wide.

## Links

- [4 branching workflows for Git](https://medium.com/@patrickporto/4-branching-workflows-for-git-30d0aaee7bf)
- [Branching patterns - Martin Fowler](https://martinfowler.com/articles/branching-patterns.html)
