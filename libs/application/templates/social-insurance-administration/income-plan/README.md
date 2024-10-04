# Income Plan

# Application Template Income Plan

## Description

This application template enables the submission of an income plan post-application.

### States

#### Prerequisites

This temporary state is where all new income plans are initially created. It is unlisted and has a short lifespan. It acts as a gatekeeper to the actual income plan, fetching data from Þjóðskrá and TR. Applicants cannot proceed if a previous income plan has been in progress at TR for less than 10 days or if they do not have an active application at TR that requires an income plan.

#### Draft

Eligible applicants can modify their pre-filled income plan here. If a plan is active at TR, they can adjust it and see a temporary calculation prior to submission.

#### Tryggingastofnun Submitted

The plan enters this state upon submission to TR, where edits remain possible.

#### Tryggingastofnun in Review

TR marks this state at the start of the review. No edits allowed.

#### Approved (Processed)

TR has processed the income plan.

### Localization

Localization details are on Contentful:

- [Income plan translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/ip.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

Add new text strings in `messages.ts` to Contentful. Refer to [message extraction](../../../../localization/README.md#message-extraction).

## Setup

See [application-system](../../../../../apps/application-system/README.md) for setup instructions.

Visit [http://localhost:4242/umsoknir/tekjuaaetlun](http://localhost:4242/umsoknir/tekjuaaetlun) to start development.

## Running Unit Tests

Run `nx test application-templates-social-insurance-administration-income-plan` for unit tests using [Jest](https://jestjs.io).
