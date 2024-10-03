# License API

## Overview

A RESTful API for updating digital licenses, accessible to authenticated external parties.

## Guards

- **LicenseTypeScopeGuard**: Ensures the access token contains the necessary scopes for actions on a specific `LicenseId`.

## Quickstart

Ensure Docker is running. For first-time setup:

```bash
yarn dev-init license-api
```

To start the application:

```bash
yarn dev license-api
```

Access the API documentation at [http://localhost:4248/swagger/](http://localhost:4248/swagger/).

## Environments

- Development: N/A
- Staging: N/A
- Production: N/A

## Code Owners and Maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan/members)
