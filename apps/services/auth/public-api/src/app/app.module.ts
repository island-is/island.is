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
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../environments'
import { DelegationsModule } from './modules/delegations/delegations.module'
import { PasskeysModule } from './modules/passkeys/passkeys.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ProblemModule,
    DelegationsModule,
    PasskeysModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        DelegationConfig,
        FeatureFlagConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        RskRelationshipsClientConfig,
        CompanyRegistryConfig,
        XRoadConfig,
        PasskeysCoreConfig,
        SyslumennClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
