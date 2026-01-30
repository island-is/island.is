import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'
import { ProblemModule } from '@island.is/nest/problem'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import environment from '../environments/environment'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { UserProfileModule } from './user-profile/user-profile.module'

import { AuthDelegationApiClientConfig } from '@island.is/clients/auth/delegation-api'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { smsModuleConfig } from '@island.is/nova-sms'
import { emailModuleConfig } from '@island.is/email-service'
import { UserProfileConfig } from '../config'

// TODO: Remove this comment (this is just to get feature deployment up)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        NationalRegistryV3ClientConfig,
        FeatureFlagConfig,
        IdsClientConfig,
        AuthDelegationApiClientConfig,
        UserProfileConfig,
        smsModuleConfig,
        emailModuleConfig,
      ],
    }),
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ProblemModule,
    LoggingModule,
    UserProfileModule,
  ],
})
export class AppModule {}
