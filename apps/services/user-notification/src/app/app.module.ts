import { Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { AuthConfig, AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../environments/environment'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { UserProfileClientConfig } from '@island.is/clients/user-profile'

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
        XRoadConfig,
        NationalRegistryV3ClientConfig,
        FeatureFlagConfig,
        UserProfileClientConfig,
        IdsClientConfig,
      ],
    }),

    NotificationsModule
  ],
})
export class AppModule {}
