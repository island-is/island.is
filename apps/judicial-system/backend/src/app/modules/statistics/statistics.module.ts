import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case, DateLog } from '../case'
import { CaseArchive } from '../case/models/caseArchive.model'
import { Subpoena } from '../subpoena'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
  imports: [SequelizeModule.forFeature([Case, Subpoena, CaseArchive, DateLog])],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
