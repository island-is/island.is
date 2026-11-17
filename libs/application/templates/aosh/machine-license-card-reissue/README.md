# Machine License Card Reissue (Endurútgáfa plastkorts) for The Administration of Occupational Safety and Health

## Description

Holders of a work machine license (vinnuvélaréttindi) can order a reissued
plastic license card from Vinnueftirlitið. The card can be sent to the
applicant's legal domicile or another address. The license is always
available digitally in the island.is app.

## URLs

- [Local](http://localhost:4242/umsoknir/endurutgafa-plastkorts)
- [Dev](https://beta.dev01.devland.is/umsoknir/endurutgafa-plastkorts)
- [Production](https://island.is/umsoknir/endurutgafa-plastkorts)

## Clients and template-api-modules

- [Client](https://github.com/island-is/island.is/tree/main/libs/clients/work-machines)
- [Template-api-module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/aosh/machine-license-card-reissue/machine-license-card-reissue.service.ts)

## States

### Prerequisites

Data fetching from National Registry, User profile and
The Administration of Occupational Safety and Health (work machine licenses).

### Draft

Applicant information, delivery method for the card and an overview.

### Payment

Payment through the island.is payment flow.

### Completed

Application is submitted to Vinnueftirlitið.
**TODO:** The submission endpoint does not exist yet, submission is currently a stub.

## Localisation

All localisation can be found on Contentful.

- [Machine License Card Reissue translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/aosh.mlcr.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

## Codeowners

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte)
