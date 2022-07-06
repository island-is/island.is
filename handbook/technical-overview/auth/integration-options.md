# Integration Options

There are many ways to integrate your application with IAS, depending on your needs.

## User authentication only

If your app only needs to call your own APIs and they can share a session cookie for authorization, you CAN use IAS to authenticate the user only.

In this case you SHOULD use the Authorization Code + PKCE flow to authenticating the user. The client MAY BE public, eg a single page application (SPA).

Using OIDC you can authenticate the user and get claims (like “name” and “national_id”) about them from the ID token or the UserInfo API endpoint. In your authorization callback you can link the user claims to your own resources, create a session cookie and use it to authorize calls to your API.

This has many benefits:

- You don’t need to manage Access Tokens and Refresh Tokens, which reduces potential attack surface significantly.
- You don’t need to keep track of multiple session lifecycles (cookies, access token, refresh token).
- Session security, CSRF and authorization are commonly built into frameworks, while OAuth2 logic often needs to be written or tweaked by hand.

The drawbacks are:

- You can’t call APIs which are authorized with IAS access token.
- It’s more difficult to authorize APIs that are on separate domains and can’t share a session cookie.

## User authentication and API authorization

In some cases you need an IAS Access Token to access user resources from APIs. These APIs might belong to another organisation (on another domain) or they might be your own APIs which you want to authorize with IAS rather than a session cookie. In this case you SHOULD use a confidential client and the Authorization Code + PKCE flow.

Special care is needed to protect Access Tokens since they may grant access to sensitive user resources.

Access Tokens issued by IAS have a short lifetime; no more than 5 minutes in production. To support longer user sessions you SHOULD request a Refresh Token and use it to refresh Access Tokens when they expire.

You SHOULD NOT store tokens [in browser storage or even browser memory](https://medium.com/@benjamin.botto/secure-access-token-storage-with-single-page-applications-part-1-9536b0021321), as that will expose them to XSS attacks and token exfiltration. Leaked tokens can be more serious than normal XSS attacks since tokens sometimes provide a wider access to user resources then your application exposes.

Instead, you SHOULD keep tokens in a secure backend session storage. If your application is a SPA then you MAY consider the [Backend for Frontend](https://docs.duendesoftware.com/identityserver/v5/bff/overview/) (BFF) pattern.

## Client authentication for APIs

Some apps need to access APIs when no user is around, e.g. from queue workers or cron jobs.

If you are performing offline processing for a user that has previously authenticated to your application you should consider storing the user’s Refresh Token so you can get a fresh Access Token when you need to perform the offline processing. This is preferable to Client Credentials since each access is limited to previously authenticated users which have presumably given consent for the access.

However, in some cases you may not have a user authentication to use or you need access to resources which the user does not own. In that case you SHOULD use Client Credentials to authenticate your system as a client.

Bear in mind that with Client Credentials, the client is considered the resource owner. You SHOULD take special care to protect the client credentials and limit the scopes which the client has access to.
