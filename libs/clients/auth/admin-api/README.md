# Auth Admin API Client

This library provides a client for the [Auth Admin API](../../../../apps/services/auth/admin-api/README.md). It supports our [Auth Admin GraphQL Domain](../../../../libs/api/domains/auth-admin/README.md) to interact with the Auth Admin API across dev, staging, and prod environments.

Environment variables used for configuration:

- `AUTH_ADMIN_API_URL_DEV`
- `AUTH_ADMIN_API_URL_STAGING`
- `AUTH_ADMIN_API_URL_PROD`

These configure and export the respective `AdminDevApi`, `AdminStagingApi`, and `AdminProdApi` clients.

Example usage in a service:

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

  // Functions using the APIs...
}
```
