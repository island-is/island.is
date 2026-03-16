# clients-social-insurance-administration

This library was generated with [Nx](https://nx.dev).

## Architecture

The client is organised into focused, injectable services. Import `SocialInsuranceAdministrationClientModule` to get access to all of them.

### General services

| Service | Description |
|---------|-------------|
| `SocialInsuranceAdministrationGeneralService` | Anything not covered by the other services: currencies, unions, countries, languages, marital statuses, housing types, etc. |
| `SocialInsuranceAdministrationBankInformationService` | Retrieve and update a user's bank account information |
| `SocialInsuranceAdministrationIncomePlanService` | Income plan conditions, income types, withholding tax, and eligibility |
| `SocialInsuranceAdministrationPaymentPlanService` | Payment plan details and legitimate payment information |
| `SocialInsuranceAdministrationEmploymentService` | Employment status options (locale-aware) |
| `SocialInsuranceAdministrationProfessionService` | Profession and profession activity lookup |
| `SocialInsuranceAdministrationEducationService` | Educational institutions, ECTS units, and education levels by application type |
| `SocialInsuranceAdministrationPensionCalculatorService` | Unauthenticated pension benefit calculations |
| `SocialInsuranceAdministrationDeathBenefitsService` | Spousal data for death benefits applications |
| `SocialInsuranceAdministrationMedicalDocumentsService` | Medical documents: rehabilitation plans, sickness certificates, treatment confirmations |

### Application services (`applicationServices/`)

Each service in this folder is a **one-stop shop for a specific application type** — it owns all API calls that are specific to that application. Because many TR API methods are generic and untyped, these services provide explicitly-typed wrappers so that consumers only need to inject the right service with no ambiguity.

| Service | Application |
|---------|-------------|
| `SocialInsuranceAdministrationGeneralApplicationService` | Shared application logic used by all application types: submission, applicant info, eligibility, and document management |
| `SocialInsuranceAdministrationDisabilityPensionService` | Disability pension — certificates, eligibility, and self-assessment questionnaires |
| `SocialInsuranceAdministrationMedicalAndRehabilitationService` | Medical and rehabilitation payments — application submission, metadata, and self-assessment questionnaires |

#### Adding a new application service

Follow these steps when adding support for a new application type:

1. **Add shared API methods to the appropriate general service** — if the method is needed across multiple applications, add it there. Consider deprecating any old equivalent.
2. **Register the application slug** — add an `<APPLICATION_NAME>_APPLICATION_SLUG` constant to `src/lib/constants.ts` with the string value the TR API expects.
3. **Create the application service** — add `<applicationName>.service.ts` in `applicationServices/`. This service:
   - Injects `SocialInsuranceAdministrationGeneralApplicationService` (and any other general services it needs).
   - Exposes explicitly-typed methods (e.g. `sendApplication`) that call the general service with the slug constant.
   - Contains **every** method specific to that application — nothing application-specific should live in the general services.
4. **Register the service** in `SocialInsuranceAdministrationClientModule` (providers + exports) and export it from `src/index.ts`.
5. **Consuming code** — application template API modules inject the scoped application service. Domain resolvers should inject the categorical general services instead.

### Deprecated

`SocialInsuranceAdministrationClientService` is a monolithic service kept for backwards compatibility. Prefer the focused services above for new work.

### API versions

- **v1** — X-Road path configured via `XROAD_TR_PATH` (default: `IS-DEV/GOV/10008/TR-Protected/external-v1`)
- **v2** — X-Road path configured via `XROAD_TR_PATH_V2` (default: `IS-DEV/GOV/10008/TR-Protected/external-v2`)

## Running unit tests

Run `nx test clients-social-insurance-administration` to execute the unit tests via [Jest](https://jestjs.io).

## Code generation for client types and endpoints

`yarn nx run clients-social-insurance-administration:update-openapi-document`

`yarn nx run clients-social-insurance-administration:codegen/backend-client`
