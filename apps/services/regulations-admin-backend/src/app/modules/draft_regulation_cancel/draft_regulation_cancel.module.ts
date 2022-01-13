import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DraftRegulationCancelService } from './draft_regulation_cancel.service'
import { DraftRegulationCancelController } from './draft_regulation_cancel.controller'
import { DraftRegulationCancelModel } from './draft_regulation_cancel.model'

@Module({
  imports: [SequelizeModule.forFeature([DraftRegulationCancelModel])],
  providers: [DraftRegulationCancelService],
  controllers: [DraftRegulationCancelController],
  exports: [DraftRegulationCancelService],
})
export class DraftRegulationCancelModule {}
