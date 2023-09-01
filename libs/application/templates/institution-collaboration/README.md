# Institution Collaboration

This application helps institutions to request Stafrænt Ísland to collaborate on a new application.

## Application flow:

- Application has 2 states, DRAFT & APPROVED
- When applicant submits his application the state automatically changes to APPROVED.
  - Stafrænt Ísland's contact personnel recevies the application in email, and manually reviews it.
  - The applicant receives a copy of the application in email but is also able to revisit the application and view the summary page at any time.

## Running unit tests

Run `nx test application-templates-institution-collaboration` to execute the unit tests via [Jest](https://jestjs.io).

## Setup

To start the application system, follow the instructions in the handbook [here](../../../../apps/application-system/README.md).

### Additional Environment variables

- You need to set few additional in order to submitting the application locally:
- Recipient email name: `INSTITUTION_APPLICATION_RECIPIENT_NAME=`Recipient Name
- Recipient email address: `INSTITUTION_APPLICATION_RECIPIENT_EMAIL_ADDRESS=`example@dev.is
- Application sender email name: `EMAIL_FROM_NAME=`Sender Name
- Application sender email address: `EMAIL_FROM=`example@dev.is
- Upload bucket for attachments: `FILE_STORAGE_UPLOAD_BUCKET=`bucket-name

### Translations from Contentful

Fetch development secrets

- Run `yarn get-secrets api`

## Code owners and maintainers

- [Fuglar](https://github.com/orgs/island-is/teams/fuglar)
- [Norda](https://github.com/orgs/island-is/teams/norda)
