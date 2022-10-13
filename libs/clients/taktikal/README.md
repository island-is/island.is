# Taktikal Client

## About

The client allows its users to request individuals to sign PDF documents using their mobile electronic ids via Taktikal.

## Usage

Add `TaktikalModule` to your Module imports:

```typescript
import { TaktikalModule, TaktikalService } from '@island.is/clients/taktikal'

@Module({
  imports: [
    TaktikalModule.register({
      basePath: 'https://onboardingdev.taktikal.is/api',
      companyKey: '<company key>',
      apiKey: '<api key>',
    }),
  ],
  providers: [
    TaktikalService
  ]
})
```

Each organisation must have their own credentials and they can be accessed in the [Taktikal Portal](https://app-dev.taktikal.is/settings/access-keys).

## Useful links

- [Taktikal documentation](https://docs.taktikal.is/docs/api/)
- [Taktikal Portal](https://app-dev.taktikal.is/settings/access-keys)
- [Taktikal API](https://onboardingdev.taktikal.is/api/swagger-ui/)

## Code owners and maintainers

- [Prógramm](https://github.com/orgs/island-is/teams/programm/members)
