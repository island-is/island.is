# Seminars application for The Administration of Occupational Safety and Health

### Description

The seminars application allows users to register both individuals and groups of individuals to specific seminars. Each application is based on an ID for the seminar which is sent in via link from the Administration of Occupational Safety and Health webpage

### URLs

- [Local](http://localhost:4242/umsoknir/vinnueftirlitid-namskeid)
- [Dev](https://beta.dev01.devland.is/umsoknir/vinnueftirlitid-namskeid)
- [Production](https://island.is/umsoknir/vinnueftirlitid-namskeid)

### Clients, template-api-modules and Domain

- [Client]('https://github.com/island-is/island.is/tree/main/libs/clients/seminars-ver/src/lib/seminars.service.ts')
- [Template-api-module]('https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/aosh/serminars/seminars.service.ts')
- [Domain]('https://github.com/island-is/island.is/blob/main/libs/api/domains/seminars-ver/src/lib/seminars.service.ts')

### States

#### Prerequisite

Data fetching from National Registry, User profile and The Administration of Occupational Safety and Health

#### Draft

In the draft state, the user inputs all names of individuals who want to attend the seminar. If there are any prerequisites for the seminar, then some individuals might be denied access. This is done via the domain layer for each registered individuals where we check if the individual is eligable for the seminar.

#### Completed

User receives confirmation that the list of individuals have been registered for the seminar.

### Localisation

All localisation can be found on Contentful.

- [Seminars translation]('https://app.contentful.com/spaces/8k0h54kbe6bj/entries/aosh.sr.application')
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

### Test users

- All gervimenn should work here

### Codeowners

- [Origo]('https://github.com/orgs/island-is/teams/origo')
  - [Berglind]('https://github.com/berglindoma13')
  - [Sigrún Tinna]('https://github.com/sigruntg')
