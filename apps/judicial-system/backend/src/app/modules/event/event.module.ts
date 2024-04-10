import { forwardRef, Module } from '@nestjs/common'

import { DateLogModule } from '..'
import { EventService } from './event.service'

@Module({
  imports: [forwardRef(() => DateLogModule)],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
