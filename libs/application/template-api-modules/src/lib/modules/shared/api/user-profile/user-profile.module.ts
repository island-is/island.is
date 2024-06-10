import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { UserProfileService } from './user-profile.service'

<<<<<<< HEAD
import { Configuration, UserProfileApi } from '@island.is/clients/user-profile'
=======
import { Configuration, V2UsersApi } from '@island.is/clients/user-profile'
>>>>>>> 4378172a27 (updating module file and imports in service)
import { IslykillApiModule } from '@island.is/clients/islykill'
export class UserProfileModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: UserProfileModule,
      imports: [
        IslykillApiModule.register({
          cert: config.islykill.cert,
          passphrase: config.islykill.passphrase,
          basePath: config.islykill.basePath,
        }),
      ],
      providers: [
        UserProfileService,
        {
          provide: V2UsersApi,
          useFactory: () =>
            new V2UsersApi(
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
