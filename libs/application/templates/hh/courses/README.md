# Course registrations for Heilsugæsla höfuðborgarsvæðisins

## Description

This application lets users register one or more participants for HH courses.

The form supports:

- Selecting a course and course instance (date/time)
- Registering participant details
- Paying for a course (some courses are free though)

Course and translation content is managed in Contentful.

### URLs

- [Local](http://localhost:4242/umsoknir/hh-namskeid)
- [Dev](https://beta.dev01.devland.is/umsoknir/hh-namskeid)
- [Production](https://island.is/umsoknir/hh-namskeid)

### Clients, template-api-modules and Domain

- [Template API module](https://github.com/island-is/island.is/tree/main/libs/application/template-api-modules/src/lib/modules/templates/hh/courses)

### State Flow

#### Prerequisites

Loads required data from National Registry, User Profile, Health Center API, and course information is fetched from the CMS.

#### Draft

The applicant fills in course, participant, and payer information and submits the registration.

#### Payment

If the selected course instance has a charge item, the application goes through the payment step before completion.

#### Completed

Shows a confirmation view and submits the registration data to external processing in Zendesk.

#### Fully booked

If the selected course instance is fully booked, the application ends in a dedicated fully booked state.

### Preselection via Query Parameter

The template supports preselecting course and course instance through the template `selection` query parameter.

### Localisation

Translations are managed in Contentful:

- [HH courses translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/hh.courses.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

### Test users

- All gervimenn work on dev

### Codeowners

- [Stefna](https://github.com/orgs/island-is/teams/Stefna)
  - [Rúnar Vestmann](https://github.com/runarvestmann)
