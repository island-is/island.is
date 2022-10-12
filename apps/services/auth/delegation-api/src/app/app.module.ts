import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  DelegationConfig,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'

import { DelegationsModule } from './delegations/delegations.module'
import { DomainsModule } from './domains/domains.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DelegationsModule,
    DomainsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        CompanyRegistryConfig,
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
