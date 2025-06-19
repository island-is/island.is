# Transport Authority Exemption for Transportation

## Description

This application allows users to apply for an exemption for the transportation of heavy and/or large freight. The application is connected to Samgöngustofa (The Icelandic Transport Authority).

## URLs

- [Local](http://localhost:4242/umsoknir/undanthaga-vegna-flutnings)
- [Dev](https://beta.dev01.devland.is/umsoknir/undanthaga-vegna-flutnings)
- [Production](https://island.is/umsoknir/undanthaga-vegna-flutnings)

## Clients, template-api-modules and Domain

- [Client](https://github.com/island-is/island.is/tree/main/libs/clients/transport-authority/exemption-for-transportation/src/lib/exemptionForTransportationClient.service.ts)
- [Template-api-module](https://github.com/island-is/island.is/tree/main/libs/application/template-api-modules/src/lib/modules/templates/transport-authority/exemption-for-transportation/exemption-for-transportation.service.ts)
- [Domain](https://github.com/island-is/island.is/tree/main/libs/api/domains/transport-authority/src/lib/transportAuthority.service.ts)

## States

### Prerequisite

Data fetching from National Registry, User profile, and Samgöngustofa (rules for input validation).

### Draft

The user provides information about the exemption they are requesting, including relevant freight details. Validation and eligibility checks are performed during this step.

### Completed

User receives confirmation that the application has been submitted to Samgöngustofa for processing.

## Localisation

All localisation can be found on Contentful.

- [Application translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/ta.eft.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

## Test users

- Any gervimaður should work for testing this template, since you can type in any vehicle/trailer permno

## Codeowners

- [Origo](https://github.com/orgs/island-is/teams/origo)
  - [Jóhanna](https://github.com/johannaagma)

## Running unit tests

Run `nx test transport-authority-exemption-for-transportation` to execute the unit tests via [Jest](https://jestjs.io).
