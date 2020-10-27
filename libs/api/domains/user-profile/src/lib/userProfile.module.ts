import { DynamicModule } from '@nestjs/common'
import { Configuration, UserProfileApi } from '../../gen/fetch'
import { UserProfileResolver } from './userProfile.resolver'
import { UserProfileService } from './userProfile.service'

export interface Config {
  userProfileServiceBasePath: string
}

export class UserProfileModule {
  static register(config: Config): DynamicModule {
    return {
      module: UserProfileModule,
      providers: [
        UserProfileService,
        UserProfileResolver,
        {
          provide: UserProfileApi,
          useFactory: () =>
            new UserProfileApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.userProfileServiceBasePath,
              }),
            ),
        },
      ],
      exports: [],
    }
  }
}
