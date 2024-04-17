import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DateLog } from './models/dateLog.model'
import { DateLogService } from './dateLog.service'

@Module({
  imports: [SequelizeModule.forFeature([DateLog])],
  providers: [DateLogService],
  exports: [DateLogService],
})
export class DateLogModule {}
