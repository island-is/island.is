# 400 500 Template API Error

The server will not process the request due to various reasons provided by the applicaiton template api being requested.
The client can try again after fixing the indicated validation issues.

## Extra metadata

### `errorReason`

A ProviderErrorReason is a union type with a localized title and summary or a single localized string. These messages should be informative to the client. Custom error codes provide the client with information
on the severity of the error. 400 errors should be expected. (eg. the client does not meet requirements of the api and must act accordingly).

## Example

```
400-500 Template api error
Content-Type: application/problem+json

{
  "type": "https://docs.devland.is/reference/problems/validation-failed",
  "title": "Application TemplateApi Error",
  "status": 400-500,
  "errorReason": {
    "title": "Error Title"
    "summary" : "Detailed error message"
  } | "Error message"
}
```
