# License to practice application for Health Directorate

### Description

Application to apply for a license to practice for healthcare professionals. Health Directorate controls which healthcare educations can apply for electronic license to pratice.
We fetch information on educations from Health Directorate and users graduated programs and parse them during prerequisites.

### URLs

- [Local](http://localhost:4242/umsoknir/starfsleyfis-umsokn/)
- [Dev](https://beta.dev01.devland.is/umsoknir/starfsleyfis-umsokn)
- [Production](https://island.is/umsoknir/starfsleyfis-umsokn/)

### Clients and template-api-modules

- [Client]('https://github.com/island-is/island.is/tree/main/libs/clients/health-directorate/src/lib/clients/occupational-license')
- [Template-api-module]('https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/healthcare-work-permit/healthcare-work-permit.service.ts')

### States

#### Prerequisite

Data fetching and parsing information from Health Directorate and users graduated programs to determine if they qualify for a license

#### Draft

Confirm personal information and choose which program a user wishes to get a license for (if there are more then one), additionally lets user know
why certain programs do not qualify for a license

#### Payment

ARK payment step

#### Completed

User recieves a PDF license and registration number(under certain circumstance)

### Localisation

All localisation can be found on Contentful.

- [Healthcare work permits translation]('https://app.contentful.com/spaces/8k0h54kbe6bj/entries/hwp.application')
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

### Test users

- **Gervimaður Færeyjar 010130-2399**
- **Gervimaður Evrópa 010130-2719**

In order to successfully go through the application the test user has to have a graduated program from HÍ/UNAK that qualifies for a license.
Additionally once a license is given to a test user they no longer qualify and Health Directorate needs to be contacted to remove their license.

### Codeowners

- [Origo]('https://github.com/orgs/island-is/teams/origo')
  - [Baldur Óli]('https://github.com/Ballioli')
