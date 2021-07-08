import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DraftRegulationChangeService } from './draft_regulation_change.service'
import { DraftRegulationChangeController } from './draft_regulation_change.controller'
import { DraftRegulationChange } from './draft_regulation_change.model'

@Module({
  imports: [SequelizeModule.forFeature([DraftRegulationChange])],
  providers: [DraftRegulationChangeService],
  controllers: [DraftRegulationChangeController],
  exports: [DraftRegulationChangeService],
})
export class DraftRegulationChangeModule {}
