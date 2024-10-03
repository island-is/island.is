# European Health Insurance Card

Application for the European Health Insurance Card when traveling abroad.

This library was generated with [Nx](https://nx.dev).

## Application Flow

- The application has five states: PREREQUISITES, DRAFT, COMPLETED, DECLINED & NOAPPLICANTS.
- Upon submission, the state changes to COMPLETED.
  - Applicants receive either a plastic ES card to their address and/or a PDF temporary card to their digital mailbox.
  - Applicants without health insurance are redirected to the DECLINED state.
  - If applicants already possess an ES card and PDF, they are redirected to the NOAPPLICANTS state.

## Running Unit Tests

Run `nx test application-templates-european-health-insurance-card` to execute unit tests via [Jest](https://jestjs.io).

### Additional Environment Variables

Set the environment variable `EHIC_XROAD_PROVIDER_ID` to the required X-ROAD path for the EHIC API. It defaults to `IS-DEV/GOV/10007/SJUKRA-Protected/ehic/`.

### Scope and Token Exchange

Calls to the EHIC API utilize token exchange with the scope `europeanHealthInsuranceCard`, defined as `@sjukra.is/sjukratryggingakort`.

## Setup

To start the application system, follow the handbook instructions [here](https://docs.devland.is/apps/application-system). The application will be accessible at `https://{host}/umsoknir/evropska-sjukratryggingakortid`.

### Translations from Contentful

Fetch development secrets:

- Run `yarn get-secrets api`

## Code Owners and Maintainers

- [Fuglar](https://github.com/orgs/island-is/teams/fuglar)