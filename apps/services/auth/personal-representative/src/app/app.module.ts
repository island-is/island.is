import { RightTypesModule } from './modules/rightTypes/rightTypes.module'
import { PersonalRepresentativesModule } from './modules/personalRepresentatives/personalRepresentatives.module'
import { PersonalRepresentativeTypesModule } from './modules/personalRepresentativeTypes/personalRepresentativeTypes.module'
import { AccessLogsModule } from './modules/accessLogs/accessLogs.module'
import {
  DelegationConfig,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'

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
      ],
    }),
    RightTypesModule,
    PersonalRepresentativesModule,
    PersonalRepresentativeTypesModule,
    AccessLogsModule,
  ],
})
export class AppModule {}
