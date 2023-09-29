import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { EventLog } from './models/eventLog.model'
import { EventLogService } from './eventLog.service'

@Module({
  imports: [SequelizeModule.forFeature([EventLog])],
  providers: [EventLogService],
  exports: [EventLogService],
})
export class EventLogModule {}
