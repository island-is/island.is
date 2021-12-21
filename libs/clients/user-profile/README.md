# User Profile Client

This library implements a client to use User Profile APIs

### Import into other NestJS modules

Add the service to your module imports:

```typescript
import { Configuration, UserProfileApi } from '@island.is/clients/user-profile'

providers: [
  {
    provide: UserProfileApi,
    useFactory: () =>
      new UserProfileApi(
        new Configuration({
          fetchApi: fetch,
          basePath: config.userProfileServiceBasePath || "http://localhost:3366",
        }),
      ),
  },
],
```

Then you'll have access to user-profile APIs:

```typescript
import { UserProfileApi } from '@island.is/clients/user-profile'

@Injectable()
export class SomeService {
  constructor(private userProfileApi: UserProfileApi) {}

  async getStuff(): Promise<any> {
    return this.userProfileApi
      .withMiddleware(new AuthMiddleware(currentAuth))
      .userProfileControllerGetDeviceTokens({ nationalId: '0101302989' })
  }
}
```
