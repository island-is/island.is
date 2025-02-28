# Application Templates Household supplement

## Description

This application template allows applicants to apply for household supplement.

![](../core/assets/tr-applications-flow-chart.png)

### States

#### Prerequisites

This state is a temporary state that all new applications will be created in. It has a short lifespan and is unlisted.

The purpose of this state is to be a guard into the actual application. There the applicant reads general information on the processing and data collection for applications at TR. There is an external data step which fetches data from Þjóðskrá and TR. If the applicant is not a pensioner (old age, disability or rehabilitation), has a spouse that does not belong to an institution for the elderly or do not have a registered domicile in Iceland they cannot advance to the next step and make an application.

#### Draft

Valid applicant will be able to advance to this state where they can start the actual application and fill in all the relevant data.

#### Tryggingastofnun submitted

When applicant has sent in the application to TR the application is in this state. Here the application can be edited.

#### Tryggingastofnun in review

For application to be in this state, TR need to make a state change when they start to review the application. Here the application can not be edited.

#### Additional document required

If TR needs additional documents to finish processing the application they can make a state change so the applicant can add their missing documents.

#### Approved

Application has been approved by TR.

#### Rejected

Application has been rejected by TR.

#### Dismissed

Application has been dismissed by TR.

### Localisation

All localisation can be found on Contentful.

- [Household supplement application translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/hs.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When creating new text strings in the messages.ts file for the application, be sure to update Contentful, see [message extraction](../../../../localization/README.md#message-extraction).

## Setup

See [application-system](../../../../../apps/application-system/README.md) setup on how to get started.

Once you have everything running you can navigate to [http://localhost:4242/umsoknir/heimilisuppbot](http://localhost:4242/umsoknir/heimilisuppbot) and start developing.
