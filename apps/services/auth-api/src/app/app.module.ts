import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  DelegationConfig,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { RskProcuringClientConfig } from '@island.is/clients/rsk/procuring'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'

import { environment } from '../environments'

import { ClientsModule } from './modules/clients/clients.module'
import { DelegationsModule } from './modules/delegations/delegations.module'
import { GrantsModule } from './modules/grants/grants.module'
import { PermissionsModule } from './modules/permissions/permissions.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { TranslationModule } from './modules/translation/translation.module'
import { UserProfileModule } from './modules/user-profile/user-profile.module'
import { UsersModule } from './modules/users/users.module'

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
        DelegationConfig,
        FeatureFlagConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        RskProcuringClientConfig,
        XRoadConfig,
      ],
    }),
  ],
})
export class AppModule {}
