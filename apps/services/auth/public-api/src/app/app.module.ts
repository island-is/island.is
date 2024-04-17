import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  SequelizeConfigService,
  DelegationConfig,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'

import { environment } from '../environments'
import { DelegationsModule } from './modules/delegations/delegations.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ProblemModule,
    DelegationsModule,
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
