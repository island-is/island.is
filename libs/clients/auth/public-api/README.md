```markdown
# Auth Public API Client

## Overview

This library provides a client for interacting with the public authentication API.

## Usage in NestJS Modules

To integrate this service into your module, add it to the module's imports as shown below:

```typescript
import { AuthPublicApiClientModule } from '@island.is/clients/auth/public-api'

@Module({
  imports: [
    AuthPublicApiClientModule.register({
      baseApiUrl: AUTH_PUBLIC_API_URL, // Specify the base URL for the public auth API
    }),
  ],
})
```

## Code Ownership and Maintenance

This project is maintained by the [Core Team](https://github.com/orgs/island-is/teams/core/members).
```