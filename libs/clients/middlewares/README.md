# Enhanced Fetch

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
- Includes request timeout logic. By default, throws an error if there is no response in 20 seconds.
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
- `keepAlive?: boolean | number` - Configures keepAlive for requests. If `false`, never reuse connections. If `true`, reuse connection with a maximum idle timeout of 10 seconds. By passing a number you can override the idle connection timeout. Defaults to `true`.
- `clientCertificate?: ClientCertificateOptions` - Configures client certificate for requests.
- `agentOptions?: AgentOptions` - Overrides agent configuration for requests (e.g. `rejectUnauthorized` or advanced keep-alive configuration).
- `opossum?: CircuitBreaker.Options` - Allows overriding Opossum options.
- `autoAuth?: AutoAuthOptions` - Configure [authorization](#authorization).
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

### Authorization

You can configure Enhanced Fetch to automatically get OAuth2 tokens from an IDP. There are three modes:

- `token`: Get non-user tokens using [Client Credential Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.4).
- `tokenExchange`: Exchange a user-token from an `Auth` object for a new user-token using [Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693).
- `auto`: Performs token exchange if an `Auth` object is passed into fetch, otherwise fetches a non-user token.

In both modes you specify these options:

- `issuer: string` - the base URL of the IDP. We will request a token from `${issuer}/connect/token`.
- `clientId: string` - the client id to use in the client credential or token exchange grant.
- `clientSecret: string` - the client secret to use in the client credential or token exchange grant.
- `scope: string[]` - which scopes to request.
- `tokenEndpoint: string` - (optional) if the [Token Endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.2) doesn't match the `${issuer}/connect/token` pattern, the token endpoint URL can be overwritten.

#### Token mode

Token mode is ideal for cron jobs or workers where no user token is involved. As such, they usually have scopes which authorize endpoints that don't require any user authorization.

Enhanced Fetch handles the client credential grant and caches the token in-memory until it expires.

```ts
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  autoAuth: {
    issuer: 'https://your-idp',
    clientId: '@island.is/you-client',
    clientSecret: 'YourClientSecret',
    scope: ['the', 'scopes', 'you', 'need'],
    mode: 'token',
  },
})

// Gets an access token and adds as authorization header.
const response = await enhancedFetch('https://backend/api')
```

#### Token exchange mode

You can set up token exchange when your system is doing something on behalf of a user which their existing access token is not authorized to do. Here are some use cases:

- The user might have a delegation token with limited access, but your API needs to expand their access for a specific purpose.
- The backend is talking to a service which the user token should not have direct access to, but we still want to send a signed user token for authorization and audit reasons.

For token exchange to work, you need to pass an `Auth` object to `enhancedFetch`:

```ts
import { caching } from 'cache-manager'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  autoAuth: {
    issuer: 'https://your-idp',
    clientId: '@island.is/you-client',
    clientSecret: 'YourClientSecret',
    scope: ['the', 'scopes', 'you', 'need'],
    mode: 'tokenExchange',
  },
})

// Performs a token exchange using `currentUser` to get a new access token with the scopes listed above.
const response = await enhancedFetch('https://backend/api', {
  auth: currentUser,
})
```

By default, Enhanced Fetch will perform a token exchange only if the existing authorization is missing some of the scopes specified in `autoAuth`.

This behaviour can be configured along with a couple of other options:

- `alwaysTokenExchange: boolean` - Request token exchange even though the current authentication has all of the specified scopes. Defaults to false.

- `requestActorToken: boolean` - Request a token for the actor (the real end-user) and removes information about the active delegation. This is useful for services that do not understand island.is delegation tokens or should always return data for the actor rather than the active delegation. Defaults to false.

- `useCache: boolean` - Enables private caching for token exchange tokens. Requires [`cacheManager`](#caching) to be configured. This involves storing user-tokens between requests, so "Keep it secret. Keep it safe." Defaults to false.

```ts
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  cache: {
    cacheManager: await caching('memory', { ttl: 0 }),
  },
  autoAuth: {
    issuer: 'https://your-idp',
    clientId: '@island.is/you-client',
    clientSecret: 'YourClientSecret',
    scope: ['the', 'scopes', 'you', 'need'],
    mode: 'tokenExchange',
    tokenExchange: {
      alwaysTokenExchange: true,
      requestActorToken: true,
      useCache: true,
    },
  },
})
```

### Caching

Enhanced Fetch includes built-in response cache functionality based on standard cache-control semantics. To enable caching, you need to call createEnhancedFetch with a [cache-manager](https://www.npmjs.com/package/cache-manager) Cache instance:

```ts
import { caching } from 'cache-manager'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  cache: {
    cacheManager: await caching('memory', { ttl: 0 }),
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

#### Stale responses

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

#### Authorized APIs

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
