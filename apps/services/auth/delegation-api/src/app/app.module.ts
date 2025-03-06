import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  DelegationApiUserSystemNotificationConfig,
  DelegationConfig,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import { AuditConfig, AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'
import { ZendeskServiceConfig } from '@island.is/clients/zendesk'

import { environment } from '../environments'
import { ClientsModule } from './clients/clients.module'
import { DelegationsModule } from './delegations/delegations.module'
import { DomainsModule } from './domains/domains.module'
import { LoginRestrictionsModule } from './login-restrictions/login-restrictions.module'
import { ScopesModule } from './scopes/scopes.module'

@Module({
  imports: [
    AuditModule,
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ClientsModule,
    DelegationsModule,
    DomainsModule,
    ScopesModule,
    ProblemModule,
    LoginRestrictionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        DelegationConfig,
        FeatureFlagConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        NationalRegistryV3ClientConfig,
        RskRelationshipsClientConfig,
        CompanyRegistryConfig,
        XRoadConfig,
        DelegationApiUserSystemNotificationConfig,
        SyslumennClientConfig,
        ZendeskServiceConfig,
        AuditConfig
      ],
    }),
  ],
})
export class AppModule {}
