```markdown
# European Health Insurance Card

Application for the European Health Insurance Card when traveling abroad

This library was generated with [Nx](https://nx.dev).

## Application Flow

- The application has five states: PREREQUISITES, DRAFT, COMPLETED, DECLINED, and NOAPPLICANTS.
- Upon submission, the application's state changes automatically to COMPLETED.
  - Applicants receive a plastic European Health Insurance Card at their address and/or a PDF temporary card in their digital mailbox.
  - If applicants do not have valid health insurance, they will enter the DECLINED state.
  - If applicants already possess an EHIC card and PDF, they will transition to the NOAPPLICANTS state.

## Running Unit Tests

Run `nx test application-templates-european-health-insurance-card` to execute the unit tests using [Jest](https://jestjs.io).

### Additional Environment Variables

Ensure the environment variable `EHIC_XROAD_PROVIDER_ID` is set to the correct X-ROAD path for the EHIC API. The default is: `IS-DEV/GOV/10007/SJUKRA-Protected/ehic/`.

### Scope and Token Exchange

The EHIC API uses token exchange, requiring a scope specified as 'europeanHealthInsuranceCard', which is currently defined as '@sjukra.is/sjukratryggingakort'.

## Setup

To start the application system, follow the instructions in the handbook [here](https://docs.devland.is/apps/application-system).
The application will be accessible via: https://{host}/umsoknir/evropska-sjukratryggingakortid

### Translations from Contentful

Fetch development secrets by running:

- `yarn get-secrets api`

## Code Owners and Maintainers

- [Fuglar](https://github.com/orgs/island-is/teams/fuglar)
```
