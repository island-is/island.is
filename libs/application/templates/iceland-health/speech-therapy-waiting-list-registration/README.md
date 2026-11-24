# Speech therapy waiting list registration

## Description

Application for guardians of a child on Sjúkratryggingar Íslands' (Icelandic Health Insurance) waiting list for speech therapy. The guardian either confirms the child's place on the waiting list and chooses preferences for the therapy, or declines the place.

The application is gated behind the `isSpeechTherapyWaitingListRegistrationEnabled` feature flag.

Only the dev environment is connected to Sjúkratryggingar. Keep the feature flag off in staging and production until Sjúkratryggingar connect those environments.

## URLs

- [Local](http://localhost:4242/umsoknir/skraning-a-bidlista-talmeinathjalfunar)
- [Dev](https://beta.dev01.devland.is/umsoknir/skraning-a-bidlista-talmeinathjalfunar)
- [Production](https://island.is/umsoknir/skraning-a-bidlista-talmeinathjalfunar)

## Clients and template-api-modules

- [Client](../../../../clients/icelandic-health-insurance/speech-therapy)
- [Template-api-module](../../../template-api-modules/src/lib/modules/templates/iceland-health/speech-therapy-waiting-list-registration)

## Integrations

### Sjúkratryggingar

Calls go through X-Road to Sjúkratryggingar's `speech` service (`IS-DEV/GOV/10007/SJUKRA-Protected/speech` in dev). Only the `/v1/digital-iceland` endpoints are used:

| Endpoint                                                 | Used for                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| `GET /v1/digital-iceland/entries/{kennitala}/verify`     | Checks whether a child is awaiting the guardian's approval   |
| `GET /v1/digital-iceland/languages`                      | Language options                                             |
| `GET /v1/digital-iceland/available-locations`            | Location options                                             |
| `GET /v1/digital-iceland/speech-pathologists`            | Speech pathologist options                                   |
| `GET /v1/digital-iceland/rejection-reasons`              | Reasons for declining                                        |
| `PUT /v1/digital-iceland/entries/{kennitala}`            | Accepts the waiting list entry with the chosen preferences   |
| `PUT /v1/digital-iceland/entries/{kennitala}/reject`     | Declines the waiting list entry                              |

Every call needs both:

- a token with the `@sjukra.is/speech-waiting-list` scope, from token exchange
- an `ApiKey` header, read from `XROAD_HEALTH_INSURANCE_SPEECH_THERAPY_API_KEY`

`verify` returns `204` when the child is on the waiting list and the user is the child's guardian, `404` when the child is not on the waiting list, and `403` when the user is not the child's guardian.

### Þjóðskrá

The applicant's children are fetched from Þjóðskrá (`childrenCustodyInformation`), with each child's address. Only the child's kennitala, name and address are stored in the application.

## States

### Prerequisites

Fetches the applicant's children from Þjóðskrá and keeps only those that `verify` reports as awaiting approval. Also fetches the lists of languages, locations, speech pathologists and rejection reasons from Sjúkratryggingar. The applicant then selects a child.

An applicant with no child awaiting approval is stopped in this step with the error "Ekkert barn bíður samþykkis".

### Draft

The applicant reviews the child's information and chooses whether to keep the child's place on the waiting list.

- If yes, the applicant chooses preferences:
  - languages (at least one is required)
  - locations
  - a speech pathologist (optional; choosing one requires confirming that the wait can be longer)
  - remote therapy
- If no, the applicant chooses a reason for declining from Sjúkratryggingar's rejection reasons.

### Completed

On entry, the application is sent to Sjúkratryggingar. The waiting list entry is accepted with the chosen preferences, or rejected with the chosen reason.

Only a child that `verify` approved in the prerequisites step is sent. The kennitala is taken from the verified children in external data, not from the answers.

One guardian's answer is enough. Once one guardian has answered, the entry is no longer awaiting approval, so the other guardian gets `404` from Sjúkratryggingar and cannot submit.

## Setup

See the [application-system](../../../../../apps/application-system/README.md) setup on how to get started. In addition, run `yarn get-secrets application-system-api` to fetch the secrets, including the Sjúkratryggingar API key (`XROAD_HEALTH_INSURANCE_SPEECH_THERAPY_API_KEY`).

If token exchange fails with `invalid_scope`, check that the local IDS client `@island.is/clients/dev` has the `@sjukra.is/speech-waiting-list` scope in the dev IDS admin portal.

## Localisation

All localisation can be found on Contentful.

- [Speech therapy waiting list registration translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/stwlr.application)
- [UI forms translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/uiForms.application)

When adding new text strings to the messages files, sync them to Contentful:

```bash
yarn nx run application-templates-speech-therapy-waiting-list-registration:extract-strings
```

For more info see [message extraction](../../../../localization/README.md#message-extraction).

## Test users

Sjúkratryggingar has added the following gervimenn to their endpoints. Log in as one of the guardians to start an application for the child.

| Role     | Name                        | Kennitala   |
| -------- | --------------------------- | ----------- |
| Child    | Sabah ÞÍ Sveinsdóttir       | 310318-1400 |
| Guardian | Einar Ingi ÞÍ Enesson Cogic | 190383-1489 |
| Guardian | Ljósbrá ÞÍ Lulic            | 290783-1439 |

Once one guardian has submitted, the child is no longer awaiting approval. Ask Sjúkratryggingar to put the child back on the waiting list before testing again.

## Running unit tests

The unit tests are in the template API module:

```bash
yarn test application-template-api-modules --testFile=libs/application/template-api-modules/src/lib/modules/templates/iceland-health/speech-therapy-waiting-list-registration
```

## Code owners and maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte)
