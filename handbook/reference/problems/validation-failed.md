# 400 Validation Failed

The server will not process the request due to validation issues around some of the input arguments.

The client can try again after fixing the indicated validation issues.

## Extra metadata

### `fields`

A JSON object listing validation issues where the key is the name of the field and the value is validation issue. These fields should refer to the primary entity being validated by the endpoint, for instance query parameters for GET requests, request body for POST requests.

For nested input objects, the server can either use nested objects (`{ "person": { "lastName": "Issue" } }` or the path to the field (`{ "person.lastName": "Issue" }`).

These validation issues should be written in such a way that they can be presented to the user. As such, they should be localized according to the user locale, for example using the Accept-Language header.

## Example

```
400 Validation Failed
Content-Type: application/problem+json

{
  "type": "https://docs.devland.is/reference/problems/validation-failed",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Found issues in these fields: email",
  "fields": {
    "email": "Email address must contain @."
  }
}
```
