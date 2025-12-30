# Course registrations for Heilsugæsla höfuðborgarsvæðisins

## Description

The course registration application allows users to register both individuals and groups of individuals to specific courses.

### URLs

- [Local](http://localhost:4242/umsoknir/hh-namskeid)
- [Dev](https://beta.dev01.devland.is/umsoknir/hh-namskeid)
- [Production](https://island.is/umsoknir/hh-namskeid)

### Clients, template-api-modules and Domain

- [Template-api-module](https://github.com/island-is/island.is/blob/946aae49282209400527a0d648ebd623a8570006/libs/application/template-api-modules/src/lib/modules/templates/hh/courses)

### States

#### Prerequisite

Data fetching from National Registry, User profile and course information is fetched from the CMS.

#### Draft

In the draft state, the user inputs all names of individuals who want to attend the course.

#### Completed

User receives confirmation that the list of individuals have been registered for the course and information about the course registration gets sent to Zendesk.

### Localisation

All localisation can be found on Contentful.

- [HH courses translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/hh.courses.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

### Test users

- All gervimenn should work here

### Codeowners

- [Stefna](https://github.com/orgs/island-is/teams/Stefna)
  - [Rúnar Vestmann](https://github.com/runarvestmann)
