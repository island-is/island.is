# User Profile Client

This library implements a client to use User Profile APIs

## app.module.ts

```js
import { ConfigModule } from '@island.is/nest/config'
import { UserProfileClientModule, UserProfileClientConfig } from '@island.is/clients/user-profile'

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

  async getStuff(@CurrentUser() user: User)
      return this.UserProfileApi.userTokenControllerGetDeviceTokens({nationalId:user.nationalId})

```

## machine client auth

Check out [AutoAuth](https://github.com/island-is/island.is/pull/6057).
