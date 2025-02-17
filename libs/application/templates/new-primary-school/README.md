# New Primary School - Directorate of Education and School Services (DESS) / (To be announced TBA - MMS)

## About

This application template enables applicants to apply for a new primary school or enrol their child in the first year of a new primary school.

## URLs

/umsoknir/nyr-grunnskoli/

## Integrations

- [Þjóðskrá](https://skra.is): Retrieves the applicant's information and the applicant's children's information.
- [Frigg](https://island.is/s/midstod-menntunar-og-skolathjonustu): Retrieves the applicant's children's previous and current school information.

### Localisation

All localisation can be found on Contentful.

- [New primary school application translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/nps.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When creating new text strings in the messages.ts file for the application, be sure to update Contentful, see [message extraction](../../../../localization/README.md#message-extraction).

### States

#### Prerequisites

This state is a temporary status that all new applications will initially be created in. It has a short lifespan and remains unlisted.

The purpose of this state is to serve as a preliminary step before entering the actual application process. An external data step retrieves information from Þjóðskrá and Frigg about applicant children and their current school. In this state, the applicant selects the child they wish to apply for.

#### Draft

In this state, valid applicants will be able to advance and begin the actual application process, filling in all the relevant data.

#### Approved

To be announced (TBA)

#### Rejected

To be announced (TBA)

## Tests

Run `nx test application-templates-new-primary-school` to execute the unit tests via [Jest](https://jestjs.io).

## Project owner

- [Miðstöð menntunar og skólaþjónustu](https://island.is/s/midstod-menntunar-og-skolathjonustu)

## Code owners and maintainers

- [Deloitte](http://www.deloitte.is)
