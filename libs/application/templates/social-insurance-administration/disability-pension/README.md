# Disability pension application template

This template for an application was generated with the `nx generate-template disability-pension` command. It provides a scaffold for submitting disability pension applications to the Social Insurance Administration (TR)

## Description

- This application template is designed to facilitate the submission of disability pension applications to the Social Insurance Administration (TR). 
- Gervimenn include: Elmar ÞÍ - 070-4802, Birta Hlín - 160-1430

#### Prerequisites

This state is a temporary state that all new disability pension applications will be created in. It has a short lifespan and is unlisted.

The purpose of this state is to be a guard into the actual application. There is an external data step which fetches data from island.is, þjóðskrá and TR.

### Not eligible

If the applicant doesn't fulfill the required pre-conditions to apply for disability pension the application goes to this state, the application cannot advance and the applicant will get a screen detailing why they cannot proceed with an application.

#### Draft

Valid applicants will be able to advance to this state where they can start filling in their details, reviewing the required documentation and answering a self-assessment questionnaire.

#### Tryggingastofnun submitted

When applicant has sent in the application to TR the application is in this state.

#### Approved

The application has been approved by TR.

#### Rejected

Application has been rejected by TR.

#### Dismissed

Application has been dismissed by TR.

All localisation can be found on Contentful.

- [Disability pension translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/dp.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When creating new text strings in the messages.ts file for the application, be sure to update Contentful, see [message extraction](../../../../localization/README.md#message-extraction).




## Running unit tests

Run `nx test application-templates-social-insurance-administration-disability-pension` to execute the unit tests via [Jest](https://jestjs.io).
