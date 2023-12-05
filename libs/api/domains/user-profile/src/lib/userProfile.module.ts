import { DynamicModule } from '@nestjs/common'
import {
  Configuration,
  UserProfileApi,
  V2MeApi,
} from '@island.is/clients/user-profile'
import { UserProfileResolver } from './userProfile.resolver'
import { UserProfileService } from './userProfile.service'
import { IslykillService } from './islykill.service'
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
        IslykillService,
        ...[UserProfileApi, V2MeApi].map((Api) => ({
          provide: Api,
          useFactory: () =>
            new Api(
              new Configuration({
                fetchApi: fetch,
                basePath: config.userProfileServiceBasePath,
              }),
            ),
        })),
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
