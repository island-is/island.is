<!-- gitbook-ignore -->

# API Domains License Service

A layer that provides a single point of entry for all of a users licenses.

## Licenses

The license service returns a generic license that consists of the following parts.

- License type: A license type comes from an exhaustive list of types.
  - e.g. DriversLicense, FirearmLicense, MachineLicense etc...
- Provider: What issuer provides the license.
  - e.g National police commisioner
- Fetch: A status object containing all relevant info about the fetch itself.
- Payload: The actual payload, i.e. the license itself. Might be empty if the user doesn't have a license!

**Currently accepted licenses include**:

- Driving License
- Firearm License
- Machine License
- ADR License

## Usage

The Api and Xroad services need to be running

- Api
  `Yarn start api`
- XRoad
  `./scripts/run-xroad-proxy.sh`

### Digital Licenses

The license service offers a service to create a digital license for each applicable license. To do this, it creates a _Pk pass_

The license service currently uses the [SmartSolution API](https://smartsolutions.gitbook.io/smart-solutions-drivers-license/) to generate a pk pass for all applicable licenses, which is the used to provide a digitized license.

To be able to generate a digital license, some conditions need to be met for each license.

- **Drivers License**

  - User has a result when RLS API is called
  - The result has a non-null `mynd` in the result
  - The date of the image is 1997-08-15 or newer

- **Firearm License**

  - The license mustn't be expired

- **Adr License**

  - The license mustn't be expired
