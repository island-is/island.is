import { DynamicModule } from '@nestjs/common'
import { UserProfileClientModule } from '@island.is/clients/user-profile'
import { UserProfileResolver } from './userProfile.resolver'
import { UserProfileService } from './userProfile.service'
import { IslykillService } from './islykill.service'
import {
  IslykillApiModule,
  IslykillApiModuleConfig,
} from '@island.is/clients/islykill'
import { IdentityClientModule } from '@island.is/clients/identity'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { UserProfileServiceV2 } from './V2/userProfile.service'
import { AdminUserProfileResolver } from './adminUserProfile.resolver'
import { ActorProfileResolver } from './actorProfile.resolver'
import { UserEmailsService } from './modules/user-emails/userEmails.service'
import { EmailsLoader } from './modules/user-emails/emails.loader'
import { UserEmailsResolver } from './modules/user-emails/userEmails.resolver'

export interface Config {
  islykill: IslykillApiModuleConfig
}

export class UserProfileModule {
  static register(config: Config): DynamicModule {
    return {
      module: UserProfileModule,
      providers: [
        UserProfileService,
        UserProfileServiceV2,
        UserProfileResolver,
        ActorProfileResolver,
        AdminUserProfileResolver,
        IslykillService,
        UserEmailsResolver,
        UserEmailsService,
        EmailsLoader,
      ],
      imports: [
        FeatureFlagModule,
        IdentityClientModule,
        IslykillApiModule.register({
          cert: config.islykill.cert,
          passphrase: config.islykill.passphrase,
          basePath: config.islykill.basePath,
        }),
        UserProfileClientModule,
        IdentityClientModule,
      ],
      exports: [],
    }
  }
}
