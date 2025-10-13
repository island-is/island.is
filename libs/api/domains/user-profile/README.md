# api-domains-user-profile

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test api-domains-user-profile` to execute the unit tests via [Jest](https://jestjs.io).

## Development

To run this in development, you will need to start the service.

```bash
yarn start services-user-profile
```

To locally develop the islyklar service, you will need the islyklar.p12 file. The file is not part of the parameter store, so you will need to get it from the code-owners of this service.
_Islyklar file is not a requirement to run the user-profile._

## Islyklar and Userprofile

With the addition of the islyklar service, the userprofile service will be a little different.

The islyklar service is meant to be a temporary solution while we have not migrated the user data from the previous island.is web. So for now a decision was made to merge the islyklar data with the userprofile data for us to get the user information from the old web.

`getUserProfile` will return information from the userProfile db as well as the islyklar db.

## `getUserProfile`

Even if userProfileApiWithAuth does not exist.
Islykill data might exist for the user, so we need to get that, with default values in the userprofile data.

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

`getUserProfile` is served to return the userprofile along with islyklar data from the current logged in user. `getUserProfileLocale` can be used to _only_ fetch the User profile locale. It will only call the userprofile controller `getActorLocale` of the current logged in user, but if the user is logged in as a delegated user, it will fetch the actor's locale instead of the delegated user.

## `getIslykillProfile`

Returns default values for the userProfile while fetching the islyklar data. Used when a `userProfileApiWithAuth` returns 404 so the user will get no userProfileApi data but will get their islyklar data.

## `createUserProfile`

Creates a userprofile using `userProfileControllerCreate` and creates (`createIslykillSettings`) OR updates (`updateIslykillSettings`) the islyklar data depending on if the user has islyklar data or not.

## `updateUserProfile`

Updates a userprofile using `userProfileControllerUpdate` and creates (`createIslykillSettings`) OR updates (`updateIslykillSettings`) the islyklar data depending on if the user has islyklar data or not.

## `deleteEmailOrPhone`

The user can post empty values to the email and telephone fields. If they choose to do so, we will mark the `DataStatus` as `EMPTY`. DataStatus explained in the next step.

```
{
	emailStatus:  DataStatus.EMPTY,
	mobileStatus:  DataStatus.EMPTY,
}
```

## `createSmsVerification` & `createEmailVerification`

When creating or updating the user information we need to keep hold of the validity of the information from the user. The user will get an email or text message to verify the information given.

- The default value of a DataStatus is `NOT_DEFINED`.
- The empty state is `EMPTY`. This is used for example to prompt the user and tell them that it's important that they save their email, even though it's not a requirement.
- The verified state is `VERIFIED`. We know the email is correct, the user has verified.
- The very uncommon state of an email present, but not verified is `NOT_VERIFIED`. This can indicate the user migrating in with an email from the islyklar service, and we have not been able to verify it.
