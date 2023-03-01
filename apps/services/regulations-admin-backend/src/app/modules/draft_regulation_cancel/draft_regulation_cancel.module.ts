import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { RegulationsService } from '@island.is/clients/regulations'

import { DraftRegulationCancelService } from './draft_regulation_cancel.service'
import { DraftRegulationCancelController } from './draft_regulation_cancel.controller'
import { DraftRegulationCancelModel } from './draft_regulation_cancel.model'

import { environment } from '../../../environments'

@Module({
  imports: [SequelizeModule.forFeature([DraftRegulationCancelModel])],
  providers: [DraftRegulationCancelService, RegulationsService],
  controllers: [DraftRegulationCancelController],
  exports: [DraftRegulationCancelService],
})
export class DraftRegulationCancelModule {}
