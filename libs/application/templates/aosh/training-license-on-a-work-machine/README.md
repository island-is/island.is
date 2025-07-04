# Training License On A Work Machine application for The Administration of Occupational Safety and Health

### Description

The Training License On A Work Machine application allows individual users to apply for a training license. They can be a contractor and therefore the application would be submitted after draft state, or they have to get someone from a company to approve for them, then the person from the company has to approve.

### URLs

- [Local](http://localhost:4242/umsoknir/kennslurettindi-a-vinnuvel)
- [Dev](https://beta.dev01.devland.is/umsoknir/kennslurettindi-a-vinnuvel)
- [Production](https://island.is/umsoknir/kennslurettindi-a-vinnuvel)

### Clients and template-api-modules

- [Client](https://github.com/island-is/island.is/blob/main/libs/clients/work-machines/src/lib/workMachines.service.ts)
- [Domains](https://github.com/island-is/island.is/blob/main/libs/api/domains/work-machines/src/lib/workMachines.service.ts)
- [Template-api-module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/aosh/training-license-on-a-work-machine/training-license-on-a-work-machine.service.ts)

### States

#### Prerequisite

Data fetching from National Registry, User profile and The Administration of Occupational Safety and Health

#### Draft

In the Draft state, users input essential information, including personal details, work machine tenure, and assignee information. After entering this data, users can review an overview page, which gives them a chance to verify all inputs before submitting. If the user is not a contractor, we will send an email to a person representing the company.

#### Review

If the user was not a contractor the person from the company has to review on a overview page, and either reject or approve the application.

#### Completed

The user receives a confirmation indicating that the report has been successfully submitted when the user is not a contractor.

### Localisation

All localisation can be found on Contentful.

- [Work Accident Notification translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/aosh.tlwm.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

### Test users

- **Gervimaður Færeyjar 010130-2399, work machine: AB9999 and Gervimaður Ameríka 010130-2989 65°ARKTIC ehf delegation**

### Codeowners

- [Origo](https://github.com/orgs/island-is/teams/origo)
  - [Sigrún Tinna](https://github.com/sigruntg)
