# Machine License Renewal

## Description

The Machine License Renewal (Endurnýjun vinnuvélaskírteinis) application allows individual users to renew their machine license rights with The Administration of Occupational Safety and Health (Vinnueftirlitið). Rights can be renewed when six months or less remain of their validity. The applicant uploads a medical certificate, chooses whether to receive a plastic card and how it should be delivered, and pays the renewal fee.

## URLs

- [Local](http://localhost:4242/umsoknir/endurnyjun-vinnuvelaskirteinis)
- [Dev](https://beta.dev01.devland.is/umsoknir/endurnyjun-vinnuvelaskirteinis)
- [Production](https://island.is/umsoknir/endurnyjun-vinnuvelaskirteinis)

## Template-api-modules

- [Template-api-module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/aosh/machine-license-renewal/machine-license-renewal.service.ts)

## States

### Prerequisites

Data fetching from National Registry, User profile, The Administration of Occupational Safety and Health (machine license rights) and the payment catalog.

### Draft

The applicant goes through the following screens:

1. **Applicant:** personal information from National Registry and User profile.
2. **Rights:** the license number, the rights that will be renewed and other valid rights.
3. **Medical certificate:** upload of a medical certificate.
4. **License:** whether the applicant wants a plastic card. If so, the card is either sent to the applicant's legal domicile or to another address with an optional recipient.
5. **Overview:** summary of the application and approval of the terms of payment.

### Payment

Payment for the renewal through the payment state. The payment is verified before the application moves to the completed state.

### Completed

The applicant receives confirmation that the application has been received.

## Not yet implemented

The following depends on endpoints and information from The Administration of Occupational Safety and Health and is marked with TODOs in the code:

- Machine license rights are dummy data returned from the template-api-module.
- The charge item code `AOSH_MACHINE_LICENSE_RENEWAL` is a placeholder.
- The payment is not confirmed with The Administration of Occupational Safety and Health before the application moves from the payment state to the completed state. Only the island.is payment status is verified.
- The application is not submitted to The Administration of Occupational Safety and Health in the completed state.

## Feature flag

The application is behind the `isMachineLicenseRenewalEnabled` feature flag in ConfigCat.

## Local development

Payments can be tested locally by checking "Enable mock payment" on the prerequisites screen.

## Localisation

All localisation can be found on Contentful.

- [Machine License Renewal translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/aosh.mlr.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

## Test users

- All gervimenn should work here while the rights are dummy data

## Codeowners

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte)

## Running unit tests

Run `nx test application-templates-aosh-machine-license-renewal` to execute the unit tests via [Jest](https://jestjs.io).
