# Configuration

IAS has an admin interface which can be used to define new Clients, Resources and Scopes. Currently, this admin interface is only accessible by Digital Iceland but our goal is to open it up, so you can sign in and self-service your IAS resources.

## Configuring IAS organisation

Organisations in IAS serve as containers for clients and resources. They have these fields:

- **National ID:** The national ID of the organisation.
- **Domain:** The primary domain for the organisation, used as a prefix in client, resource and scope names; eg `island.is`.
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
- **Redirect Uri:** Which callback URIs should be allowed when logging in with this client. In the staging environment you can use wildcard tokens (`*`) to support feature deployed subdomains, eg `https://*.dev.yourapp.com/oauth/callback`.
- **Post Logout Uri:** Which URIs should be allowed when logging out of this client.
- **Identity Providers:** Specifies which Identity Providers to be used when authenticating to this client.
- **Scopes:** Which scopes should the client be able to request.

### Supported identity providers

IAS currently supports three identity providers, all of which provide a high level of assurance with digital certificates issued to hardware devices in-person.

Clients can configure which identity providers they want to support:

#### SIM Card

This uses electronic ID saved on SIM cards in mobile phones.

#### Identity Card

The Identity Cards look like credit cards and have electronic IDs saved them. They requires a dedicated card reader to use.

#### Mobile App

The newest Identity Provider is a mobile app called Auðkennisappið where the electronic ID is saved in secure device storage.

## Defining resources and scopes

You should define a resource for each of your APIs and one or more scopes for the API’s endpoints.

### Resource configuration:

- **Name:** Should follow naming convention `@{domain}/{resourceName}`.
- **Display Name:** Shown on consent screen.
- **Description:** Shown on consent screen.
- **Claims:** Which user claims does the API need in the access token (eg `nationalId`).
- **Scopes:** Which scopes are associated with this resource.

### Scope configuration:

- **Name:** Should follow naming convention `@{domain}/{scopeName}`
- **Display Name:** Shown on consent screen.
- **Description:** Shown on consent screen.
- **Supported delegations:** What kind of delegations can use this scope (Legal Guardian, Personal Representative, Procuring Holders, Custom).
- **Claims:** Which user claims do the API endpoints need in the access token (eg `nationalId`).
