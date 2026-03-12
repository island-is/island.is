import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { EventLog } from '../repository'
import { EventLogController } from './eventLog.controller'
import { EventLogService } from './eventLog.service'

@Module({
  imports: [SequelizeModule.forFeature([EventLog])],
  providers: [EventLogService],
  exports: [EventLogService],
  controllers: [EventLogController],
})
export class EventLogModule {}
