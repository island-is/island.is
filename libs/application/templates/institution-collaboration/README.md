# Institution Collaboration

This application helps institutions to request Stafrænt Ísland to collaborate on a new application.

## Application flow:

- Application has 2 states, DRAFT & APPROVED
- When applicant submits his application the state automacally changes to APPROVED.
  - Stafrænt Ísland's contact personnel recevies the application in email, and manually reviews it.
  - The applicant receives a copy of the application in email but is also able to revisit the application and view the summary page at any time.

## Running unit tests

Run `nx test application-templates-institution-collaboration` to execute the unit tests via [Jest](https://jestjs.io).

## Setup

To start the application system, follow the instructions in the handbook [here](https://docs.devland.is/handbook/apps/application-system).

### Additional Environment variables

- You need to set few additional in order to submitting the application locally:
- Recipient email name: `EMAIL_REPLY_TO_NAME=`Recipient Name
- Recipient email address: `EMAIL_REPLY_TO=`example@dev.is
- Application sender email name: `EMAIL_FROM_NAME=`Sender Name
- Application sender email address: `EMAIL_FROM=`example@dev.is
- Upload bucket for attachments: `FILE_STORAGE_UPLOAD_BUCKET=`bucket-name

### Translations from Contentful

Fetch development secrets

- Run `yarn get-secrets api`

## Code owners and maintainers

- [Sendiráðið](https://github.com/orgs/island-is/teams/sendiradid)
