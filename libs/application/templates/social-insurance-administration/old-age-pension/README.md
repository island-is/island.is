## Description

This application template allows applicants to apply for old age pension.

![Application Process Flow](../core/assets/tr-applications-flow-chart.png)

### States Overview

#### Prerequisites

This is a temporary, unlisted state for new applications with a brief lifespan. It serves as a gateway into the main application. Applicants choose their pension type (standard, half, or sailor's pension) and receive introductory information about the process and data collection at TR. An external data step fetches information from Þjóðskrá and TR. There’s a mandatory question about whether all pension funds have been applied for. If applicants are already pensioners, have pending applications, or haven't applied for all pension funds, they cannot proceed.

#### Draft

Eligible applicants begin the actual application here and provide all necessary information.

#### Tryggingastofnun Submitted

The application enters this state once submitted to TR. It remains editable.

#### Tryggingastofnun In Review

TR moves the application to this state when they begin reviewing it. It becomes non-editable.

#### Additional Document Required

If further documents are needed, TR changes the state here, allowing applicants to upload missing documents.

#### Approved

The application is approved by TR.

#### Rejected

The application is rejected by TR.

### Localisation

Localization details are stored in Contentful:

- [Old age pension application translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/oap.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When adding new text strings in the `messages.ts` file, ensure updates in Contentful. Refer to [message extraction](../../../../localization/README.md#message-extraction).

## Setup

Refer to [application-system setup](../../../../../apps/application-system/README.md) for getting started.

After setup, navigate to [http://localhost:4242/umsoknir/ellilifeyrir](http://localhost:4242/umsoknir/ellilifeyrir) to begin development.