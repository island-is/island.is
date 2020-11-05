# Continuous Integration

- Status: accepted
- Deciders: devs, devops
- Date: 25.05.2020

## Context and Problem Statement

We need to maintain the quality of the codebase, minimize the time between introducing quality degradation and discovering it and make sure we have deployable artefacts at all times. In the context of a [monorepo](../../monorepo.md) we need to do this efficiently in order to make this process scale for an ever-growing number of projects in the repository.

### Terms

- `code integration` - this is a process that checks the integrity/quality of the code - static code analysis, code formatting, compilation, running automated tests, etc. The process is usually in the form of one or more scripts and uses tools local to the repository with minimum external dependencies.
- `artefact building` - this is a process that packages artefacts, labels them and usually publishes them to a central artefact repository so that they can be used by the deployment process. This process makes sense to be executed only after `code integration` process finishes successfully.
- `continuous integration` - the practice of running the `code integration process` triggered by events such as

  - pushing new revisions of the code to the code repository
  - opening a Pull Request
  - fixed schedule
  - etc.

  We also run the `artefact building` process after a successful `code integration` process to have artefacts ready for deployment at all times.

- `continuous integration platform` (CI platform from here on) - it is a platform (self-hosted or SaaS) that provides integrations to make it easy to run your `continuous integration` and publish the results

## Decision Drivers (Policy)

- The code integration process needs to be independent from CI platform integration
  - Benefits
    - Easier troubleshooting and development of the process
    - Easier migration to a different CI platform
    - Easier experimentation
    - Easier to run as part of the development process
  - Drawbacks
    - Needs more knowledge and experience
- We use Docker as much as possible to implement the steps in the integration process
  - Benefits
    - Platform independence
    - Repeatability
    - Security
  - Drawbacks:
    - Needs expertise in Dockerfile and Docker in general
- We only build the code affected by the change but re-tag all unchanged code artefacts
  - Benefits
    - Be able to release a consistent version of all necessary services. The Docker images for all services in the monorepo should have the same Docker image tag available for a commit hash
    - Supports the monorepo benefits and ideology
  - Drawbacks
    - Can be tricky, especially for artefacts that are not Docker images(currently we do not plan to have those)
- We support only Linux as a target operating system when we cannot use Docker
  - Benefits
    - Same as the OS we use in our production environment, which minimizes the chances of failure because of OS differences
    - We minimize the effort and complexity of supporting different operating systems
    - Linux tooling works on all major other OSs today - macOS and Windows
  - Drawbacks:
    - Devs that use non-Linux OS might need to install additional software and customizations

## CI Platform Considered Options

We only considered hosted solutions at this time to minimize the number of systems we need to maintain. Migrating to a different platform should not be a big or risky endeavour. They are merely convenient integrations with the code repository, cache hosting and notifications.

- GitHub Actions
  - Benefits
    - Well integrated with our code which is in GitHub
    - Due to the integration we do not need to provide
    - Well documented
    - Supports self-hosted runners
    - Well priced (free, not sure if there is a limit)
  - Drawbacks
    - Relatively new
- Circle CI
  - Benefits
    - Mature
    - Well-known
    - Supports self-hosted runners
    - Not sure if parallelization is supported on open-source projects
  - Drawbacks
    - It will cost us (they have a free tier but with a limit which seems we will likely reach)
- AWS CodeBuild
  - Benefits
    - Scalable builds
    - Best security model when part of our AWS account structure
    - Reasonably priced?
  - Drawbacks
    - UI is kind of bad

## Decision Outcome

GitHub Actions

- Number 1 CI platform on GitHub at the time of this writing
- Easy customization of which parts of the CI process to run depending on branching patterns and pull requests
- Good integration of code health with the pull request process
- As a GitHub open-source project, we have an unlimited number of "compute"-minutes that come as a part of the package
- Supports parallelisation of the process which can be pretty important in the context of monorepo
- Support using own runners which can be helpful to maximize speed, minimize costs and increase security.
