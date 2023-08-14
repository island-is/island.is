import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  DelegationConfig,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'
import { UserProfileClientConfig } from '@island.is/clients/user-profile'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../environments'
import { ClientsModule } from './clients/clients.module'
import { DelegationsModule } from './delegations/delegations.module'
import { GrantsModule } from './grants/grants.module'
import { NotificationsModule } from './notifications/notifications.module'
import { PermissionsModule } from './permissions/permissions.module'
import { ResourcesModule } from './resources/resources.module'
import { TranslationModule } from './translation/translation.module'
import { UserProfileModule } from './user-profile/user-profile.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    ProblemModule,
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
    NotificationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        CompanyRegistryConfig,
        DelegationConfig,
        FeatureFlagConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        RskRelationshipsClientConfig,
        UserProfileClientConfig,
        XRoadConfig,
      ],
    }),
  ],
})
export class AppModule {}
