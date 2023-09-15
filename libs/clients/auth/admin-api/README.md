# Auth Admin API Client

This library provides a client for the [Auth Admin API](../../../../apps/services/auth/admin-api/README.md).

It is used by our [Auth Admin GraphQL Domain](../../../../libs/api/domains/auth-admin/README.md) to communicate with the Auth Admin API cross our dev, staging and prod environments.

It reads the following environment variables:

```
AUTH_ADMIN_API_URL_DEV
AUTH_ADMIN_API_URL_STAGING
AUTH_ADMIN_API_URL_PROD
```

to configure and export corresponding `AdminDevApi`, `AdminStagingApi` and `AdminProdApi` api clients.

Which can be used in a service like:

```typescript
import { AdminDevApi } from '@island.is/auth-admin-api'

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

  // Functions using the apis...
}
```
