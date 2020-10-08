import { Module } from '@nestjs/common'
import { Configuration, UserProfileApi } from '../../gen/fetch';
import { UserProfileResolver } from './userProfile.resolver';
import { UserProfileService } from './userProfile.service';

@Module({
  controllers: [],
  providers: [UserProfileService, UserProfileResolver, {
    provide: UserProfileApi,
    useFactory: () =>
      new UserProfileApi(
        new Configuration({
          fetchApi: fetch,
          basePath: 'http://localhost:3333',
        }),
      ),
  },
  ],
  exports: [],
})
export class UserProfileModule { }
