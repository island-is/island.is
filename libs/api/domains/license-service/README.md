# API Domains License Service

## Licenses

A license has the following parts: ...

### Driving license

Uses RLS API via xroad to get drivers licenses by national id.

Uses [SmartSolution API](https://app.gitbook.com/@smartsolutions/s/smart-solutions-drivers-license/drivers-license#generate-drivers-license-v2) to generate pkpass for digital drivers licenses.

To be able to generate a digital drivers license, all of the following has to be true

- User has a result when RLS API is called
- The result has a non-null `mynd` in the result
- The date of the image is 1997-08-15 or newer
