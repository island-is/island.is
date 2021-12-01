# Client Middlewares

Includes middleware logic for our API clients. Including:

- Circuit breaker.
- Error handling and logging.
- Request timeout.

## createEnhancedFetch

Returns a fetch function with the following features:

A new library providing an createEnhancedFetch function.

- Includes circuit breaker logic. By default, if more than 50% of at least 10 requests from the last 10 seconds are misbehaving, we'll open the circuit. All future requests will be stopped to lower pressure on the remote server. Every 30 seconds we'll allow one request through. If it's successful, we'll close the circuit and let requests flow through again.
- Includes response cache logic built on top of standard cache-control semantics. By default nothing is cached.
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
- `cache?: CacheConfig` - Configure [caching](#caching).

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

### Caching

Enhanced Fetch includes built-in response cache functionality based on standard cache-control semantics. To enable caching, you need to call createEnhancedFetch with a [cache-manager](https://www.npmjs.com/package/cache-manager) Cache instance:

```ts
import { caching } from 'cache-manager'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  cache: {
    cacheManager: caching({ store: 'memory', ttl: 0 }),
  },
})
```

The above example uses an in-memory cache, but you should generally configure a redis backend.

{% hint style="info" %}
You should discuss with Digital Iceland and the API owner on which cache configuration is appropriate for the API you're integrating.
{% endhint %}

#### Overriding cache-control

With the above configuration, Enhanced Fetch will only cache server responses if they have a cache-control header configured to allow storage in shared caches.

Since many APIs don't configure caching headers properly, you can override the cache-control value, either with a static or a dynamic value.

```ts
const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  cache: {
    cacheManager,
    overrideCacheControl: 'max-age=60',
  },
})
```

You should generally use `buildCacheControl` to configure cache control in a type-safe way:

```ts
const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  cache: {
    cacheManager,
    overrideCacheControl: (request, response) =>
      buildCacheControl({ maxAge: 60 }),
  },
})
```

By default, `overrideCacheControl` only affects GET responses, since you rarely want to cache POST requests. If you know what you're doing, then you can cache those as well:

```ts
const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  cache: {
    cacheManager,
    overrideCacheControl: buildCacheControl({ maxAge: 60 }),
    overrideForPost: true,
  },
})
```

{% hint style="info" %}
Only responses with [specific status codes](https://developer.mozilla.org/en-US/docs/Glossary/cacheable) can be cached. Notably, that list excludes "201 Created", "400 Bad Request", "401 Unauthorized", "403 Forbidden" as well as most 500 responses. Those responses won't be cached even if you override the cache-control value.
{% endhint %}

### Stale responses

You can configure the cache to return stale responses in specific circumstances:

```ts
const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  cache: {
    cacheManager,
    overrideCacheControl: (request, response) =>
      buildCacheControl({
        maxAge: 300, // 5 minutes
        staleWhileRevalidate: 3600 * 24, // 1 day
        staleIfError: 3600 * 24 * 30, // 1 month
      }),
  },
})
```

In the above example, it will return a response from the cache:

- If it's less than 5 minute old.
- If it's less than 1 day old. In this case it will immediately update the cache in the background to return fresher data in future requests.
- If it's less than 30 days old and the server is offline or returns an error response (eg "500 Internal Server Error").

### Authorized APIs

The cache is shared for all requests by default. Requests that have an authorization headers need special consideration since those won't be stored by default.

If the API is not using `innskra.island.is` or serving data that is not specific to the authenticated user, then you may configure cache-control to support shared caching for authorized requests:

```ts
const registryFetch = createEnhancedFetch({
  name: 'some-registry',
  cache: {
    cacheManager,
    overrideCacheControl: buildCacheControl({
      maxAge: 60,
      public: true,
      // or: sharedMaxAge: 60,
    }),
  },
})
```

If the API is serving data specific to an authenticated user from `innskra.island.is`, you can configure a private cache for that user. In this case, you need to pass a `User` object (eg from [@CurrentUser](../../auth-nest-tools/README.md#using-in-rest-controller)) to the fetch function:

```ts
const privateApiFetch = createEnhancedFetch({
  name: 'private-api',
  cache: {
    cacheManager,
    shared: false,
    overrideCacheControl: buildCacheControl({ maxAge: 60 }),
  },
})

registryFetch('/applications', { auth: currentUser })
```

{% hint style="info" %}
The private cache is currently only designed for APIs that consume `innskra.island.is` access tokens and create private responses based on the user's `nationalId` claim. If the `nationalId` claim is missing, or you forget to pass the `auth` argument, then a warning is logged and the cache is disabled.
{% endhint %}

It's possible to have a shared cache for some requests and private for others:

```ts
const enhancedFetch = createEnhancedFetch({
  name: 'some-api',
  cache: {
    cacheManager,
    shared: (request) => !request.url.match(/\/pin$/),
    overrideCacheControl: buildCacheControl({ maxAge: 60, public: true }),
  },
})
```

In the above example, requests going to the pin endpoint will never be shared between users, while other requests can be cached between users.

## Running unit tests

Run `nx test clients-middlewares` to execute the unit tests via [Jest](https://jestjs.io).
