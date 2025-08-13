import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { CriminalRecordSubmissionService } from './criminal-record-submission.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

@Module({
  imports: [SharedTemplateAPIModule, SyslumennClientModule],
  providers: [CriminalRecordSubmissionService],
  exports: [CriminalRecordSubmissionService],
})
export class CriminalRecordSubmissionModule {}
