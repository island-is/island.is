# Institution Collaboration

This application allows institutions to request collaboration from Stafrænt Ísland for new projects.

## Application Flow

- Two states: DRAFT & APPROVED
- Upon submission, the state changes to APPROVED.
  - Stafrænt Ísland personnel receive the application via email for review.
  - Applicants receive a copy via email and can access the summary page anytime.

## Running Unit Tests

Execute `nx test application-templates-institution-collaboration` to run unit tests using [Jest](https://jestjs.io).

## Setup

Follow the handbook instructions [here](../../../../apps/application-system/README.md) to start the application system.

### Environment Variables

To submit applications locally, set these variables:

- `INSTITUTION_APPLICATION_RECIPIENT_NAME=` Recipient Name
- `INSTITUTION_APPLICATION_RECIPIENT_EMAIL_ADDRESS=` <example@dev.is>
- `EMAIL_FROM_NAME=` Sender Name
- `EMAIL_FROM=` <example@dev.is>
- `FILE_STORAGE_UPLOAD_BUCKET=` bucket-name

### Translations from Contentful

Fetch development secrets with:

```bash
yarn get-secrets api
```

## Code Owners and Maintainers

- [Fuglar](https://github.com/orgs/island-is/teams/fuglar)
- [Norda](https://github.com/orgs/island-is/teams/norda)
