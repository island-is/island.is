```markdown
# Auth Admin API Client

This library provides a client for the [Auth Admin API](../../../../apps/services/auth/admin-api/README.md).

It is used by our [Auth Admin GraphQL Domain](../../../../libs/api/domains/auth-admin/README.md) to communicate with the Auth Admin API across our development, staging, and production environments.

## Environment Variables

The client reads the following environment variables to configure and export the respective API clients:

- `AUTH_ADMIN_API_URL_DEV`
- `AUTH_ADMIN_API_URL_STAGING`
- `AUTH_ADMIN_API_URL_PROD`

These variables are used to configure and export the following API clients:

- `AdminDevApi` 
- `AdminStagingApi` 
- `AdminProdApi`

## Usage

The API clients can be used in a service as shown below:

```typescript
import { AdminDevApi, AdminStagingApi, AdminProdApi } from '@island.is/auth-admin-api';
import { Injectable, Inject, Optional } from '@nestjs/common';

@Injectable()
export class MyService {
  constructor(
    @Inject(AdminDevApi.key)
    @Optional()
    private readonly adminDevApi?: AdminApi,

    @Inject(AdminStagingApi.key)
    @Optional()
    private readonly adminStagingApi?: AdminApi,

    @Inject(AdminProdApi.key)
    @Optional()
    private readonly adminProdApi?: AdminApi,
  ) {}

  // Functions using the APIs...
}
```
```