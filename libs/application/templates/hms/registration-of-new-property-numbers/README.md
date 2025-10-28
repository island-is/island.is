# Registration of new property numbers

### Description

Application for registering new property numbers. We fetch properties for logged in user in prereq section, user select for which property that want to register more property numbers and how many. User pays per new property numbers. This application goes into the hands of HMS and then to a district commisioner, Island.is handles only the selection process and payment.

### URLs

- [Local](http://localhost:4242/umsoknir/skraning-fasteignanumera/)
- [Dev](https://beta.dev01.devland.is/umsoknir/skraning-fasteignanumera)
- [Production](https://island.is/umsoknir/skraning-fasteignanumera/)

### Clients and template-api-modules

- [Client](https://github.com/island-is/island.is/tree/main/libs/application/template-api-modules/src/libs/clients/hms-application-system/src/index.ts)
- [Template-api-module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/hms/registration-of-new-property-numbers/registration-of-new-property-numbers.service.ts)

### States

#### Prerequisite

Data fetching the user information and the logged in users properties from HMS. Prereq also has a second screen for the user to accept HMS's conditions

#### Draft

User confirms applicants information and assigns a contact for the application, this is followed by choosing a property in which to register more property numbers and how many, optionally user can give a text explanation for additional comments. Followed is a overview screen before going into payment

#### Payment

ARK payment step

#### Completed

User has paid for and submitter the application to HMS. The process is now in HMS's hands but incomplete as HMS sends the application to the district commissioner

### Localisation

All localisation can be found on Contentful.

- [Registration of new property number translation]('https://app.contentful.com/spaces/8k0h54kbe6bj/entries/ronp.application')
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

### Test users

- **Gervimaður Færeyjar 010130-2399**

Gervimaður Færeyja can be used for the individual testing and for delegation of a company use "Hugbúnaðarhús Daníels ehf."

### Codeowners

- [Origo]('https://github.com/orgs/island-is/teams/origo')
  - [Baldur Óli]('https://github.com/Ballioli')
