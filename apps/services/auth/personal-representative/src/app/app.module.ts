import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  DelegationConfig,
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

import { environment } from '../environments'
import { AccessLogsModule } from './modules/accessLogs/accessLogs.module'
import { PersonalRepresentativesModule } from './modules/personalRepresentatives/personalRepresentatives.module'
import { PersonalRepresentativeTypesModule } from './modules/personalRepresentativeTypes/personalRepresentativeTypes.module'
import { RightTypesModule } from './modules/rightTypes/rightTypes.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        DelegationConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        RskRelationshipsClientConfig,
        CompanyRegistryConfig,
        XRoadConfig,
        FeatureFlagConfig,
        SyslumennClientConfig,
      ],
    }),
    RightTypesModule,
    PersonalRepresentativesModule,
    PersonalRepresentativeTypesModule,
    AccessLogsModule,
  ],
})
export class AppModule {}
