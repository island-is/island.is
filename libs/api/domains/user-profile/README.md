# api-domains-user-profile

This library was generated with [Nx](https://nx.dev).

## Running Unit Tests

Execute unit tests with:

```bash
nx test api-domains-user-profile
```

## Development Setup

To run the service in development:

```bash
yarn start services-user-profile
```

To develop the islyklar service locally, secure the `islyklar.p12` file from the code-owners. It's not necessary for running user-profile.

## Islyklar and Userprofile Integration

The islyklar service merges its data with the userprofile to access user info from the previous island.is web. Thus, `getUserProfile` retrieves information from both databases.

## `getUserProfile`

Fetches user data from userProfile and islyklar databases. It handles cases where only one or neither source is available.

```mermaid
graph TD
START(getUserProfile) --> GET[Get User Profile & Islyklar data]
GET -- Error --> E[throw Error]
GET --> HAS_IL{Has islyklar only?}
GET --> HAS_UP{Has userprofile only?}
GET --> HAS_BOTH{Has Both?}
GET --> HAS_NO{Has Neither?}
HAS_BOTH -- All data --> RETURN[Return user object]
HAS_UP -- Only userprofile data --> RETURN[Return user object]
HAS_IL -- Only Islyklar data --> RETURN[Return user object]
HAS_NO --> RET_NULL[Return null]
```

## `getUserProfileLocale`

Fetches only the locale of the user profile. If logged in as a delegated user, it retrieves the actor's locale.

## `getIslykillProfile`

Provides default userProfile values and fetches islyklar data if `userProfileApiWithAuth` returns 404.

## `createUserProfile`

Creates a user profile using `userProfileControllerCreate` and manages islyklar data with `createIslykillSettings` or `updateIslykillSettings`.

## `updateUserProfile`

Updates a user profile with `userProfileControllerUpdate` and similarly manages islyklar data.

## `deleteIslykillValue`

Marks email and phone fields as `EMPTY` when posted with empty values:

```json
{
	"emailStatus": "DataStatus.EMPTY",
	"mobileStatus": "DataStatus.EMPTY"
}
```

## `createSmsVerification` & `createEmailVerification`

Send verification via SMS or email to confirm user-provided information. DataStatus indicators:

- `NOT_DEFINED`: Default value.
- `EMPTY`: Prompts user to save contact info, not mandatory.
- `VERIFIED`: User has confirmed contact info.
- `NOT_VERIFIED`: Info exists but is unverified, typically from islyklar migration.