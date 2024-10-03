# API Domains License Service

A centralized entry point for managing user licenses.

### Licenses

The license service returns a generic license consisting of:

- **License Type**: From a predefined list.
  - e.g., DriversLicense, FirearmLicense, etc.
- **Provider**: The issuer of the license.
  - e.g., National police commissioner
- **Fetch**: Status object with fetch details.
- **Payload**: Actual license data, may be empty if no license exists.

**Accepted Licenses**:

- Driving License
- Firearm License
- Machine License
- ADR License
- Disability License

### Usage

Ensure API and XRoad services are running:

- API: `Yarn start api`
- XRoad: `./scripts/run-xroad-proxy.sh`

### Mocking

Enable mocks when needed. Mock new licenses when added.

### Adding a New License

1. Generate an external client to fetch data from a third party.
2. Create a client folder in `/license-service/client/`:
   - Each client is a module for easy injection:
     - A service for license data.
     - A mapper for data transformation.
     - Configuration; keep secrets in AWS parameter store.
     - (Optional) Type definitions.
     - Module definitions for injections and exports.
3. Add new license to relevant types, e.g., `GenericLicenseTypeType`.
4. Inject new client into LicenseService:
   - For digital licenses, configure the CONFIG_PROVIDER for `passTemplateId`.
   - Add to `AVAILABLE_LICENSES` if display is required.

### Digital Licenses

The service can create digital licenses via a _Pk pass_ using the [SmartSolution API](https://smartsolutions.gitbook.io/smart-solutions-drivers-license/).

Conditions for generating a digital license:

- **Drivers License**:
  - Valid RLS API result with non-null `mynd`.
  - Image date ≥ 1997-08-15.

- **Firearm License**:
  - Must be valid (not expired).

- **Adr License**:
  - Must be valid (not expired).