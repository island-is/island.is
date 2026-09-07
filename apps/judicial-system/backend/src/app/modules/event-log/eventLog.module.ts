import { forwardRef, Module } from '@nestjs/common'

import { RepositoryModule } from '..'
import { EventLogController } from './eventLog.controller'
import { EventLogService } from './eventLog.service'

@Module({
  imports: [forwardRef(() => RepositoryModule)],
  providers: [EventLogService],
  exports: [EventLogService],
  controllers: [EventLogController],
})
export class EventLogModule {}
