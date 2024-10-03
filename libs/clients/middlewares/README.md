````markdown
# Enhanced Fetch

Includes middleware logic for our API clients, featuring:

- Circuit breaker functionality.
- Error handling and logging.
- Request timeout management.

## createEnhancedFetch

This function returns a fetch function with enhanced capabilities:

- Circuit breaker logic is incorporated: by default, if more than 50% of at least 10 requests from the last 10 seconds fail, the circuit is opened. This halts future requests to reduce pressure on the remote server. Every 30 seconds, one request is allowed through; if successful, the circuit closes, allowing requests to flow again.
- Integrates response cache logic based on standard cache-control semantics, with default settings not caching anything.
- Supports `User` and `Auth` objects by adding an authorization header to requests.
- Implements request timeout logic, throwing an error if there's no response within 20 seconds, by default.
- Converts non-200 responses into errors, providing detailed information, including a `problem` property if the response implements the Problem Spec.
- Logs events related to the circuit breaker and information about failing requests.
- Option to open the circuit for 400 responses.
- Allows options to parse and log error response bodies.

### Options

- `name: string` - Identifies the fetch function, used in logs and Opossum stats.
- `enableCircuitBreaker?: boolean` - Enables circuit breaker. Defaults to `true`.
- `timeout?: number | false` - Sets a timeout for requests, logged and thrown as errors, potentially triggering the circuit breaker. Defaults to `10000`ms. Set to false to disable.
- `logErrorResponseBody?: boolean` - If `true`, non-200 response bodies are logged and included in the error object.
- `keepAlive?: boolean | number` - Configures keepAlive for requests. Set to `false` to never reuse connections, `true` to reuse connections with a max idle timeout of 10 seconds, or specify a number for a custom timeout. Defaults to `true`.
- `clientCertificate?: ClientCertificateOptions` - Configures client certificate for requests.
- `agentOptions?: AgentOptions` - Overrides agent config for requests (e.g., `rejectUnauthorized` or advanced keep-alive settings).
- `opossum?: CircuitBreaker.Options` - Provides options for overriding Opossum settings.
- `autoAuth?: AutoAuthOptions` - Configure [authorization](#authorization).
- `cache?: CacheConfig` - Configure [caching](#caching).

The Enhanced Fetch function operates similarly to standard fetch, but for non-200 responses, it throws an error with these properties:

- `error.name: string` - "FetchError"
- `error.response: Response` - The response object.
- `error.url: string` - The requested URL.
- `error.status: number` - The response status code.
- `error.statusText: string` - The response status text.
- `error.headers: Headers` - The headers of the response.
- `error.response: Response` - The response object; the body is not consumed.
- `error.problem?: object` - The parsed response body if `content-type` is `application/problem+json`.
- `error.problem?: object | string` - The response body as JSON or string, based on `logErrorResponseBody`.

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
````

### Authorization

Enhanced Fetch can be configured to automatically fetch OAuth2 tokens from an IDP. There are three modes:

- `token`: Obtains non-user tokens using the [Client Credential Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.4).
- `tokenExchange`: Uses a user's existing access token from an `Auth` object for a new token via [Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693).
- `auto`: Automatically performs a token exchange if an `Auth` object is given, or fetches a non-user token otherwise.

These options are specified for both modes:

- `issuer: string` - Base URL of the IDP; tokens requested from `${issuer}/connect/token`.
- `clientId: string` - Client ID for the client credential or token exchange grant.
- `clientSecret: string` - Client secret for the client credential or token exchange grant.
- `scope: string[]` - The scopes to request.
- `tokenEndpoint: string` - (Optional) Overrides the token endpoint URL if it doesn't follow the `${issuer}/connect/token` pattern.

#### Token mode

Ideal for cron jobs or workers where no user token is needed — typically deployed for endpoints that don't require user authorization.

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

// Acquires an access token, adding it as an authorization header.
const response = await enhancedFetch('https://backend/api')
```

#### Token exchange mode

Enables token exchange when your system operates on behalf of a user without sufficient authorization from the user's current access token. Common scenarios:

- Expanding access for a delegation token with limited scope.
- Granting access for backend services with a signed user token for authorization purposes, unseen by the user token.

To use token exchange, provide an `Auth` object to `enhancedFetch`:

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

// Token exchange using `currentUser` to acquire a new access token.
const response = await enhancedFetch('https://backend/api', {
  auth: currentUser,
})
```

Typically, Enhanced Fetch performs a token exchange only if existing authorization lacks required `autoAuth` scopes.

Configuration options include:

- `alwaysTokenExchange: boolean` - Forcibly perform token exchange even if current authentication includes all specified scopes. Defaults to false.
- `requestActorToken: boolean` - Obtains a token for the actor and removes active delegation details. Useful when the service requires data specific to the actor or doesn't support island.is delegation tokens. Defaults to false.
- `useCache: boolean` - Enables private caching for token exchange tokens. Requires configuring [`cacheManager`](#caching). This involves storing user tokens between requests; "Keep it secret. Keep it safe." Defaults to false.

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

Enhanced Fetch has built-in response cache functionality based on standard cache-control semantics. Enable caching by calling `createEnhancedFetch` with a [cache-manager](https://www.npmjs.com/package/cache-manager) Cache instance:

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

The above example uses an in-memory cache; generally, use a Redis backend for production.

{% hint style="info" %}
Discuss cache configurations with Digital Iceland and the API owner for relevant integration.
{% endhint %}

#### Overriding cache-control

With the setup above, Enhanced Fetch caches server responses having cache-control headers configured for shared cache storage.

To override cache-control values statically or dynamically for APIs missing proper caching headers:

```ts
const enhancedFetch = createEnhancedFetch({
  name: 'my-fetch',
  cache: {
    cacheManager,
    overrideCacheControl: 'max-age=60',
  },
})
```

Use `buildCacheControl` for type-safe cache control configuration:

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

By default, `overrideCacheControl` affects only GET responses. To cache POST requests:

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
Only responses with [specific status codes](https://developer.mozilla.org/en-US/docs/Glossary/cacheable) are cacheable. This excludes "201 Created", "400 Bad Request", "401 Unauthorized", "403 Forbidden", and most 500 responses. Such responses aren't cached even if cache-control values are overridden.
{% endhint %}

#### Stale responses

Configure the cache to return stale responses:

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

In this setup, a cache response is returned if:

- Less than 5 minutes old.
- Less than 1 day old, with updates processed in the background for future freshness.
- Less than 30 days old and the server is offline or returns an error (e.g. "500 Internal Server Error").

#### Authorized APIs

By default, requests share the cache. Requests with authorization headers need special handling as they're not stored by default.

For APIs not using `innskra.island.is` or dispensing non-user-specific data, configure cache-control for shared caching of authorized requests:

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

For APIs dispensing user-specific data from `innskra.island.is`, configure a private cache for the user, passing a `User` object (e.g., via [@CurrentUser](../../auth-nest-tools/README.md#using-in-rest-controller)):

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
The private cache is designed for APIs using `innskra.island.is` access tokens with private responses based on the user's `nationalId` claim. If `nationalId` is absent or `auth` is not delivered, a warning is logged and the cache is disabled.
{% endhint %}

A shared cache is feasible for some requests, private for others:

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

In this example, requests to the /pin endpoint aren't shared among users, while others may be.

#### Caching with sensitive path or query parameters

If an API employs static URL placeholders for sensitive parameters, as per our [API Design Guide](https://docs.devland.is/technical-overview/api-design-guide/rest-request), exercise caution.

Built-in support exists for headers matching key patterns in the API Design Guide: path params with `X-Param`, query params with `X-Query`. In such cases, no additional setup is necessary; caching is managed automatically by the `defaultCacheKey` function.

⚠️ **Warning**  
For APIs deploying different header key patterns, override the `defaultCacheKey` function to handle specific header keys.

##### Overriding the `defaultCacheKey` function for sensitive path and query parameters

For APIs using custom header keys for sensitive parameters, provide a `cacheKey` function to supersede the `defaultCacheKey`, incorporating custom header keys.

Utilize `defaultCacheKey` as a foundation, then append custom header keys:

```ts
const enhancedFetch = createEnhancedFetch({
  name: 'some-api',
  cache: {
    cacheManager,
    cacheKey: (request: Request) => {
      const headers = request.headers
      const cacheKey = defaultCacheKey(request)
      const paramHeader = headers.get('X-Param-Key')
      const queryHeader = headers.get('X-Query-Key')
      return `${cacheKey}#${paramHeader}#${queryHeader}`
    },
  },
})
```

## Running unit tests

Run `yarn test clients-middlewares` to execute unit tests using [Jest](https://jestjs.io).

```

```
