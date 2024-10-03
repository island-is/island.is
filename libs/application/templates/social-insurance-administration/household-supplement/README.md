# Application Templates Household Supplement

## Description

This template allows applicants to apply for a household supplement.

![Flowchart](../core/assets/tr-applications-flow-chart.png)

### States

#### Prerequisites

A temporary state for new applications with a short lifespan and is unlisted. It serves as an entry guard, providing general information on processing and data collection. Data is fetched from Þjóðskrá and TR. If the applicant is not a pensioner or lacks certain conditions, they cannot progress.

#### Draft

Eligible applicants can start the application, filling in necessary data.

#### Tryggingastofnun Submitted

The application is sent to TR and can still be edited.

#### Tryggingastofnun in Review

TR changes the state when reviewing the application. The application cannot be edited in this state.

#### Additional Document Required

If TR needs more documents, they switch the state to allow applicants to provide the missing materials.

#### Approved

The application is approved by TR.

#### Rejected

The application is rejected by TR.

### Localization

All localization is on Contentful.

- [Household Supplement Application Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/hs.application)
- [Application System Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When creating new text strings in the `messages.ts` file, update Contentful. See [message extraction](../../../../localization/README.md#message-extraction).

## Setup

Refer to the [application-system](../../../../../apps/application-system/README.md) setup guide.

Once running, navigate to [http://localhost:4242/umsoknir/heimilisuppbot](http://localhost:4242/umsoknir/heimilisuppbot) to start developing.