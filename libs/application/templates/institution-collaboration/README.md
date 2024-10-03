```markdown
# Institution Collaboration

This application assists institutions in requesting collaboration with Stafrænt Ísland for developing a new application.

## Application Flow

- The application has two states: DRAFT and APPROVED.
- Upon submission by the applicant, the state automatically changes to APPROVED.
  - Stafrænt Ísland's contact personnel receives the application via email and manually reviews it.
  - The applicant receives a copy of the application via email but can also revisit the application to view the summary page at any time.

## Running Unit Tests

Execute `nx test application-templates-institution-collaboration` to run the unit tests using [Jest](https://jestjs.io).

## Setup

To start the application system, please follow the instructions in the handbook [here](../../../../apps/application-system/README.md).

### Additional Environment Variables

You need to set a few additional variables to submit the application locally:

- Recipient email name: `INSTITUTION_APPLICATION_RECIPIENT_NAME=Recipient Name`
- Recipient email address: `INSTITUTION_APPLICATION_RECIPIENT_EMAIL_ADDRESS=example@dev.is`
- Application sender email name: `EMAIL_FROM_NAME=Sender Name`
- Application sender email address: `EMAIL_FROM=example@dev.is`
- Upload bucket for attachments: `FILE_STORAGE_UPLOAD_BUCKET=bucket-name`

### Translations from Contentful

To fetch development secrets, run:

- `yarn get-secrets api`

## Code Owners and Maintainers

- [Fuglar](https://github.com/orgs/island-is/teams/fuglar)
- [Norda](https://github.com/orgs/island-is/teams/norda)
```
