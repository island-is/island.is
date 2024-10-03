## Description

This application template allows applicants to apply for additional support for the elderly.

![Application Flow Chart](../core/assets/tr-applications-flow-chart.png)

### States

#### Prerequisites

This is a temporary state for new applications. It is unlisted and has a short lifespan.

Purpose: To ensure applicants meet criteria before proceeding. It includes an external data step fetching information from Þjóðskrá and TR. Applicants must be 67+, have legal domicile in Iceland, and not be a pensioner with 90%+ social security rights to advance.

#### Draft

Eligible applicants can proceed here to fill in relevant data for their application.

#### Tryggingastofnun Submitted

Applications are in this state once submitted to TR. They can still be edited.

#### Tryggingastofnun In Review

TR shifts applications to this state upon review commencement. Editing is disabled.

#### Additional Document Required

TR can change the state to this if more documents are needed. Applicants can then add missing documents.

#### Approved

Application is approved by TR.

#### Rejected

Application is rejected by TR.

### Localisation

All localisation is available on Contentful.

- [Application translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/asfte.application)
- [System translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

Update Contentful when creating new text strings in `messages.ts`. See [message extraction](../../../../localization/README.md#message-extraction).

## Setup

Refer to the [application-system setup](../../../../../apps/application-system/README.md) for getting started.

Navigate to [http://localhost:4242/umsoknir/felagslegur-vidbotarstudningur](http://localhost:4242/umsoknir/felagslegur-vidbotarstudningur) for development.
