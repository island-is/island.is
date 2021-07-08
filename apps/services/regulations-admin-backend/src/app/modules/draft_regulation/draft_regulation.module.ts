import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DraftRegulationService } from './draft_regulation.service'
import { DraftRegulationController } from './draft_regulation.controller'
import { DraftRegulation } from './draft_regulation.model'

@Module({
  imports: [SequelizeModule.forFeature([DraftRegulation])],
  providers: [DraftRegulationService],
  controllers: [DraftRegulationController],
  exports: [DraftRegulationService],
})
export class DraftRegulationModule {}
