import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DraftRegulationService } from './draft_regulation.service'
import { DraftRegulationController } from './draft_regulation.controller'
import { DraftRegulationModel } from './draft_regulation.model'
import { DraftRegulationChangeModule } from '../draft_regulation_change'
import { DraftRegulationCancelModule } from '../draft_regulation_cancel'
import { RegulationsService } from '@island.is/clients/regulations'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { DraftAuthorModule } from '../draft_author'

@Module({
  imports: [
    SequelizeModule.forFeature([DraftRegulationModel]),
    DraftAuthorModule,
    DraftRegulationChangeModule,
    DraftRegulationCancelModule,
    NationalRegistryV3ClientModule,
  ],
  providers: [DraftRegulationService, RegulationsService],
  controllers: [DraftRegulationController],
  exports: [DraftRegulationService, RegulationsService],
})
export class DraftRegulationModule {}
