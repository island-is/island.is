import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case, CaseArchive, DateLog, Subpoena } from '../repository'
import { RepositoryModule } from '..'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
  imports: [
    forwardRef(() => RepositoryModule),
    SequelizeModule.forFeature([Case, Subpoena, CaseArchive, DateLog]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
