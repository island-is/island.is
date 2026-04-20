# European Health Insurance Card

Application for the European Health Insurance card when traveling abroad

## Application flow:

- Application has 5 states, PREREQUISITES, DRAFT, COMPLETED, DECLINED & NOAPPLICANTS
- When applicant submits his application the state automatically changes to COMPLETED.
  - The applicants receive a plastic ES card to their address and / or a pdf temporary card to their digital mailbox.
  - If applicants do not have an health insurance, they will be redirected to a Declined state.
  - If applicants already have an ES card and a PDF they will be redirected to a NOAPPLICANTS state.

## Running unit tests

Run `nx test application-templates-european-health-insurance-card` to execute the unit tests via [Jest](https://jestjs.io).

### Additional Environment variables

The following environment variable must be set, 'EHIC_XROAD_PROVIDER_ID', to the appropriate X-ROAD path for the EHIC API. It defaults to: 'IS-DEV/GOV/10007/SJUKRA-Protected/ehic/',

### Scope and TokenExchange

Calls to the EHIC API uses token exchange with a scope named 'europeanHealthInsuranceCard' as defined now as '@sjukra.is/sjukratryggingakort'

## Setup

To start the application system, follow the instructions in the handbook [here](https://docs.devland.is/apps/application-system).
The application will be accessible under the path https://{host}/umsoknir/evropska-sjukratryggingakortid

### Translations from Contentful

Fetch development secrets

- Run `yarn get-secrets api`

## Code owners and maintainers

- [Fuglar](https://github.com/orgs/island-is/teams/fuglar)
