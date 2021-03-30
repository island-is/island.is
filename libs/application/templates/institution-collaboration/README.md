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

- Local application URL: [http://localhost:4242/umsoknir/samstarf](http://localhost:4242/umsoknir/samstarf)

#### Configure AWS

- You have access to the `island-is-development01` AWS account
- Run `aws configure`
- Region should be set to `eu-west-1`
- Output should be set to `json`
- Add `aws_access_key_id`, `aws_secret_access_key` and `aws_session_token` from `island-is-development01` to your AWS credentials file `~/.aws/credentials`
- Or export them manually in the terminal

### Additional Environment variables

- You need to set few additional in order to submitting the application locally:
- Recipient email address: `INSTITUTION_APPLICATION_RECIPIENT_EMAIL_ADDRESS=`example@dev.is
- Sender email address: `INSTITUTION_APPLICATION_SENDER_EMAIL_ADDRESS=`example@dev.is
- Upload bucket for attachments: `FILE_STORAGE_UPLOAD_BUCKET=`bucket-name

### Translations from Contentful

Fetch development secrets

- Run `yarn get-secrets api`

## Code owners and maintainers

- [Sendiráðið](https://github.com/orgs/island-is/teams/sendiradid)
