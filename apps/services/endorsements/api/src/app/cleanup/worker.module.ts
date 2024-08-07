import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { LoggingModule } from '@island.is/logging'
import { EndorsementSystemCleanupWorkerService } from './worker.service'

import { Endorsement } from '../modules/endorsement/models/endorsement.model'
import { SequelizeConfigService } from '../sequelizeConfig.service'
import {
  NationalRegistryV3ClientConfig,
  NationalRegistryV3ClientModule,
} from '@island.is/clients/national-registry-v3'
import { ConfigModule } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'

@Module({
  imports: [
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Endorsement]),
    NationalRegistryV3ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [NationalRegistryV3ClientConfig, IdsClientConfig, XRoadConfig],
    }),
  ],
  providers: [EndorsementSystemCleanupWorkerService],
})
export class EndorsementSystemCleanupWorkerModule {}
