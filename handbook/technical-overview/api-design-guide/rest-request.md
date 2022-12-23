# REST Request

## Query parameters

### Working with sensitive data

When making GET requests we sometimes need to pass sensitive data as query parameters. To avoid it being logged by monitoring systems it should not be included in the request URL as normal non-sensitive parameters. Instead, we should use HTTP Request headers to pass the data in the request.

For example instead of:

```http
https://api.example.com/v1/endpoint?nationalId=1234567890
```

We should use:

```http
https://api.example.com/v1/endpoint

// Headers section
X-National-Id: 1234567890
```
