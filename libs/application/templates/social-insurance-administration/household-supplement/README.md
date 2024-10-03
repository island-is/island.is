```markdown
# Application Templates: Household Supplement

## Description

This application template allows applicants to apply for a household supplement.

![Application Flow Chart](../core/assets/tr-applications-flow-chart.png)

### States

#### Prerequisites

This is a temporary state where all new applications are initiated. It has a short lifespan and is unlisted.

The purpose of this state is to serve as a preliminary check before entering the actual application process. Here, the applicant reads general information about data collection and processing by TR (Tryggingastofnun). An external data step fetches data from Þjóðskrá (the National Registry of Iceland) and TR. If the applicant is not a pensioner (old age, disability, or rehabilitation), has a spouse not belonging to an institution for the elderly, or does not have a registered domicile in Iceland, they cannot proceed to the next step.

#### Draft

Valid applicants can advance to this state, where they can start the actual application and fill in all the relevant data.

#### Tryggingastofnun Submitted

When the applicant submits the application to TR, it enters this state. The application can be edited here.

#### Tryggingastofnun In Review

For an application to enter this state, a state change is made by TR when they begin reviewing the application. At this point, the application cannot be edited.

#### Additional Document Required

If TR requires additional documents to complete the application processing, they can change the state, allowing the applicant to provide the missing documents.

#### Approved

The application has been approved by TR.

#### Rejected

The application has been rejected by TR.

### Localization

All localization can be found on Contentful.

- [Household Supplement Application Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/hs.application)
- [Application System Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When creating new text strings in the `messages.ts` file for the application, update Contentful accordingly. See [Message Extraction](../../../../localization/README.md#message-extraction) for more details.

## Setup

Refer to the [Application System Setup](../../../../../apps/application-system/README.md) document for instructions on getting started.

Once set up, navigate to [http://localhost:4242/umsoknir/heimilisuppbot](http://localhost:4242/umsoknir/heimilisuppbot) to start developing.
```