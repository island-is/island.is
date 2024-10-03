```markdown
# Application Templates: Additional Support for the Elderly

## Description

This application template enables applicants to apply for additional support for the elderly.

![Application Flow Chart](../core/assets/tr-applications-flow-chart.png)

### States

#### Prerequisites

This state is a temporary and unlisted state where all new applications start. It has a short lifespan. The purpose of this state is to provide a preliminary check before the actual application begins. Here, the applicant reviews general information on processing and data collection at TR. An external data step fetches data from Þjóðskrá and TR. If the applicant is under 67, does not have a registered legal domicile in Iceland, or is a pensioner with 90% rights or more in the social security system, they cannot proceed to the next step.

#### Draft

Valid applicants can advance to this state, where they can begin the actual application process and fill in all the necessary data.

#### Tryggingastofnun Submitted

When the applicant has submitted the application to TR, the application enters this state. At this stage, the application can still be edited.

#### Tryggingastofnun In Review

To transition an application to this state, TR must initiate a state change when they start reviewing the application. Once in this state, the application cannot be edited.

#### Additional Document Required

If TR requires additional documents to complete the processing of the application, they can transition the application to this state, allowing the applicant to upload the missing documents.

#### Approved

The application has been approved by TR.

#### Rejected

The application has been rejected by TR.

### Localization

All localization content is managed on Contentful.

- [Additional Support for the Elderly Application Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/asfte.application)
- [Application System Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When creating new text strings in the `messages.ts` file for the application, ensure to update Contentful following the [message extraction process](../../../../localization/README.md#message-extraction).

## Setup

Refer to the [Application System Setup](../../../../../apps/application-system/README.md) for instructions on getting started.

Once set up, navigate to [http://localhost:4242/umsoknir/felagslegur-vidbotarstudningur](http://localhost:4242/umsoknir/felagslegur-vidbotarstudningur) to start developing.
```