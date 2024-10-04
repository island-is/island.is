# API Domains License Service

A centralized system for managing user licenses.

### Licenses

The license service returns a generic license including:

- **License Type**: Predefined categories, e.g., DriversLicense, FirearmLicense.
- **Provider**: Issuer, e.g., National police commissioner.
- **Fetch**: Status object with details.
- **Payload**: License data; can be empty.

**Accepted Licenses**:

- Driving License
- Firearm License
- Machine License
- ADR License
- Disability License

### Usage

Ensure the following services are running:

- API: `yarn start api`
- XRoad: `./scripts/run-xroad-proxy.sh`

### Mocking

Enable mocks as needed. Mock newly added licenses.

### Adding a New License

1. Create an external client to fetch data.
2. Create a client folder in `/license-service/client/`:
   - Module for injection, consisting of:
     - License data service.
     - Data mapper.
     - Configuration; store secrets in AWS parameter store.
     - (Optional) Type definitions.
     - Module definitions for injections/exports.
3. Update types, e.g., `GenericLicenseTypeType`.
4. Inject the new client into LicenseService:
   - Configure CONFIG_PROVIDER for `passTemplateId` for digital licenses.
   - Add to `AVAILABLE_LICENSES` if display is required.

### Digital Licenses

The service generates digital licenses using the _Pk pass_ through the [SmartSolution API](https://smartsolutions.gitbook.io/smart-solutions-drivers-license/).

Conditions for generating a digital license:

- **Drivers License**:
  - Valid RLS API result with non-null `mynd`.
  - Image date ≥ 1997-08-15.
  
- **Firearm License**:
  - Must be valid (not expired).

- **ADR License**:
  - Must be valid (not expired).