import { forwardRef, Module } from '@nestjs/common'

import { AwsS3Module, EventModule } from '..'
import { CriminalRecordService } from './criminalRecord.service'

@Module({
  imports: [forwardRef(() => EventModule), forwardRef(() => AwsS3Module)],
  providers: [CriminalRecordService],
  exports: [CriminalRecordService],
})
export class CriminalRecordModule {}
