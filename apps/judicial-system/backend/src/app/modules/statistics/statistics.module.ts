import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case, DateLog } from '../case'
import { AwsS3Module } from '../index'
import { Institution } from '../institution'
import { Subpoena } from '../subpoena'
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
