import { forwardRef, Module } from '@nestjs/common'

import { DateLogModule } from '../index'
import { EventService } from './event.service'

@Module({
  imports: [forwardRef(() => DateLogModule)],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
