import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  DelegationConfig,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'
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
import { DomainsModule } from './domains/domains.module'
import { ScopesModule } from './scopes/scopes.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ClientsModule,
    DelegationsModule,
    DomainsModule,
    ScopesModule,
    ProblemModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        DelegationConfig,
        FeatureFlagConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        RskRelationshipsClientConfig,
        XRoadConfig,
      ],
    }),
  ],
})
export class AppModule {}
