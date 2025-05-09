import { forwardRef, Module } from '@nestjs/common'

import { EventModule } from '../event/event.module'
import { CriminalRecordService } from './criminalRecord.service'

@Module({
  imports: [forwardRef(() => EventModule)],
  providers: [CriminalRecordService],
  exports: [CriminalRecordService],
})
export class CriminalRecordModule {}
