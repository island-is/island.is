import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../..'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { UserProfileService } from './user-profile.service'

import { Configuration, UserProfileApi } from '@island.is/clients/user-profile'
import { IslyklarApi, IslykillApiModule } from '@island.is/clients/islykill'
export class UserProfileModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: UserProfileModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        IslykillApiModule.register({
          cert: config.islykill.cert,
          passphrase: config.islykill.passphrase,
          basePath: config.islykill.basePath,
        }),
      ],
      providers: [
        UserProfileService,
        IslyklarApi,
        {
          provide: UserProfileApi,
          useFactory: () =>
            new UserProfileApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.userProfile.serviceBasePath,
              }),
            ),
        },
      ],
      exports: [UserProfileService],
    }
  }
}
