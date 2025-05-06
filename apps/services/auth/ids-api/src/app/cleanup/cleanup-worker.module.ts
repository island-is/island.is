import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  DelegationConfig,
  Grant,
  GrantsService,
  IdentityConfirmation,
  IdentityConfirmationModule,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { LoggingModule } from '@island.is/logging'

import { CleanupService } from './cleanup.service'
import { CleanupConfirmIdentityService } from '../confirm-identity/cleanup/cleanup.service'
import { ConfigModule } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { ZendeskServiceConfig } from '@island.is/clients/zendesk'
import { smsModuleConfig } from '@island.is/nova-sms'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../../environments'

@Module({
  imports: [
    LoggingModule,
    IdentityConfirmationModule,
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Grant, IdentityConfirmation]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        ZendeskServiceConfig,
        smsModuleConfig,
        NationalRegistryV3ClientConfig,
        RskRelationshipsClientConfig,
        IdsClientConfig,
        CompanyRegistryConfig,
        FeatureFlagConfig,
        SyslumennClientConfig,
        NationalRegistryClientConfig,
        DelegationConfig,
      ],
      envFilePath: ['.env', '.env.secret'],
    }),
  ],
  providers: [CleanupService, GrantsService, CleanupConfirmIdentityService],
})
export class CleanupWorkerModule {}
