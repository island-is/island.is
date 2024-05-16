# Application Templates Payment Plan

## Description

This application template allows submit a payment plan following an application.

### States

#### Prerequisites

This state is a temporary state that all new applications will be created in. It has a short lifespan and is unlisted.

The purpose of this state is to be a guard into the actual application. There the applicant reads general information on the processing and data collection for applications at TR. There is an external data step which fetches data from Þjóðskrá and TR. If the applicant has not applied for old age pension, diability pension, disability allowance, rehabilitation pension, parental allownce or special pension, or has one of those applications in progress they cannot advance to the next step and make an application. They also cannot advance if they have a previous payment plan that has been less than 10 day in progress at TR or if TR have their annual December freeze on the submission of new payment plans

#### Draft

Valid applicant will be able to advance to this state where they can start the actual application and fill in all the relevant data.

## Running unit tests

Run `nx test application-templates-social-insurance-administration-payment-plan` to execute the unit tests via [Jest](https://jestjs.io).
