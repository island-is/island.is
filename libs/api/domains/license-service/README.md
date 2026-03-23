# API Domains License Service

A layer that provides a single point of entry for all of a users licenses.

### Licenses

The license service returns a generic license that consists of the following parts.

- License type: A license type comes from an exhaustive list of types.
  - e.g. DriversLicense, FirearmLicense, MachineLicense etc...
- Provider: What issuer provides the license.
  - e.g National police commissioner
- Fetch: A status object containing all relevant info about the fetch itself.
- Payload: The actual payload, i.e. the license itself. Might be empty if the user doesn't have a license!

**Currently accepted licenses include**:

- Driving License
- Firearm License
- Machine License
- ADR License
- Disability License
- Hunting license

### Usage

The Api and Xroad services need to be running

- Api
  `Yarn start api`
- XRoad
  `./scripts/run-xroad-proxy.sh`

### Mocking

Mocks are available if switched on.
When a new license is added, don't forget to mock it!

### Adding a new license

1. Generate an external client that fetches the data from a 3rd party
2. Create a client folder in `/license-service/client/` folder
   - Each individual client is a module, so it can be injected into the license service easily. What you need then is:
     - A service that provides the license data.
     - A mapper that transforms and raw specific license data into a generic form.
     - A configuration definition for the service. - All secrets should be kept in the AWS parameter store. Do not use environment files!
     - (optional) Type definitions if required
     - Finally, the module definitions, that provides the everything for injection and exports the service.
3. Add the new license to the relevant types, e.g. `GenericLicenseTypeType``
4. Inject the new internal client into the LicenseService!
   - For digital licenses, you also need to provide the config to the CONFIG_PROVIDER factory function if pkpass is available (so it can retrieve the `passTemplateId` from it)
   - Don't forget to add the new license to the `AVAILABLE_LICENSES` object if it's supposed to be displayed.

### Digital Licenses

The license service offers a service to create a digital license for each applicable license. To do this, it creates a _Pk pass_

The license service currently uses the [SmartSolution API](https://smartsolutions.gitbook.io/smart-solutions-drivers-license/) to generate a pk pass for all applicable licenses, which is the used to provide a digitized license.

To be able to generate a digital license, some conditions need to be met for each license.

- **Drivers License**

  - User has a result when RLS API is called
  - The result has a non-null `mynd` in the result
  - The date of the image is 1997-08-15 or newer

- **Firearm License**

  - The license must not be expired

- **Adr License**

  - The license must not be expired
