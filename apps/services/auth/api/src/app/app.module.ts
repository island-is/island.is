import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  SequelizeConfigService,
  DelegationConfig,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { RskProcuringClientConfig } from '@island.is/clients/rsk/procuring'
import { UserProfileClientConfig } from '@island.is/clients/user-profile'

import { ClientsModule } from './modules/clients/clients.module'
import { GrantsModule } from './modules/grants/grants.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { UsersModule } from './modules/users/users.module'
import { environment } from '../environments'
import { TranslationModule } from './modules/translation/translation.module'
import { DelegationsModule } from './modules/delegations/delegations.module'
import { PermissionsModule } from './modules/permissions/permissions.module'
import { UserProfileModule } from './modules/user-profile/user-profile.module'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UsersModule,
    ClientsModule,
    ResourcesModule,
    GrantsModule,
    TranslationModule,
    DelegationsModule,
    PermissionsModule,
    UserProfileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        CompanyRegistryConfig,
        DelegationConfig,
        FeatureFlagConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        RskProcuringClientConfig,
        UserProfileClientConfig,
        XRoadConfig,
      ],
    }),
  ],
})
export class AppModule {}
