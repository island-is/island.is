import { Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthConfig, AuthModule } from '@island.is/auth-nest-tools'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { UserProfileClientConfig } from '@island.is/clients/user-profile'
import { AuthDelegationApiClientConfig } from '@island.is/clients/auth/delegation-api'

import { SequelizeConfigService } from './sequelizeConfig.service'
import { environment } from '../environments/environment'
import { UserNotificationsConfig } from '../config'
import { CmsConfig } from '@island.is/clients/cms'
import { emailModuleConfig } from '@island.is/email-service'

@Module({
  imports: [
    AuthModule.register({
      issuer: environment.auth.issuer,
      // audience: intentionally left out
    } as AuthConfig),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        UserNotificationsConfig,
        XRoadConfig,
        NationalRegistryV3ClientConfig,
        FeatureFlagConfig,
        UserProfileClientConfig,
        IdsClientConfig,
        AuthDelegationApiClientConfig,
        CmsConfig,
        emailModuleConfig,
      ],
    }),
    NotificationsModule,
  ],
})
export class AppModule {}
