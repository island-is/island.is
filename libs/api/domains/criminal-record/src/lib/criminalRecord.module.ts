import { Module } from '@nestjs/common'

import { CriminalRecordService } from './criminalRecord.service'
import { CriminalRecordApiModule } from '@island.is/clients/criminal-record'

@Module({
  providers: [CriminalRecordService],
  exports: [CriminalRecordService],
  imports: [CriminalRecordApiModule],
})
export class CriminalRecordModule {}
