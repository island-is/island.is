# API Domains License Service

A layer that provides a single point of entry for all user licenses.

## Licenses

The License Service returns a generic license with the following components:

- **License Type**: A type from an exhaustive list, e.g., `DriversLicense`, `FirearmLicense`, `MachineLicense`, etc.
- **Provider**: The issuer of the license, e.g., National police commissioner.
- **Fetch**: A status object with all relevant information about the license fetch process.
- **Payload**: The actual license data. This might be empty if the user does not possess the license.

**Currently accepted license types include**:

- Driving License
- Firearm License
- Machine License
- ADR License
- Disability License

## Usage

The API and XRoad services need to be running:

- API: `yarn start api`
- XRoad: `./scripts/run-xroad-proxy.sh`

## Mocking

Mocks are available if enabled. When adding a new license, ensure it is also mocked.

## Adding a New License

1. Generate an external client to fetch data from a third party.
2. Create a client folder in `/license-service/client/`.
   - Each client acts as a module for easy injection into the License Service. Required components:
     - A service to provide license data.
     - A mapper to transform raw license data into a generic form.
     - A configuration definition for the service. Store all secrets in the AWS parameter store. Avoid using environment files!
     - (Optional) Type definitions, if necessary.
     - Module definitions to enable injection and export the service.

3. Add the new license to the relevant types, e.g., `GenericLicenseTypeType`.
4. Inject the new internal client into the LicenseService.
   - For digital licenses, add the configuration to the `CONFIG_PROVIDER` factory function if pkpass is available, to retrieve the `passTemplateId`.
   - Ensure the new license is added to the `AVAILABLE_LICENSES` object if it should be displayed.

## Digital Licenses

The License Service provides functionality to create a digital license for applicable licenses by generating a _PK Pass_.

The service currently uses the [SmartSolution API](https://smartsolutions.gitbook.io/smart-solutions-drivers-license/) to create a PK Pass, enabling the digital license format.

Conditions for generating a digital license:

- **Drivers License**
  - There must be a result when the RLS API is called.
  - The result must include a non-null `mynd`.
  - The image date should be 1997-08-15 or newer.

- **Firearm License**
  - The license must not be expired.

- **ADR License**
  - The license must not be expired.