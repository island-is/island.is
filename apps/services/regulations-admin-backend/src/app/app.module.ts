import { Module } from '@nestjs/common'
import {
  ConfigModule,
  XRoadConfig,
  IdsClientConfig,
} from '@island.is/nest/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule, AuditConfig } from '@island.is/nest/audit'

import { environment } from '../environments'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { RegulationsClientConfig } from '@island.is/clients/regulations'
import { DraftRegulationModule } from './modules/draft_regulation'
import { DraftRegulationChangeModule } from './modules/draft_regulation_change'
import { DraftRegulationCancelModule } from './modules/draft_regulation_cancel'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    AuthModule,
    AuditModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DraftRegulationModule,
    DraftRegulationChangeModule,
    DraftRegulationCancelModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        RegulationsClientConfig,
        XRoadConfig,
        NationalRegistryV3ClientConfig,
        IdsClientConfig,
        AuditConfig
      ],
    }),
  ],
})
export class AppModule {}
