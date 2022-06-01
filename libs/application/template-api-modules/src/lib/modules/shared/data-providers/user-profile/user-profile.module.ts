import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../..'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../../types'

// Here you import your module service
import { UserProfileService } from './user-profile.service'

import { Configuration, UserProfileApi } from '@island.is/clients/user-profile'

export class UserProfileModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: UserProfileModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [
        UserProfileService,
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
