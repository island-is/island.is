import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { EventLog } from './models/eventLog.model'
import { EventLogService } from './eventLog.service'
import { EventLogController } from './eventLog.controller'

@Module({
  imports: [SequelizeModule.forFeature([EventLog])],
  controllers: [EventLogController],
  providers: [EventLogService],
  exports: [EventLogService],
})
export class EventLogModule {}
