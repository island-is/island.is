<!-- gitbook-ignore -->

# API Domains License Service

## Licenses

A license has the following parts: ...

### Driving license

Uses RLS API via xroad to get drivers licenses by national id.

Uses [SmartSolution API](https://smartsolutions.gitbook.io/smart-solutions-drivers-license/) to generate pkpass for digital drivers licenses.

#### Digital

To be able to generate a digital drivers license, all of the following has to be true

- User has a result when RLS API is called
- The result has a non-null `mynd` in the result
- The date of the image is 1997-08-15 or newer
