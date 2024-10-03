## app.module.ts

```js
import { Module } from '@nestjs/common' // Added import for Module
import { ConfigModule } from '@island.is/nest/config'
import {
  UserProfileClientModule,
  UserProfileClientConfig,
} from '@island.is/clients/user-profile'

@Module({
  imports: [
    UserProfileClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [UserProfileClientConfig],
    }),
  ],
})
export class AppModule {} // Added module export
```

## some-name.module.ts

```js
import { Module } from '@nestjs/common' // Added import for Module
import { UserProfileClientModule } from '@island.is/clients/user-profile'

@Module({
  imports: [UserProfileClientModule],
})
export class SomeNameModule {} // Added module export
```

## some-name.service.ts

```js
import { Injectable, Inject } from '@nestjs/common'; // Added import for Injectable and Inject
import { UserProfileApi } from '@island.is/clients/user-profile';
import { CurrentUser } from '@island.is/auth-nest-tools'; // Imported CurrentUser decorator
import { User } from '@island.is/auth-nest-tools'; // Imported User interface

@Injectable()
export class SomeService {
  constructor(
    @Inject(UserProfileApi)
    private readonly userProfileApi: UserProfileApi,
  ) {}

  async getStuff(@CurrentUser() user: User) {
    return this.userProfileApi.userTokenControllerGetDeviceTokens({
      nationalId: user.nationalId,
    });
  }
}
```
