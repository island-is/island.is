# License API

## About

A RESTful API that enables the updating of digital licenses for authenticated external parties.

## Guards

- `LicenseTypeScopeGuard`: checks that the access token has the required scopes to be able to perform an action on a specific `LicenseId`

## Quickstart

Ensure docker is running, then run the following when running for the first time:

```bash
yarn dev-init license-api
```

To start the app:

```bash
yarn dev license-api
```

Afterwards, you can view the open api specs at http://localhost:4248/swagger/

## Urls

- Dev: N/A
- Staging: N/A
- Production: N/A

## Code owners and maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan/members)
