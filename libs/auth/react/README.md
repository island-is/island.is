````markdown
# @island.is/auth/react

Manage authentication in React (non-next) single-page applications.

- Handles `oidc-client` and callback routes.
- Provides an authentication flow with a loading screen.
- Manages user context.
- Renews access tokens on demand (when calling APIs) instead of continuously. This supports an ID session lasting from 1 to 8 hours, depending on user activity.
- Preloads a new access token before the current one expires (when calling APIs).
- Monitors the ID session and restarts the login flow if the user is not logged in anymore.

## Usage

### Configuration

At the startup of your app (e.g., `Main.tsx`), configure the authentication parameters:

```typescript
import { configure } from '@island.is/auth/react'
import { environment } from './environments'

configure({
  // Typically configured parameters:
  authority: environment.identityServer.authority,
  client_id: '@island.is/web',
  scope: [
    'openid',
    'profile',
    'api_resource.scope',
    '@island.is/applications:read',
  ],
  // Override these to control callback URLs. Default values:
  baseUrl: `${window.location.origin}`,
  redirectPath: '/auth/callback',
  redirectPathSilent: '/auth/callback-silent',
})
```
````

### Authentication

The `configure` function also accepts all `oidc-client` UserManager settings.

Render the `AuthProvider` component around your application to enable user authentication:

```typescript jsx
ReactDOM.render(
  <Router>
    <AuthProvider basePath="/some_base_path">
      <App />
    </AuthProvider>
  </Router>,
  document.getElementById('root'),
)
```

By default, the component renders its children only after user sign-in, displaying a loading screen in the meantime.

> **Note:** Authenticator must be rendered inside React Router to correctly set up callback routes.

### Access Token Retrieval

Configure authentication for your GraphQL client as follows:

```typescript
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'
import { authLink } from '@island.is/auth/react'

const httpLink = new HttpLink(/* snip */)

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})
```

To manually retrieve the access token:

```typescript
import { getAccessToken } from '@island.is/auth/react'

const accessToken = await getAccessToken()
```

### Token Renewal and ID Session

Calling `getAccessToken` or making requests with `authLink` triggers on-demand token renewal if the token has expired. A new access token preloads when the current one is near expiration due to active requests.

If the user is inactive, there may be a delay while the access token renews during API calls.

Each token renewal extends the ID session, which initially lasts 1 hour and can extend up to 8 hours.

Avoid continuous API requests on intervals when the user might be inactive.

Consider implementing an "updateActive" function to extend the ID session when the user is active but not making API calls.

## Running Unit Tests

Run `nx test auth-react` to execute unit tests via [Jest](https://jestjs.io).

```

```
