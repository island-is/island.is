# Client Middlewares

Includes middleware logic for our API clients. Including:

- Circuit breaker.
- Error handling and logging.
- Request timeout.

## createEnhancedFetch

Returns a fetch function with the following features:

A new library providing an createEnhancedFetch function.

- Includes circuit breaker logic. By default, if more than 50% of at least 10 requests from the last 10 seconds are misbehaving, we'll open the circuit. All future requests will be stopped to lower pressure on the remote server. Every 30 seconds we'll allow one request through. If it's successful, we'll close the circuit and let requests flow through again.
- Supports our `User` and `Auth` objects. Adds authorization header to the request.
- Includes request timeout logic. By default, throws an error if there is no response in 10 seconds.
- Throws an error for non-200 responses. The error object includes details from the response, including a problem property if the response implements the Problem Spec.
- Logs circuit breaker events and information about failing requests.
- Optionally opens the circuit for 400 responses.
- Optionally parses and logs error response bodies.

### Options

- `name: string` - Name of fetch function. Used in logs and opossum stats.
- `enableCircuitBreaker?: boolean` - Should use circuit breaker for requests. Defaults to `true`.
- `timeout?: number | false` - Timeout for requests. Logged and thrown as errors. May cause circuit breaker to open. Defaults to `10000`ms. Can be disabled by passing false.
- `treat400ResponsesAsErrors?: boolean` - If `true`, then too many 400 responses may cause the circuit to open. Either way these responses will be logged and thrown. Defaults to `false`.
- `logErrorResponseBody?: boolean` - If `true`, then non-200 response bodies will be consumed and included in the error object and logged as `body`.
- `opossum?: CircuitBreaker.Options` - Allows overriding Opossum options.

The EnhancedFetch function works generally the same as standard fetch, except for non-200 responses it throws an error instead with the following properties.

- `error.name: string` - "FetchError"
- `error.response: Response` - The response object.
- `error.url: string` - The requested url.
- `error.status: number` - The response status code.
- `error.statusText: string` - The response status text.
- `error.headers: Headers` - The headers of the response.
- `error.response: Response` - The response object. Body has not been consumed.
- `error.problem?: object` - The parsed response body if the response has `content-type: application/problem+json`.
- `error.problem?: object | string` - The response body if `logErrorResponseBody` was set to `true`. Parsed JSON or string depending on the response content type.

### Examples

```typescript
import { createEnhancedFetch } from '@island.is/clients/middlewares'

// Manual usage:
const fetch = createEnhancedFetch({
  name: 'my-fetch',
  // Other options.
})

async function callApi() {
  const response = await fetch('/test')
  return response.json()
}

// Use with OpenAPI generated api class.
const apiConfiguration = new ApiConfiguration({
  fetchApi: createEnhancedFetch({
    name: 'api',
    // Other options.
  }),
})

const api = new Api(apiConfiguration)

function callApiWithEnhancedFetch() {
  return api.someApi()
}
```

## Running unit tests

Run `nx test clients-middlewares` to execute the unit tests via [Jest](https://jestjs.io).
