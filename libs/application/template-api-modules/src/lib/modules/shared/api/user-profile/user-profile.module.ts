import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { UserProfileService } from './user-profile.service'
import { Configuration, V2UsersApi } from '@island.is/clients/user-profile'
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
