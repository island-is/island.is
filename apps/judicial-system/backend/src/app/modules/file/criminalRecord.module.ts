import { forwardRef, Module } from '@nestjs/common'

import { AwsS3Module } from '../aws-s3/awsS3.module'
import { EventModule } from '../event/event.module'
import { CriminalRecordService } from './criminalRecord.service'

@Module({
  imports: [forwardRef(() => EventModule), forwardRef(() => AwsS3Module)],
  providers: [CriminalRecordService],
  exports: [CriminalRecordService],
})
export class CriminalRecordModule {}
