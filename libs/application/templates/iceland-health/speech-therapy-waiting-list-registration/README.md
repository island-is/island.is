# Speech therapy waiting list registration

## Description

Application for guardians of a child on Sjúkratryggingar Íslands' (Icelandic Health Insurance) waiting list for speech therapy. The guardian either confirms the child's place on the waiting list and chooses preferences for the therapy, or declines the place.

The application is gated behind the `isSpeechTherapyWaitingListRegistrationEnabled` feature flag.

## URLs

- [Local](http://localhost:4242/umsoknir/skraning-a-bidlista-talmeinathjalfunar)
- [Dev](https://beta.dev01.devland.is/umsoknir/skraning-a-bidlista-talmeinathjalfunar)
- [Production](https://island.is/umsoknir/skraning-a-bidlista-talmeinathjalfunar)

## Clients and template-api-modules

- [Client](../../../../clients/icelandic-health-insurance/speech-therapy)
- [Template-api-module](../../../template-api-modules/src/lib/modules/templates/iceland-health/speech-therapy-waiting-list-registration)

Calls go through X-Road to Sjúkratryggingar, with token exchange for the `@sjukra.is/speech-waiting-list` scope.

The languages, locations, speech pathologists and rejection reasons are currently dummy data in the template API module until the Sjúkratryggingar endpoints are ready.

## States

### Prerequisites

Fetches the applicant from the National Registry, the user profile, the applicant's children who are on the waiting list, and the lists of languages, locations, speech pathologists and rejection reasons from Sjúkratryggingar. The applicant then selects a child.

A user who has no child on the waiting list is stopped in this step with an error.

### Draft

The applicant reviews the child's information and chooses whether to keep the child's place on the waiting list.

- If yes, the applicant fills in guardian contact information and preferences (languages, locations, speech pathologist and remote therapy).
- If no, the applicant gives a reason for declining.

### Completed

On entry, the application is sent to Sjúkratryggingar. The waiting list entry is updated if the applicant accepted, or rejected if the applicant declined.

## Localisation

All localisation can be found on Contentful.

- [Speech therapy waiting list registration translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/stwlr.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

## Test users

Sjúkratryggingar has added the following gervimenn to their endpoints. Log in as one of the guardians to start an application for the child.

| Role     | Name                        | Kennitala   |
| -------- | --------------------------- | ----------- |
| Child    | Sabah ÞÍ Sveinsdóttir       | 310318-1400 |
| Guardian | Einar Ingi ÞÍ Enesson Cogic | 190383-1489 |
| Guardian | Ljósbrá ÞÍ Lulic            | 290783-1439 |

## Running unit tests

Run `nx test application-templates-speech-therapy-waiting-list-registration` to execute the unit tests via [Jest](https://jestjs.io).

## Code owners and maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte)
