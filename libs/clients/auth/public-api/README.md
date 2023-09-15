# Auth Public API Client

## About

This library implements a client to use the public auth API.

> NOTE: Since there is a race condition while creating schemas in the build process, the auth-public-api has to be treated as external service.
> Therefore, the yaml has to be copied from `apps/services/auth/public-api/src/openapi.yaml` and pasted into the `clientConfig.yaml`.

### Import into other NESTJS modules

Add the service to your module imports:

```typescript
import { AuthPublicApiClientModule } from '@island.is/clients/auth/public-api'

@Module({
  imports: [
    AuthPublicApiClientModule.register({
      baseApiUrl: AUTH_PUBLIC_API_URL,
    }),
  ],
})
```

## Code owners and maintainers

- [Core](https://github.com/orgs/island-is/teams/core/members)
