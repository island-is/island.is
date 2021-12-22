# User Profile Client

This library implements a client to use User Profile APIs

## app.module.ts

```js
import { ConfigModule } from '@island.is/nest/config'
@Module({
  imports: [
      UserProfileClientModule,
      ConfigModule.forRoot({
        isGlobal:true,
        load:[UserProfileClientConfig]
      })
    ],
})
```

## some-name.module.ts

```js
import { UserProfileClientModule } from '@island.is/clients/user-profile'

  imports: [
    UserProfileClientModule
  ],
```

## some-name.service.ts

```js
import { UserProfileApi } from '@island.is/clients/user-profile'


@Injectable()
export class SomeService {
  constructor(
    @Inject(UserProfileApi)
    private readonly userProfileApi: UserProfileApi,
  ) {}

  async getStuff()
      const clientAuthToken = await acquireAuthToken()
      const currentAuth = convertTokenToAuth(clientAuthToken)
      return this.UserProfileApi.withMiddleware(new AuthMiddleware(currentAuth))
      .userTokenControllerGetDeviceTokens({nationalId:"0101302989"})
```
