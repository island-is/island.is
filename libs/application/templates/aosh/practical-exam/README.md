# Practical Exam for The Administration of Occupational Safety and Health

## Description

The Practical Exam application allows both individual users
and users with company delegations to register individual for
practical exams. Application flow is simplified for users that
choose to register themselves only.

## URLs

- [Local](http://localhost:4242/umsoknir/verklegt-prof)
- [Dev](https://beta.dev01.devland.is/umsoknir/verklegt-prof)
- [Production](https://island.is/umsoknir/verklegt-prof)

## Clients and template-api-modules

- [Client]('https://github.com/island-is/island.is/tree/main/libs/clients/practical-exams-ver/src/lib/practicalExams.service.ts)
- [Template-api-module]('https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/aosh/practical-exam/practical-exam.service.ts')

## States

### Prerequisite

Data fetching from National Registry, User profile
and The Administration of Occupational Safety and Health

### Draft

The application begins with the personal information screen, where the user selects whether they're registering only themselves or multiple examinees. This choice slightly alters the application flow. Solo registrations follow a simpler process and include more detailed error messages (for GDPR compliance).

Next, the user selects examinees or confirms their own information. At this stage, we perform a basic validation via VER web services to ensure all examinees are eligible for at least one exam.

The instructor selection screen follows. Here, we validate instructors with VER to confirm their eligibility. The main matching screen then connects each examinee with their intended exams and designated instructors, including further VER validation.

The user then selects the exam location and registers a contact person.

On the payment screen, direct payment is the default. If registering on behalf of a company, users can opt for invoicing instead.

Finally, the application presents an overview before submitting the completed data to VER.

### Completed

Information of what happens next, process is now in VER's hands.

## Localisation

All localisation can be found on Contentful.

- [Practical Exam translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/aosh.pe.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

## Test users

- **Gervimaður Bretland 010130-2429 as Examinee (J category)**
- **Gervimaður Ameríka 010130-2989 as Instructor**
- **If more users are required or different categories contact VER**

## Codeowners

- [Origo]('https://github.com/orgs/island-is/teams/origo')
  - [Baldur Óli]('https://github.com/Ballioli')
