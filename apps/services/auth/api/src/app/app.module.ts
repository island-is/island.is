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

import { ClientsModule } from './v1/clients/clients.module'
import { GrantsModule } from './v1/grants/grants.module'
import { ResourcesModule } from './v1/resources/resources.module'
import { UsersModule } from './v1/users/users.module'
import { environment } from '../environments'
import { TranslationModule } from './v1/translation/translation.module'
import { DelegationsModule } from './v1/delegations/delegations.module'
import { PermissionsModule } from './v1/permissions/permissions.module'
import { UserProfileModule } from './v1/user-profile/user-profile.module'
import { DelegationsModule } from './v2/delegations/delegations.module'

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
