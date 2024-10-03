```markdown
# Application Templates: Old Age Pension

## Description

This application template enables applicants to apply for an old age pension.

![Application Flow Chart](../core/assets/tr-applications-flow-chart.png)

### States

#### Prerequisites

This is a preliminary state where all new applications are initially created. It has a short lifespan and is unlisted.

The objective of this state is to prepare the applicant for the actual application process. Here, the applicant selects the type of old age pension (full old age pension, half old age pension, or sailor's old age pension) and reviews general information on the processing and data collection by TR. An external data step is included to fetch data from Þjóðskrá and TR. Finally, there is a question step to determine if the applicant has applied from all their pension funds. If they are already an old-age pensioner, have an application in progress, or have not applied for all their pension funds, they cannot advance to the next step and complete an application.

#### Draft

Eligible applicants can proceed to this state to begin the actual application process and provide all necessary information.

#### Tryggingastofnun Submitted

Once applicants submit their application to TR, it enters this state. Here, the application can still be edited.

#### Tryggingastofnun In Review

When TR begins reviewing the application, they change its state to this. In this state, the application cannot be edited.

#### Additional Document Required

If TR needs extra documents to complete the application processing, they can change the state to allow the applicant to add any missing documents.

#### Approved

The application is approved by TR.

#### Rejected

The application is rejected by TR.

### Localisation

All localisation can be accessed on Contentful.

- [Old Age Pension Application Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/oap.application)
- [Application System Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

Ensure that any new text strings in the `messages.ts` file for the application are updated in Contentful. Refer to [message extraction](../../../../localization/README.md#message-extraction) for guidance.

## Setup

Refer to the [application system setup](../../../../../apps/application-system/README.md) documentation to get started.

Once setup, navigate to [http://localhost:4242/umsoknir/ellilifeyrir](http://localhost:4242/umsoknir/ellilifeyrir) to begin development.
```
