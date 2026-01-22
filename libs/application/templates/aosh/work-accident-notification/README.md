# Work Accident Notification application for The Administration of Occupational Safety and Health

### Description

The Work Accident Notification application allows both individual users and users with company delegations to submit accident reports. Individual users may only submit reports for their sole proprietorships, while company submissions require an assigned delegation. The application flow is nearly identical for both user types, with only minor variations in input fields based on the user’s role.

### URLs

- [Local](http://localhost:4242/umsoknir/tilkynning-um-vinnuslys)
- [Dev](https://beta.dev01.devland.is/umsoknir/tilkynning-um-vinnuslys)
- [Production](https://island.is/umsoknir/tilkynning-um-vinnuslys)

### Clients and template-api-modules

- [Client](https://github.com/island-is/island.is/tree/main/libs/clients/work-accident-ver/src/lib/workAccident.service.ts)
- [Template-api-module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/aosh/work-accident-notification/work-accident-notification.service.ts)

### States

#### Prerequisite

Data fetching from National Registry, User profile and The Administration of Occupational Safety and Health

#### Draft

In the Draft state, users input essential information for the accident report. This includes details about the company involved, specifics of the accident, and information on all injured employees. After entering this data, users can review an overview page, providing a chance to verify all inputs before final submission.

#### Completed

User recieves confirmation that reports has been successfully submitted and a PDF overview of the report

### Localisation

All localisation can be found on Contentful.

- [Work Accident Notification translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/aosh.wan.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

### Test users

- **Gervimaður Færeyjar 010130-2399 and 65°ARKTIC ehf delegation**

### Codeowners

- [Origo](https://github.com/orgs/island-is/teams/origo)
  - [Baldur Óli](https://github.com/Ballioli)
  - [Sigrún Tinna](https://github.com/sigruntg)
