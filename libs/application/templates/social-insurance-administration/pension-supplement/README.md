```markdown
# Application Templates Pension Supplement

## Description

This application template facilitates applicants in applying for pension supplements.

![Application Flow Chart](../core/assets/tr-applications-flow-chart.png)

### States

#### Prerequisites

This is a temporary state where all new applications are initialized. It has a short lifespan and is not listed. The purpose of this state is to act as a gateway into the actual application process. 

Here, the applicant reviews general information on application processing and data collection at TR. An external data step fetches data from Þjóðskrá and TR. If the applicant is neither a pensioner (old age, disability, or rehabilitation), nor has a registered domicile in Iceland, or if they exceed the income criteria, they cannot proceed to the next step and submit an application.

#### Draft

Eligible applicants will be able to move to this state to begin the actual application process, filling in all the required data.

#### Tryggingastofnun Submitted

Once the applicant has submitted the application to TR, it enters this state. The application can still be edited here.

#### Tryggingastofnun In Review

For the application to enter this state, TR needs to initiate a state change when they begin reviewing the application. In this state, the application cannot be edited.

#### Additional Documents Required

If TR requires additional documents to complete the application processing, they can change the state to allow the applicant to upload the missing documents.

#### Approved

The application has been approved by TR.

#### Rejected

The application has been rejected by TR.

### Localization

All localization can be found on Contentful:

- [Pension Supplement Application Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/ul.application)
- [Application System Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When creating new text strings in the `messages.ts` file for the application, be sure to update Contentful. See [message extraction](../../../localization/README.md#message-extraction) for guidance.

## Setup

Refer to the [application-system](../../../../apps/application-system/README.md) setup guide to get started.

Once everything is running, you can navigate to [http://localhost:4242/umsoknir/uppbot-a-lifeyri](http://localhost:4242/umsoknir/uppbot-a-lifeyri) to start development.
```