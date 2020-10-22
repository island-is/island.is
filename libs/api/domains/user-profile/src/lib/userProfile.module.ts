import { DynamicModule, Module } from '@nestjs/common'
import { Configuration, UserProfileApi } from '../../gen/fetch'
import { UserProfileResolver } from './userProfile.resolver'
import { UserProfileService } from './userProfile.service'

export interface Config {
  userProfileServiceBasePath: string
}

export class UserProfileModule {
  static register(config: Config): DynamicModule {
    console.log('config ', config)
    console.log(
      'config will be',
      config.userProfileServiceBasePath ?? 'http://localhost:3333',
    )
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
                basePath:
                  config.userProfileServiceBasePath ?? 'http://localhost:3333',
              }),
            ),
        },
      ],
      exports: [],
    }
  }
}
