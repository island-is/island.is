import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AwsS3Module } from '../index'
import { Case, DateLog, Institution, Subpoena } from '../repository'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
  imports: [
    forwardRef(() => AwsS3Module),
    SequelizeModule.forFeature([Case, Subpoena, DateLog, Institution]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
