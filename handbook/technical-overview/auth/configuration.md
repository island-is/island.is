# Configuration

IAS has an admin interface which can be used to define new Clients, Resources and Scopes. Currently, this admin interface is only accessible by Digital Iceland but our goal is to open it up, so you can sign in and self-service your IAS resources.

## Configuring IAS organisation

Organisations in IAS serve as containers for clients and resources. They have these fields:

- **National ID:** The national ID of the organisation.
- **Domain:** The primary domain for the organisation, used as a prefix in client, resource and scope names; e.g. `island.is`.
- **Contact Email:** Email which Digital Iceland can use for service notifications and issues.

## Defining clients

When defining clients, you need to provide the following:

- **Client Type:** Web Client, Native Client (for mobile apps) or Machine Client (client credentials).
- **Client ID:** Should follow naming convention `@{domain}/{clientName}`
- **Client Secret:** Required to authenticate confidential clients.
- **Display Name:** What the user sees when logging into your application.
- **Supported Delegations:** What kind of delegations to support (Legal Guardian, Personal Representative, Procuring Holders, Custom).
- **Prompt Delegations:** Determines if users will be prompted to choose a delegation when signing into your app.
- **Allow Offline Access:** Should the client be able to get refresh tokens.
- **Refresh Token Expiration:** Inactive vs Absolute expiration of refresh tokens in seconds.
- **Redirect Uri:** Which callback URIs should be allowed when logging in with this client. In the staging environment you can use wildcard tokens (`*`) to support feature deployed subdomains, e.g. `https://*.dev.yourapp.com/oauth/callback`.
- **Post Logout Uri:** Which URIs should be allowed when logging out of this client.
- **Identity Providers:** Specifies which Identity Providers to be used when authenticating to this client.
- **Grant Types:** What kind of authentication flow the client will use. Authorization Code for web and native clients. Client Credentials for machine clients and optionally allow for token exchange.
- **Scopes:** Which scopes should the client be able to request.

### Supported identity providers

IAS currently supports three identity providers, all of which provide a high level of assurance with digital certificates issued to hardware devices in-person.

Clients can configure which identity providers they want to support:

#### SIM Card

This uses electronic ID saved on SIM cards in mobile phones.

#### Identity Card

The Identity Cards look like credit cards and have electronic IDs saved on them. They require a dedicated card reader to use.

#### Mobile App

The newest Identity Provider is a mobile app called Auðkennisappið where the electronic ID is saved in secure device storage.

## Defining resources and scopes

If you want to use IAS access tokens to authorize requests to your APIs you must define a resource for each of your APIs and one or more scopes for the API’s endpoints.

### Resource configuration:

- **Name:** Should follow naming convention `@{domain}/{resourceName}`.
- **Display Name:** Shown on consent screen.
- **Description:** Shown on consent screen.
- **Claims:** Which user claims does the API need in the access token (e.g. `nationalId`).
- **Scopes:** Which scopes are associated with this resource.

### Scope configuration:

- **Name:** Should follow naming convention `@{domain}/{scopeName}`
- **Display Name:** Shown on consent screen.
- **Description:** Shown on consent screen.
- **Supported delegations:** What kind of delegations can use this scope (Legal Guardian, Personal Representative, Procuring Holders, Custom).
- **Personal Representative Permissions:** Which personal representative permissions, if any, gives access to this scope.
- **Claims:** Which user claims do the API endpoints need in the access token (e.g. `nationalId`).

## Example

Let's say your organisation's domain is `myorg.is`, with a web app on `app.myorg.is` which uses IAS to authenticate normal users and needs an access token to talk to a "Document API" hosted on `documents.myorg.is`.

You can create the following IAS resources:

### Webapp client

- **Client Type:** Web Client
- **Client ID:** `@myorg.is/webapp`
- **Client Secret:** ...
- **Display Name:** My Org Webapp
- **Supported Delegations:** None
- **Prompt Delegations:** No
- **Allow Offline Access:** Yes
- **Refresh Token Expiration:** 30m inactive, 24h absolute
- **Redirect Uri:** `https://app.myorg.is/oauth/callback`
- **Post Logout Uri:** `https://myorg.is`
- **Identity Providers:** All
- **Grant Types:** Authorization Code
- **Scopes:** `@myorg.is/documents:read` and `@myorg.is/documents:write`

### Document API resource

- **Name:** `@myorg.is/documents`.
- **Display Name:** Documents API
- **Description:** Stores user documents.
- **Claims:** `nationalId`
- **Scopes:** `@myorg.is/documents:read` and `@myorg.is/documents:write`

### Read documents scope

- **Name:** `@myorg.is/documents:read`
- **Display Name:** Read documents
- **Description:** Read access to the user's documents.
- **Supported delegations:** None
- **Claims:** `nationalId`

### Write documents scope

- **Name:** `@myorg.is/documents:write`
- **Display Name:** Write documents- **Description:** Read/Write access to the user's documents.
- **Supported delegations:** None
- **Claims:** `nationalId`

{% hint style="info" %}
Even though the `name` field of clients, resources and scopes all have the same naming convention, they won't conflict with each other and there's no associations based on the name.
{% endhint %}

### Example authentication

1. User goes to `https://app.myorg.is` which has the `@myorg.is/webapp` client.

2. The user clicks a login button. The client sends them to the IAS authorize endpoint: `https://innskra.island.is/connect/authorize` with these query parameters:

   - client_id=@myorg.is/webapp
   - redirect_uri=https://app.myorg.is/oauth/callback
   - response_type=code
   - scope=openid profile offline_access @myorg.is/documents:read @myorg.is/documents:write
   - state={SOME_STATE}
   - code_challenge={CODE_CHALLENGE}
   - code_challenge_method=S256
   - response_mode=query

3. The user authenticates and IAS sends the user to the client callback URL: `https://app.myorg.is/oauth/callback` with these query parameters:

   - code={AUTHORIZATION_CODE}
   - scope=openid profile offline_access @myorg.is/documents:read @myorg.is/documents:write
   - state=SOME_STATE

4. The client performs a POST request to the IAS token endpoint: `https://innskra.island.is/connect/token` with the following payload encoded as `content-type: application/x-www-form-urlencoded`:

   - client_id=@myorg.is/webapp
   - code={AUTHORIZATION_CODE}
   - redirect_uri=https://app.myorg.is/oauth/callback
   - code_verifier={CODE_VERIFIER}
   - grant_type=authorization_code

5. The client receives the id token, access token and refresh token in the response:

   ```json
   {
     "id_token": "{idToken}",
     "access_token": "{accessToken}",
     "refresh_token": "{refreshToken}",
     "expires_in": 300,
     "token_type": "Bearer",
     "scope": "openid profile offline_access @myorg.is/documents:read @myorg.is/documents:write"
   }
   ```

6. The client can decode the ID token or call the userinfo endpoint: `https://innskra.island.is/connect/userinfo` with the access token to get authentication claims:

   ```json
   {
     "nbf": { notValidBeforeTime },
     "exp": { expiryTime },
     "iat": { issuedAtTime },
     "auth_time": { authenticationTime },
     "iss": "https://innskra.island.is",
     "aud": "@myorg.is/webapp",
     "at_hash": "{accessTokenHash}",
     "s_hash": "{stateHash}",
     "sid": "{sessionId}",
     "sub": "{subject}",
     "idp": "{identityProvider}",
     "nationalId": "{userNationalId}",
     "nat": "{userNationality}",
     "subjectType": "person",
     "name": "{userName}",
     "amr": ["external"]
   }
   ```

7. The client can use the access token to call the documents API: `https://app.myorg.is/documents`. When decoded and validated the access token also contains claims about the authenticated user:
   ```json
   {
     "nbf": { notValidBeforeTime },
     "exp": { expiryTime },
     "iat": { issuedAtTime },
     "auth_time": { authenticationTime },
     "iss": "https://innskra.island.is",
     "aud": "@myorg.is/documents",
     "client_id": "@myorg.is/webapp",
     "sub": "{subject}",
     "idp": "{identityProvider}",
     "nationalId": "{userNationalId}",
     "jti": "{tokenId}",
     "sid": "{sessionId}",
     "scope": "openid profile offline_access @myorg.is/documents:read @myorg.is/documents:write",
     "amr": ["external"]
   }
   ```
