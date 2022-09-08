# @island.is/auth/react

Manage authentication in React (non-next) single page applications.

- Handles oidc-client and callback routes.
- Handles authentication flow with loading screen.
- Manages user context.
- Renews access tokens on demand (when calling APIs) instead of continuously. This helps us support an (eg) 1-8 hour IDS session, depending on how long the user is active.
- Preloads a new access token some time before it expires (when calling APIs).
- Monitor the IDS session and restart login flow if the user is not logged in anymore.

## Usage

### Configure

In the startup of your app (e.g. `Main.tsx`) you need to configure some authentication parameters:

```typescript
import { configure } from '@island.is/auth/react'
import { environment } from './environments'

configure({
  // You should usually configure these:
  authority: environment.identityServer.authority,
  client_id: '@island.is/web',
  scope: [
    'openid',
    'profile',
    'api_resource.scope',
    '@island.is/applications:read',
  ],
  // These can be overridden to control callback urls.
  // These are the default values:
  baseUrl: `${window.location.origin}`,
  redirectPath: '/auth/callback',
  redirectPathSilent: '/auth/callback-silent',
})
```

### Authenticate

The configure function also accepts all oidc-client UserManager settings.

Then you can render the Authenticator component around your application to wrap it with user authentication.

```typescript jsx
ReactDOM.render(
  <Router>
    <Authenticator>
      <App />
    </Authenticator>
  </Router>,
  document.getElementById('root'),
)
```

By default, it only renders its children after signing the user in. It will render a loading screen in the meantime.

{% hint style="info" %}
Note: Authenticator must be rendered inside React Router to set up callback routes.
{% endhint %}

### Get access token

You can configure authentication for your GraphQL client like this:

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

You can also manually get the access token like this:

```typescript
import { getAccessToken } from '@island.is/auth/react'

const accessToken = await getAccessToken()
```

### Token renew and IDS session

When you call `getAccessToken` or make requests with `authLink`, we renew the access token on demand if it has expired. We also preload a new access token if you are actively requesting the access token before it expires.

Note that if the user has been inactive, they might experience a delay when they come back and call an API, while we renew the access token.

Every time we renew the access token, the IDS session is extended. When this is written, the IDS maintains a 1 hour session that can be extended up to 8 hours.

Be careful not to do continuous API requests on an interval when the user might not be active.

Later we may implement an "updateActive" function that can be called to extend the IDS session in case the user is active but not calling any APIs.

## Running unit tests

Run `nx test auth-react` to execute the unit tests via [Jest](https://jestjs.io).
