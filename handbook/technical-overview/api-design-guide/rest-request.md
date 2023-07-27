# REST Request

## Query parameters

### Arrays

When passing arrays as query parameters, the array should be passed as a repeated query parameter with the same name.

For example:

```http
https://api.example.com/v1/users?ids=1&ids=2&ids=3
```

### Sensitive data

When making GET requests we sometimes need to pass sensitive data as query parameters. To avoid it being logged by monitoring systems it should not be included in the request URL as normal non-sensitive parameters. Instead, we should use HTTP Request headers to pass the data in the request.

The header name should be prefixed with `X-Query-` and the name of the query parameter, for example `X-Query-National-Id`.

For example instead of:

```http
https://api.example.com/v1/users?nationalId=1234567890
```

do:

```http
https://api.example.com/v1/users

// Headers section
X-Query-National-Id: 1234567890
```

## Path parameters

### Sensitive data

When working with a REST resource where the resource ID is sensitive, it should not be included in the URL path. Instead, it should be passed as a HTTP Request header in the request.

{% hint style="info" %}  
An API should prefer non-sensitive IDs like GUIDs as resource IDs.  
{% endhint %}

A placeholder is needed in the URL path instead of the sensitive resource ID. The placeholder should be prefixed with a dot (`.`) and the name of the path parameter, for example `.national-id`. The header name should be the name of the path parameter prefixed with `X-Param-`, for example `X-Param-National-Id`.

For example instead of:

```http
https://api.example.com/v1/users/1234567890
```

do:

```http
https://api.example.com/v1/users/.national-id

// Headers section
X-Param-National-Id: 1234567890
```
