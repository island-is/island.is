## License API

A RESTful API for updating digital licenses for authenticated external parties.

### Guards

- **LicenseTypeScopeGuard**: Ensures the access token has the necessary scopes to perform actions on a specific `LicenseId`.

### Quickstart

Ensure Docker is running. For the first-time setup, execute:

```bash
yarn dev-init license-api
```

To start the application:

```bash
yarn dev license-api
```

Access the OpenAPI specs at [http://localhost:4248/swagger/](http://localhost:4248/swagger/).

### URLs

- Dev: N/A
- Staging: N/A
- Production: N/A

### Code Owners and Maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan/members)