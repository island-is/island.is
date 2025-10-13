import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { UserProfileService } from './user-profile.service'
import { Configuration, V2MeApi } from '@island.is/clients/user-profile'
import { BankinfoClientModule } from '@island.is/clients/fjs/bank-info'

export class UserProfileModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: UserProfileModule,
      imports: [BankinfoClientModule],
      providers: [
        UserProfileService,
        {
          provide: V2MeApi,
          useFactory: () =>
            new V2MeApi(
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
