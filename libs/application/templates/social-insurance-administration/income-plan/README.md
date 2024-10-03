## Description

This application template facilitates the submission of an income plan post-application.

### States

#### Prerequisites

This temporary state is where all new income plans are initially created. It is unlisted and has a short lifespan. It acts as a gatekeeper to the actual income plan, fetching data from Þjóðskrá and TR. Applicants cannot proceed if a previous income plan has been in progress at TR for less than 10 days.

#### Draft

Eligible applicants can review and modify their pre-filled income plan in this state. If an income plan is already at TR, they can adjust it and view a temporary calculation before submitting updates.

#### Tryggingastofnun Submitted

Once the applicant submits the income plan to TR, it enters this state. Here, editing is possible.

#### Tryggingastofnun in Review

TR changes the state to this when reviewing begins. No edits can be made in this state.

#### Approved (Processed)

The income plan has been processed by TR.

### Localization

Localization details are available on Contentful.

- [Income plan translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/ip.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When adding new text strings in the `messages.ts` file, update them in Contentful. Refer to [message extraction](../../../../localization/README.md#message-extraction).

## Setup

Refer to [application-system](../../../../../apps/application-system/README.md) for initial setup instructions.

After setup, visit [http://localhost:4242/umsoknir/tekjuaaetlun](http://localhost:4242/umsoknir/tekjuaaetlun) to start development.

## Running Unit Tests

Execute `nx test application-templates-social-insurance-administration-income-plan` to run unit tests via [Jest](https://jestjs.io).
