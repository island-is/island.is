# New Primary School Application

Directorate of Education and School Services (DESS) / Miðstöð menntunar og skólaþjónustu (MMS) *(To be announced)*

## About

This application template enables parents or guardians to apply for a new primary school placement or enroll their 6-year-old child in the first year of primary school. It streamlines the process by integrating with national registries and school systems to retrieve relevant applicant and child data.

## URLs

- `/umsoknir/grunnskoli/`

## Integrations

This application integrates with the following systems to retrieve applicant and child data:

- [Þjóðskrá](https://skra.is): Retrieves the applicant's information and the applicant's children's information.
- [Frigg](https://island.is/s/midstod-menntunar-og-skolathjonustu): Retrieves the applicant's children's previous and current school information.

### Localisation

All localisation can be found on Contentful.

- [New primary school application translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/nps.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

When creating new text strings in the messages.ts file for the application, be sure to update Contentful, see [message extraction](../../../localization/README.md#message-extraction).

## States

The application process includes the following states:

### Prerequisites

Temporary initial state for all new applications. It remains unlisted and is used to retrieve data from Þjóðskrá and Frigg. The applicant selects the child they wish to apply for.

### Draft

Applicants fill in the required information to complete the application.

### Approved

The application has been approved by the selected school.

### Rejected

The application has been rejected by the selected school.

## Tests

Run `nx test application-templates-new-primary-school` to execute the unit tests via [Jest](https://jestjs.io).

## Project owner

- [Miðstöð menntunar og skólaþjónustu](https://island.is/s/midstod-menntunar-og-skolathjonustu)

## Code owners and maintainers

- [Deloitte](http://www.deloitte.is)
