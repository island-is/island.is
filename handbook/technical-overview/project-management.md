# Project Management

## Development process

We work according to Agile and DevOps methodologies, where we focus on releasing small features frequently so we can get customer feedback early in the process. Our entire release cycle is automated which shortens release time so we can develop and respond quickly. We deploy to three environments: Dev, Staging and Prod. Releases to the Dev environment uses continuous deployment where we have a set of fake data that can be used for testing.

Release to production happens on a shared schedule which sets the tempo and rhythm for all projects across all teams. Each development cycle is 7 weeks in total and consists of three, two week sprints and one refactor week. Deployments are scheduled after each sprint along with demos where new features and changes are demonstrated for all interested parties.

Everything about our Continuous Delivery process can be found here: [Continuous Delivery](devops/continuous-delivery.md)

## Quality gates

We ensure software quality in many aspects. Here are some highlights: 

- Automatic tests are required in our projects. [More information](https://docs.devland.is/repository/system-e2e).
- All code is owned by some team which reviews all changes to the code they are responsible for. All code must be reviewed by at least one separate person. [More information](https://docs.devland.is/technical-overview/code-reviews).
- We have a robust operational monitoring system which allows us to react to incidences quickly. [More information](https://docs.devland.is/technical-overview/devops/observability#provide-observability-into-the-applications).
- We use feature flagging technology that allowes us to get features to production in dormant state and then activated later. This way we get smaller features through the development process and can test certain functionality on limited user groups. [More information](https://docs.devland.is/technical-overview/feature-flags).

## Definition of done

Before we release features to the general public we review the following list and make sure that all appropriate items have been addressed: 

- **Architecture:** has been reviewed by the Core and DevOps team.
- **Language support:** user-facing products are available in both Icelandic and English.
- **Accessibility:** UI and UX is according to our accessibility policy.
- **Testing:**
  - Test cases have been reviewed by the Product Owner.
  - External integration tests have been created when we depend on third party APIs.
  - Internal API tests and unit tests have been created.
  - End to end tests have been created for smoke tests.
- **Audit logs:** all user interactions/changes are audit logged.
- **Security:** review if new API functionality is correctly authorized and protected.
- **Technical documentation:** technical documentation has been added in the context of the feature.
- **Logging implemented:** logging is sufficient so that the solution can be monitored. [More information](https://docs.devland.is/technical-overview/devops/logging). 
- **Analytics:** anonymous usage monitoring of new features has been set up.
- **Organization approval:** if the feature is a collaboration with another organization they should approve the release.
- **External APIs:** when using a new web service from another organization, verify that it is correctly configured and reachable in production.
- **Delegations:** check if new functionality should be available when a user acts on behalf of a company, their child, or another person.

For digital applications we add the following items to our Definition of Done.

- **States:** are application states correctly configured for the application overview screen.
- **Data collection:** the data collection screen should be approved by the organization and Stafrænt Ísland.
- **Roles:** if multiple parties contribute to the same application, then review the roles and make sure they can only access the correct data.
- **Lifecycle:** how long we store application data should be reviewed and approved by the organization.
- **Payments:** when using ARK-Quickpay, we need to sync with FJS on making the product ID available in QuickPay and make sure that payments are confirmed.
- **Article:** when an article that points to a new digital application has been published in the CMS, it should be tagged with the tag ‘umsokn’. This enables front ends, e.g. the Ísland.is app, to list it with other fully digital applications.

After release:

- **Feature flagging:** When the feature has been deployed to the general public, we need to clean up the feature flag and remove all code which the feature flag replaced. [More information](https://docs.devland.is/technical-overview/feature-flags).
