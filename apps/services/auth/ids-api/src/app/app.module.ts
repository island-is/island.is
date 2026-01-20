import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  DelegationConfig,
  PasskeysCoreConfig,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import { UserProfileClientConfig } from '@island.is/clients/user-profile'
import { ZendeskServiceConfig } from '@island.is/clients/zendesk'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'
import { smsModuleConfig } from '@island.is/nova-sms'

import { environment } from '../environments'
import { ClientsModule } from './clients/clients.module'
import { DelegationsModule } from './delegations/delegations.module'
import { GrantsModule } from './grants/grants.module'
import { LoginRestrictionsModule } from './login-restrictions/login-restrictions.module'
import { NotificationsModule } from './notifications/notifications.module'
import { PasskeysModule } from './passkeys/passkeys.module'
import { PermissionsModule } from './permissions/permissions.module'
import { ResourcesModule } from './resources/resources.module'
import { SessionsModule } from './sessions/sessions.module'
import { TranslationModule } from './translation/translation.module'
import { UserProfileModule } from './user-profile/user-profile.module'
import { UsersModule } from './users/users.module'
import { ConfirmIdentityModule } from './confirm-identity/confirm-identity.module'

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
    LoginRestrictionsModule,
    ConfirmIdentityModule,
    PasskeysModule,
    SessionsModule,
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
        PasskeysCoreConfig,
        NationalRegistryV3ClientConfig,
        smsModuleConfig,
        SyslumennClientConfig,
        ZendeskServiceConfig,
      ],
    }),
  ],
})
export class AppModule {}
