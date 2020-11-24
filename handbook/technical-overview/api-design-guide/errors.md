# Error Handling

This document describes how REST APIs should present errors to clients consuming their services.

When an error occurs in a API, the service should return the error to the calling client in an informative and structured manner. The API should return information about the error in the response body.

## Response body

When an error occurs, a REST API should respond with an 4xx or 500x [HTTP status code](http-status-codes.md) and the response should contain an error object as described below.

### Error object

The response should contain the key `error` and it's value should be a JSON object containing at least the two keys, `code` and `message`. If there were multiple errors, the values of `code` and `message` should describe the first error.

- `error` The key of the error object.
  - `code` _(Number)_ An integer number that indicates the error type that occurred. This value will usually represent the HTTP response code.
  - `message` _(String)_ A human readable string providing more details about the error.
  - `errors` _(Array)_ **(Optional)** More detailed information about the error(s). API developers can structure each object in the array as they like, but should, whenever possible, use that structure throughout the application. For example, the following fields could be included in each object of the array.
    - `help` **(Optional)** URL to a page explaining the error and possible solutions.
    - `trackingId` **(Optional)** Identifier for mapping failures to service internal codes.
    - `param` **(Optional)** Name of the parameter which was incorrect.
    - `code` and `message` **(Optional)** could provide more detailed information about a specific error, like when parsing parameters.

#### REST error response examples

Simple response

```javascript
{
  "error": {
    "code": 404,
    "message": "File Not Found"
  }
}
```

More detailed response

```javascript
{
  "error": {
    "code": 400,
    "message": "Bad Request - parameter incorrect",
    "errors": [
      {
        "code": 87,
        "message": "Parameter is incorrectly formatted",
        "help": "https://www.moa.is/awesome/documetation/devices",
        "trackingId": "5d17a8ada52a2327f02c6a1a",
        "param": "deviceId"
      },
      {
        "code": 85,
        "message": "Parameter missing",
        "help": "https://www.moa.is/awesome/documetation/devices",
        "trackingId": "5d17a8ada52a2327f02c6a1c",
        "param": "deviceName"
      }
    ]
  }
}
```
