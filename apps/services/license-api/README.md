# License API

## Overview

A RESTful API for updating digital licenses, available to authenticated external users.

## Guards

- **LicenseTypeScopeGuard**: Confirms the access token contains required scopes for actions on a specific `LicenseId`.

## Quickstart

Ensure Docker is active. For initial setup:

```bash
yarn dev-init license-api
```

To launch the application:

```bash
yarn dev license-api
```

Access API documentation at [http://localhost:4248/swagger/](http://localhost:4248/swagger/).

## Environments

- Development: Not Available
- Staging: Not Available
- Production: Not Available

## Code Owners and Maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan/members)
