import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case, CaseArchive, DateLog, Subpoena } from '../repository'
import { AwsS3Module, RepositoryModule } from '..'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
  imports: [
    forwardRef(() => RepositoryModule),
    forwardRef(() => AwsS3Module),
    SequelizeModule.forFeature([Case, Subpoena, CaseArchive, DateLog]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
