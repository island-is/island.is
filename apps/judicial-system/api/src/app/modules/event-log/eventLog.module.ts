import { Module } from '@nestjs/common'

import { EventLogResolver } from './eventLog.resolver'

@Module({
  providers: [EventLogResolver],
})
export class EventLogModule {}
