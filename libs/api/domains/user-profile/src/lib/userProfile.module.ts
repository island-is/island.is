import { DynamicModule } from '@nestjs/common'
import { Configuration, UserProfileApi } from '../../gen/fetch'
import { UserProfileResolver } from './userProfile.resolver'
import { UserProfileService } from './userProfile.service'
import {
  IslykillApiModule,
  IslykillApiModuleConfig,
} from '@island.is/clients/islykill'

export interface Config {
  userProfileServiceBasePath: string
  islykill: IslykillApiModuleConfig
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
      imports: [
        IslykillApiModule.register({
          cert: config.islykill.cert,
          passphrase: config.islykill.passphrase,
          basePath: config.islykill.basePath,
        }),
      ],
      exports: [],
    }
  }
}
